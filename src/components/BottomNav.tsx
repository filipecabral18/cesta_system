import { NavLink } from 'react-router-dom'

const itens = [
  { to: '/despensa', label: 'Despensa', icone: '🧺' },
  { to: '/listas', label: 'Listas', icone: '📝' },
]

export default function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 mx-auto max-w-md border-t border-gray-200 bg-white">
      <ul className="flex">
        {itens.map((item) => (
          <li key={item.to} className="flex-1">
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 py-2 text-xs font-medium transition-colors ${
                  isActive ? 'text-green-600' : 'text-gray-500'
                }`
              }
            >
              <span className="text-xl" aria-hidden>
                {item.icone}
              </span>
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
