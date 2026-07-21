import { supabase } from '@/lib/supabaseClient'

// Cabeçalho do app: identidade da marca, e-mail do usuário logado e botão de sair.
// Fica preso no topo (sticky) para permanecer visível mesmo com a lista rolando.
export default function AppHeader({ email }: { email: string }) {
  return (
    <header className="sticky top-0 z-20 bg-gradient-to-r from-green-600 to-green-500 pt-[env(safe-area-inset-top)] text-white shadow-md shadow-green-900/10">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15 text-lg shadow-inner"
            aria-hidden
          >
            🧺
          </span>
          <div className="min-w-0 leading-tight">
            <span className="block font-bold tracking-tight">Cesta</span>
            <span className="block truncate text-[11px] text-white/70">{email}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => supabase.auth.signOut()}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-white/25 active:bg-white/30"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            aria-hidden
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sair
        </button>
      </div>
    </header>
  )
}
