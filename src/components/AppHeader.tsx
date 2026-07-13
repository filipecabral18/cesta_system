import { supabase } from '@/lib/supabaseClient'

// Cabeçalho fixo do app: nome, e-mail do usuário logado e botão de sair.
export default function AppHeader({ email }: { email: string }) {
  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
      <div className="min-w-0">
        <span className="font-bold">Cesta</span>
        <span className="ml-2 truncate text-xs text-gray-500">{email}</span>
      </div>
      <button
        type="button"
        onClick={() => supabase.auth.signOut()}
        className="shrink-0 text-sm font-medium text-gray-500 hover:text-red-600"
      >
        Sair
      </button>
    </header>
  )
}
