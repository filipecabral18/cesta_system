import { useState, type FormEvent } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { loginSchema } from '@/types/auth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  async function handleSubmit(evento: FormEvent) {
    evento.preventDefault()
    setErro(null)

    // 1. Valida o formato com Zod antes de chamar a rede.
    const dados = loginSchema.safeParse({ email, senha })
    if (!dados.success) {
      setErro(dados.error.issues[0].message)
      return
    }

    // 2. Autentica no Supabase. Em caso de sucesso não fazemos nada aqui:
    //    o onAuthStateChange do AuthProvider percebe a nova sessão e o App
    //    troca sozinho da tela de login para o app.
    setEnviando(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: dados.data.email,
      password: dados.data.senha,
    })
    setEnviando(false)

    if (error) {
      // Traduz as causas mais comuns; nas demais, mostra a mensagem original
      // (útil para depurar durante o desenvolvimento).
      const causa = error.message.toLowerCase()
      if (causa.includes('invalid login')) {
        setErro('E-mail ou senha inválidos.')
      } else if (causa.includes('not confirmed')) {
        setErro(
          'E-mail ainda não confirmado. No painel do Supabase, confirme o usuário (opção "Auto Confirm").',
        )
      } else {
        setErro(error.message)
      }
    }
  }

  return (
    <div className="flex min-h-full items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-6 text-center">
          <div className="text-4xl" aria-hidden>
            🧺
          </div>
          <h1 className="mt-2 text-2xl font-bold">Cesta</h1>
          <p className="text-sm text-gray-500">Entre para acessar a despensa</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div>
            <label htmlFor="senha" className="mb-1 block text-sm font-medium">
              Senha
            </label>
            <input
              id="senha"
              type="password"
              autoComplete="current-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          {erro && (
            <p className="text-sm text-red-600" role="alert">
              {erro}
            </p>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="w-full rounded-lg bg-green-600 py-2.5 font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-60"
          >
            {enviando ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
