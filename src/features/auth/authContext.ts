import { createContext } from 'react'
import type { Session } from '@supabase/supabase-js'

// O que o contexto de autenticação disponibiliza para o app inteiro.
export interface AuthContextValue {
  session: Session | null
  carregando: boolean
}

// `undefined` como padrão nos permite detectar (no useAuth) o uso fora do
// provedor e avisar com um erro claro.
export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
