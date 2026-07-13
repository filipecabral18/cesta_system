import { Link } from 'react-router-dom'
import type { StatusLista } from '@/types'
import { formatarData } from '@/lib/formato'
import { useListas } from './useListas'

const STATUS_BADGE: Record<StatusLista, string> = {
  aberta: 'bg-green-100 text-green-700',
  concluida: 'bg-gray-100 text-gray-500',
}

const STATUS_LABEL: Record<StatusLista, string> = {
  aberta: 'Aberta',
  concluida: 'Concluída',
}

export default function ListasPage() {
  const { data: listas, isLoading, isError } = useListas()

  return (
    <section className="p-4">
      <header className="mb-4 flex items-start justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">Listas</h1>
          <p className="text-sm text-gray-500">Suas listas de compras.</p>
        </div>
        <Link
          to="/listas/nova"
          className="shrink-0 rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
        >
          + Nova lista
        </Link>
      </header>

      {isLoading && <p className="text-sm text-gray-400">Carregando listas…</p>}

      {isError && (
        <p className="text-sm text-red-600">
          Não foi possível carregar as listas.
        </p>
      )}

      {listas && listas.length === 0 && (
        <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-400">
          Nenhuma lista ainda. Toque em <strong>+ Nova lista</strong> para criar
          a primeira.
        </div>
      )}

      {listas && listas.length > 0 && (
        <ul className="space-y-2">
          {listas.map((lista) => (
            <li
              key={lista.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{lista.nome}</p>
                <p className="text-xs text-gray-400">
                  {formatarData(lista.created_at)}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE[lista.status]}`}
              >
                {STATUS_LABEL[lista.status]}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
