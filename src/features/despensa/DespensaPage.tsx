import { useState } from 'react'
import { CATEGORIAS, CATEGORIA_LABELS } from '@/types'
import { useProdutos } from './useProdutos'
import ProdutoRow from './ProdutoRow'
import ProdutoFormModal from './ProdutoFormModal'

export default function DespensaPage() {
  const { data: produtos, isLoading, isError } = useProdutos()
  const [modalAberto, setModalAberto] = useState(false)

  return (
    <section className="p-4">
      <header className="mb-4 flex items-start justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">Despensa</h1>
          <p className="text-sm text-gray-500">
            Catálogo de produtos com quantidades de referência.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModalAberto(true)}
          className="shrink-0 rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
        >
          + Novo
        </button>
      </header>

      {isLoading && <p className="text-sm text-gray-400">Carregando produtos…</p>}

      {isError && (
        <p className="text-sm text-red-600">
          Não foi possível carregar os produtos.
        </p>
      )}

      {produtos && produtos.length === 0 && (
        <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-400">
          Nenhum produto ainda. Toque em <strong>+ Novo</strong> para começar a
          montar sua despensa.
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
                    <ProdutoRow key={produto.id} produto={produto} />
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      )}

      <ProdutoFormModal
        aberto={modalAberto}
        onFechar={() => setModalAberto(false)}
      />
    </section>
  )
}
