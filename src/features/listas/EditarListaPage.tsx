import { useMemo, useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { listaFormSchema, type Lista, type ProdutoComReferencia } from '@/types'
import {
  useItensLista,
  useLista,
  type ItemComProduto,
} from '../compra/useCompra'
import { useDespensa } from '../despensa/useDespensa'
import SeletorProdutos from './SeletorProdutos'
import { itensSelecionados, type LinhaEstado } from './linhasLista'
import { useEditarLista } from './useListas'

export default function EditarListaPage() {
  const { id } = useParams<{ id: string }>()
  if (!id) return <Navigate to="/listas" replace />
  return <EditarListaDados listaId={id} />
}

// Só monta o formulário com tudo carregado, para o estado inicial ser preenchido
// uma única vez (um refetch não apaga o que está sendo editado).
function EditarListaDados({ listaId }: { listaId: string }) {
  const lista = useLista(listaId)
  const itens = useItensLista(listaId)
  const despensa = useDespensa()

  if (lista.isLoading || itens.isLoading || despensa.isLoading) {
    return <p className="p-4 text-sm text-gray-400">Carregando lista…</p>
  }

  if (!lista.data || !itens.data || !despensa.data) {
    return (
      <p className="p-4 text-sm text-red-600">
        Não foi possível carregar a lista.
      </p>
    )
  }

  if (lista.data.status !== 'aberta') {
    return <Navigate to={`/listas/${listaId}`} replace />
  }

  return (
    <EditarListaForm
      lista={lista.data}
      itens={itens.data}
      produtos={despensa.data}
    />
  )
}

interface FormProps {
  lista: Lista
  itens: ItemComProduto[]
  produtos: ProdutoComReferencia[]
}

function EditarListaForm({ lista, itens, produtos }: FormProps) {
  const navigate = useNavigate()
  const editar = useEditarLista(lista.id)

  const [nome, setNome] = useState(lista.nome)
  const [erro, setErro] = useState<string | null>(null)

  const [linhas, setLinhas] = useState<Record<string, LinhaEstado>>(() => {
    const naLista = new Map(itens.map((i) => [i.produto_id, i.quantidade]))
    const inicial: Record<string, LinhaEstado> = {}
    for (const p of produtos) {
      const quantidade = naLista.get(p.id)
      inicial[p.id] = {
        incluido: quantidade !== undefined,
        quantidade: String(quantidade ?? p.quantidade_referencia),
      }
    }
    return inicial
  })

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

    const dados = listaFormSchema.pick({ nome: true }).safeParse({ nome })
    if (!dados.success) {
      setErro(dados.error.issues[0].message)
      return
    }

    const itensNovos = itensSelecionados(produtos, linhas)
    if (itensNovos.length === 0) {
      setErro('Selecione ao menos um produto com quantidade maior que zero.')
      return
    }

    editar.mutate(
      { nome: dados.data.nome, itens: itensNovos },
      {
        onSuccess: () => navigate(`/listas/${lista.id}`),
        onError: (err) =>
          setErro(err instanceof Error ? err.message : 'Erro ao salvar a lista.'),
      },
    )
  }

  return (
    <section className="p-4">
      <header className="mb-4 flex items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">Editar lista</h1>
        <Link
          to={`/listas/${lista.id}`}
          className="text-sm font-medium text-gray-500"
        >
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
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          />
        </div>

        <SeletorProdutos
          produtos={produtos}
          linhas={linhas}
          onAlternarIncluido={alternarIncluido}
          onMudarQuantidade={mudarQuantidade}
        />

        {erro && (
          <p className="text-sm text-red-600" role="alert">
            {erro}
          </p>
        )}

        <button
          type="submit"
          disabled={editar.isPending}
          className="w-full rounded-lg bg-green-600 py-3 font-medium text-white hover:bg-green-700 disabled:opacity-60"
        >
          {editar.isPending
            ? 'Salvando…'
            : `Salvar alterações (${totalSelecionados} ${
                totalSelecionados === 1 ? 'item' : 'itens'
              })`}
        </button>
      </form>
    </section>
  )
}
