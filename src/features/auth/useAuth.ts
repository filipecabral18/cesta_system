import { useContext } from 'react'
import { AuthContext } from './authContext'

// Hook de acesso à sessão. Lança erro se usado fora do <AuthProvider>.
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de <AuthProvider>')
  }
  return ctx
}
