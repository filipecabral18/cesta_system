import { useEffect, useState, type FormEvent } from 'react'
import {
  CATEGORIAS,
  CATEGORIA_LABELS,
  UNIDADES,
  UNIDADE_LABELS,
  produtoFormSchema,
  type Categoria,
  type Produto,
  type Unidade,
} from '@/types'
import { useAtualizarProduto, useCriarProduto } from './useProdutos'

interface Props {
  aberto: boolean
  onFechar: () => void
  // Quando presente, o modal edita esse item; ausente, cadastra um novo.
  produto?: Produto | null
}

export default function ItemFormModal({ aberto, onFechar, produto }: Props) {
  const criar = useCriarProduto()
  const atualizar = useAtualizarProduto()
  const editando = Boolean(produto)

  const [nome, setNome] = useState('')
  const [categoria, setCategoria] = useState<Categoria>('mercearia')
  const [unidade, setUnidade] = useState<Unidade>('un')
  const [erro, setErro] = useState<string | null>(null)

  // Ao abrir, preenche o formulário com os dados do item (edição) ou com os
  // padrões (novo). Depende de `aberto` para "resetar" a cada abertura.
  useEffect(() => {
    if (!aberto) return
    setNome(produto?.nome ?? '')
    setCategoria(produto?.categoria ?? 'mercearia')
    setUnidade(produto?.unidade ?? 'un')
    setErro(null)
  }, [aberto, produto])

  if (!aberto) return null

  const salvando = criar.isPending || atualizar.isPending

  function handleSubmit(evento: FormEvent) {
    evento.preventDefault()
    setErro(null)

    const dados = produtoFormSchema.safeParse({ nome, categoria, unidade })
    if (!dados.success) {
      setErro(dados.error.issues[0].message)
      return
    }

    const onSuccess = () => onFechar()
    const onError = (err: unknown) =>
      setErro(err instanceof Error ? err.message : 'Erro ao salvar o item.')

    if (produto) {
      atualizar.mutate({ id: produto.id, dados: dados.data }, { onSuccess, onError })
    } else {
      criar.mutate(dados.data, { onSuccess, onError })
    }
  }

  const campoClasse =
    'w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500'

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
      onClick={onFechar}
    >
      <div
        className="w-full max-w-md rounded-t-2xl bg-white p-5 shadow-lg sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-lg font-bold">
          {editando ? 'Editar item' : 'Novo item'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="nome" className="mb-1 block text-sm font-medium">
              Nome
            </label>
            <input
              id="nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className={campoClasse}
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="categoria" className="mb-1 block text-sm font-medium">
                Categoria
              </label>
              <select
                id="categoria"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value as Categoria)}
                className={campoClasse}
              >
                {CATEGORIAS.map((c) => (
                  <option key={c} value={c}>
                    {CATEGORIA_LABELS[c]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="unidade" className="mb-1 block text-sm font-medium">
                Unidade
              </label>
              <select
                id="unidade"
                value={unidade}
                onChange={(e) => setUnidade(e.target.value as Unidade)}
                className={campoClasse}
              >
                {UNIDADES.map((u) => (
                  <option key={u} value={u}>
                    {UNIDADE_LABELS[u]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {erro && (
            <p className="text-sm text-red-600" role="alert">
              {erro}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onFechar}
              className="flex-1 rounded-lg border border-gray-300 py-2.5 font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando}
              className="flex-1 rounded-lg bg-green-600 py-2.5 font-medium text-white hover:bg-green-700 disabled:opacity-60"
            >
              {salvando ? 'Salvando…' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
