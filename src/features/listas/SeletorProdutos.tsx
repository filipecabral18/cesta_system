import {
  CATEGORIAS,
  CATEGORIA_LABELS,
  UNIDADE_LABELS,
  type ProdutoComReferencia,
} from '@/types'
import type { LinhaEstado } from './linhasLista'

interface Props {
  produtos: ProdutoComReferencia[]
  linhas: Record<string, LinhaEstado>
  onAlternarIncluido: (id: string) => void
  onMudarQuantidade: (id: string, quantidade: string) => void
}

export default function SeletorProdutos({
  produtos,
  linhas,
  onAlternarIncluido,
  onMudarQuantidade,
}: Props) {
  return (
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
                      onChange={() => onAlternarIncluido(produto.id)}
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
                        onMudarQuantidade(produto.id, e.target.value)
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
  )
}
