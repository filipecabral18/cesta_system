import { UNIDADE_LABELS, type Produto } from '@/types'
import { useExcluirProduto } from './useProdutos'

interface Props {
  produto: Produto
  onEditar: (produto: Produto) => void
}

// Uma linha do catálogo, com ações de editar e excluir.
export default function ItemRow({ produto, onEditar }: Props) {
  const excluir = useExcluirProduto()

  function handleExcluir() {
    const ok = window.confirm(`Excluir "${produto.nome}"?`)
    if (!ok) return
    excluir.mutate(produto.id, {
      onError: (err) =>
        window.alert(
          err instanceof Error ? err.message : 'Não foi possível excluir o item.',
        ),
    })
  }

  return (
    <li className="flex items-center gap-3 px-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="truncate">{produto.nome}</p>
        <p className="text-xs text-gray-400">{UNIDADE_LABELS[produto.unidade]}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={() => onEditar(produto)}
          className="rounded-md px-2 py-1 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        >
          Editar
        </button>
        <button
          type="button"
          onClick={handleExcluir}
          disabled={excluir.isPending}
          className="rounded-md px-2 py-1 text-sm font-medium text-red-500 hover:bg-red-50 disabled:opacity-60"
        >
          Excluir
        </button>
      </div>
    </li>
  )
}
