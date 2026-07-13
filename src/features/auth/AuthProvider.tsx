import { useEffect, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabaseClient'
import { AuthContext } from './authContext'

// Mantém a sessão do Supabase em estado do React e a compartilha via contexto.
// Duas fontes atualizam a sessão:
//   1. getSession()          -> sessão já existente ao abrir o app (evita
//                               "piscar" a tela de login em quem já está logado)
//   2. onAuthStateChange()   -> reage a login, logout e renovação de token
export default function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setCarregando(false)
    })

    const { data } = supabase.auth.onAuthStateChange((_evento, novaSessao) => {
      setSession(novaSessao)
    })

    // Cancela a inscrição ao desmontar, evitando vazamento de memória.
    return () => data.subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ session, carregando }}>
      {children}
    </AuthContext.Provider>
  )
}
