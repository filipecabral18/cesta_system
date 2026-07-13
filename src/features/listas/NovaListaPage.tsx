import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CATEGORIAS,
  CATEGORIA_LABELS,
  UNIDADE_LABELS,
  type ModoCriacao,
} from '@/types'
import { useProdutos } from '../despensa/useProdutos'
import { useCriarLista } from './useListas'

// Estado de cada produto na tela de montagem: se entra na lista e com que
// quantidade (string, porque vem de um <input>).
interface LinhaEstado {
  incluido: boolean
  quantidade: string
}

export default function NovaListaPage() {
  const navigate = useNavigate()
  const { data: produtos, isLoading } = useProdutos()
  const criar = useCriarLista()

  const [nome, setNome] = useState('')
  const [modo, setModo] = useState<ModoCriacao>('vazia')
  const [linhas, setLinhas] = useState<Record<string, LinhaEstado>>({})
  const [erro, setErro] = useState<string | null>(null)

  // Quando os produtos chegam, garante uma entrada para cada um (sem apagar o
  // que o usuário já ajustou). A quantidade padrão é a de referência.
  useEffect(() => {
    if (!produtos) return
    setLinhas((atual) => {
      const novo: Record<string, LinhaEstado> = {}
      for (const p of produtos) {
        novo[p.id] = atual[p.id] ?? {
          incluido: false,
          quantidade: String(p.quantidade_referencia),
        }
      }
      return novo
    })
  }, [produtos])

  // Troca o modo e "reseta" a seleção de acordo:
  //   vazia      -> nada marcado (você escolhe do zero)
  //   referencia -> tudo marcado com a quantidade de referência
  function aplicarModo(novoModo: ModoCriacao) {
    setModo(novoModo)
    if (!produtos) return
    const novo: Record<string, LinhaEstado> = {}
    for (const p of produtos) {
      novo[p.id] = {
        incluido: novoModo === 'referencia',
        quantidade: String(p.quantidade_referencia),
      }
    }
    setLinhas(novo)
  }

  function alternarIncluido(id: string) {
    setLinhas((a) => ({ ...a, [id]: { ...a[id], incluido: !a[id].incluido } }))
  }

  function mudarQuantidade(id: string, quantidade: string) {
    setLinhas((a) => ({ ...a, [id]: { ...a[id], quantidade } }))
  }

  const totalSelecionados = useMemo(
    () => Object.values(linhas).filter((l) => l.incluido).length,
    [linhas],
  )

  function handleSubmit(evento: FormEvent) {
    evento.preventDefault()
    setErro(null)

    const nomeTrim = nome.trim()
    if (!nomeTrim) {
      setErro('Dê um nome para a lista.')
      return
    }

    const itens = (produtos ?? [])
      .filter((p) => linhas[p.id]?.incluido)
      .map((p) => ({
        produto_id: p.id,
        quantidade: Number(linhas[p.id].quantidade),
      }))
      .filter((i) => Number.isFinite(i.quantidade) && i.quantidade > 0)

    if (itens.length === 0) {
      setErro('Selecione ao menos um produto com quantidade maior que zero.')
      return
    }

    criar.mutate(
      { nome: nomeTrim, modo_criacao: modo, itens },
      {
        onSuccess: () => navigate('/listas'),
        onError: (err) =>
          setErro(err instanceof Error ? err.message : 'Erro ao criar a lista.'),
      },
    )
  }

  if (isLoading) {
    return <p className="p-4 text-sm text-gray-400">Carregando produtos…</p>
  }

  // Sem produtos na despensa não há como montar uma lista.
  if (!produtos || produtos.length === 0) {
    return (
      <section className="p-4">
        <h1 className="mb-2 text-2xl font-bold">Nova lista</h1>
        <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-400">
          Cadastre produtos na{' '}
          <Link to="/despensa" className="font-medium text-green-600">
            Despensa
          </Link>{' '}
          antes de criar uma lista.
        </div>
      </section>
    )
  }

  return (
    <section className="p-4">
      <header className="mb-4 flex items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">Nova lista</h1>
        <Link to="/listas" className="text-sm font-medium text-gray-500">
          Cancelar
        </Link>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="nome" className="mb-1 block text-sm font-medium">
            Nome da lista
          </label>
          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex.: Compras de julho"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          />
        </div>

        <div>
          <span className="mb-1 block text-sm font-medium">Como começar</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => aplicarModo('vazia')}
              className={`rounded-lg border px-3 py-2 text-sm font-medium ${
                modo === 'vazia'
                  ? 'border-green-600 bg-green-50 text-green-700'
                  : 'border-gray-300 text-gray-600'
              }`}
            >
              Vazia
            </button>
            <button
              type="button"
              onClick={() => aplicarModo('referencia')}
              className={`rounded-lg border px-3 py-2 text-sm font-medium ${
                modo === 'referencia'
                  ? 'border-green-600 bg-green-50 text-green-700'
                  : 'border-gray-300 text-gray-600'
              }`}
            >
              Usar referência
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-400">
            {modo === 'vazia'
              ? 'Marque os produtos que quer incluir.'
              : 'Já vem tudo marcado nas quantidades de referência; ajuste à vontade.'}
          </p>
        </div>

        <div className="space-y-4">
          {CATEGORIAS.map((categoria) => {
            const doGrupo = produtos.filter((p) => p.categoria === categoria)
            if (doGrupo.length === 0) return null

            return (
              <div key={categoria}>
                <h2 className="mb-1 px-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  {CATEGORIA_LABELS[categoria]}
                </h2>
                <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white">
                  {doGrupo.map((produto) => {
                    const linha = linhas[produto.id]
                    if (!linha) return null
                    return (
                      <li
                        key={produto.id}
                        className="flex items-center gap-3 px-4 py-3"
                      >
                        <input
                          type="checkbox"
                          checked={linha.incluido}
                          onChange={() => alternarIncluido(produto.id)}
                          className="h-5 w-5 shrink-0 accent-green-600"
                          aria-label={`Incluir ${produto.nome}`}
                        />
                        <span
                          className={`min-w-0 flex-1 truncate ${
                            linha.incluido ? '' : 'text-gray-400'
                          }`}
                        >
                          {produto.nome}
                        </span>
                        <input
                          type="number"
                          inputMode="decimal"
                          min={0}
                          step="any"
                          value={linha.quantidade}
                          onChange={(e) =>
                            mudarQuantidade(produto.id, e.target.value)
                          }
                          disabled={!linha.incluido}
                          className="w-16 rounded-md border border-gray-300 px-2 py-1 text-right focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 disabled:bg-gray-50 disabled:opacity-60"
                        />
                        <span className="w-10 text-sm text-gray-500">
                          {UNIDADE_LABELS[produto.unidade]}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </div>

        {erro && (
          <p className="text-sm text-red-600" role="alert">
            {erro}
          </p>
        )}

        <button
          type="submit"
          disabled={criar.isPending}
          className="w-full rounded-lg bg-green-600 py-3 font-medium text-white hover:bg-green-700 disabled:opacity-60"
        >
          {criar.isPending
            ? 'Salvando…'
            : `Salvar lista (${totalSelecionados} ${
                totalSelecionados === 1 ? 'item' : 'itens'
              })`}
        </button>
      </form>
    </section>
  )
}
