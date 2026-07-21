import { useState } from 'react'
import { CATEGORIAS, CATEGORIA_LABELS, type Produto } from '@/types'
import { useProdutos } from './useProdutos'
import ItemRow from './ItemRow'
import ItemFormModal from './ItemFormModal'

export default function CadastroPage() {
  const { data: produtos, isLoading, isError } = useProdutos()
  const [modalAberto, setModalAberto] = useState(false)
  // Item em edição; null quando o modal está criando um novo.
  const [emEdicao, setEmEdicao] = useState<Produto | null>(null)

  function abrirNovo() {
    setEmEdicao(null)
    setModalAberto(true)
  }

  function abrirEdicao(produto: Produto) {
    setEmEdicao(produto)
    setModalAberto(true)
  }

  return (
    <section className="p-4">
      <header className="mb-4 flex items-start justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">Itens</h1>
          <p className="text-sm text-gray-500">
            Catálogo de itens: categoria, nome e unidade de medida.
          </p>
        </div>
        <button
          type="button"
          onClick={abrirNovo}
          className="shrink-0 rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
        >
          + Novo
        </button>
      </header>

      {isLoading && <p className="text-sm text-gray-400">Carregando itens…</p>}

      {isError && (
        <p className="text-sm text-red-600">Não foi possível carregar os itens.</p>
      )}

      {produtos && produtos.length === 0 && (
        <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-400">
          Nenhum item ainda. Toque em <strong>+ Novo</strong> para cadastrar o
          primeiro.
        </div>
      )}

      {produtos && produtos.length > 0 && (
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
                  {doGrupo.map((produto) => (
                    <ItemRow
                      key={produto.id}
                      produto={produto}
                      onEditar={abrirEdicao}
                    />
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      )}

      <ItemFormModal
        aberto={modalAberto}
        produto={emEdicao}
        onFechar={() => setModalAberto(false)}
      />
    </section>
  )
}
