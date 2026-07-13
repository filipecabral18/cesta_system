import { useMemo } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { CATEGORIAS, CATEGORIA_LABELS, UNIDADE_LABELS } from '@/types'
import {
  useConcluirLista,
  useItensLista,
  useLista,
  useMarcarComprado,
  useRealtimeItens,
} from './useCompra'

export default function CompraPage() {
  const { id } = useParams<{ id: string }>()
  if (!id) return <Navigate to="/listas" replace />
  return <CompraDetalhe listaId={id} />
}

function CompraDetalhe({ listaId }: { listaId: string }) {
  const { data: lista } = useLista(listaId)
  const { data: itens, isLoading, isError } = useItensLista(listaId)
  const marcar = useMarcarComprado(listaId)
  const concluir = useConcluirLista(listaId)

  // Liga a sincronização em tempo real desta lista.
  useRealtimeItens(listaId)

  const { comprados, total } = useMemo(() => {
    const total = itens?.length ?? 0
    const comprados = itens?.filter((i) => i.comprado).length ?? 0
    return { comprados, total }
  }, [itens])

  const progresso = total > 0 ? Math.round((comprados / total) * 100) : 0

  return (
    <section className="p-4">
      <header className="mb-4">
        <Link to="/listas" className="text-sm font-medium text-gray-500">
          ← Listas
        </Link>
        <div className="mt-1 flex items-center justify-between gap-2">
          <h1 className="min-w-0 truncate text-2xl font-bold">
            {lista?.nome ?? 'Lista'}
          </h1>
          {lista?.status === 'concluida' && (
            <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
              Concluída
            </span>
          )}
        </div>
      </header>

      {isLoading && <p className="text-sm text-gray-400">Carregando itens…</p>}
      {isError && (
        <p className="text-sm text-red-600">Não foi possível carregar a lista.</p>
      )}

      {itens && (
        <>
          {/* Barra de progresso */}
          <div className="mb-4">
            <div className="mb-1 flex justify-between text-xs text-gray-500">
              <span>
                {comprados} de {total} comprados
              </span>
              <span>{progresso}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-green-500 transition-all"
                style={{ width: `${progresso}%` }}
              />
            </div>
          </div>

          {/* Itens agrupados por categoria */}
          <div className="space-y-4">
            {CATEGORIAS.map((categoria) => {
              const doGrupo = itens.filter(
                (item) => item.produto?.categoria === categoria,
              )
              if (doGrupo.length === 0) return null

              return (
                <div key={categoria}>
                  <h2 className="mb-1 px-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    {CATEGORIA_LABELS[categoria]}
                  </h2>
                  <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white">
                    {doGrupo.map((item) => (
                      <li key={item.id}>
                        <label className="flex cursor-pointer items-center gap-3 px-4 py-3">
                          <input
                            type="checkbox"
                            checked={item.comprado}
                            onChange={() =>
                              marcar.mutate({
                                id: item.id,
                                comprado: !item.comprado,
                              })
                            }
                            className="h-5 w-5 shrink-0 accent-green-600"
                          />
                          <span
                            className={`min-w-0 flex-1 truncate ${
                              item.comprado
                                ? 'text-gray-400 line-through'
                                : ''
                            }`}
                          >
                            {item.produto?.nome ?? 'Produto'}
                          </span>
                          <span className="shrink-0 text-sm text-gray-500">
                            {item.quantidade}{' '}
                            {item.produto
                              ? UNIDADE_LABELS[item.produto.unidade]
                              : ''}
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>

          {/* Concluir lista */}
          {lista?.status === 'aberta' && (
            <button
              type="button"
              onClick={() => concluir.mutate()}
              disabled={concluir.isPending}
              className="mt-6 w-full rounded-lg bg-green-600 py-3 font-medium text-white hover:bg-green-700 disabled:opacity-60"
            >
              {concluir.isPending ? 'Concluindo…' : 'Concluir lista'}
            </button>
          )}
        </>
      )}
    </section>
  )
}
