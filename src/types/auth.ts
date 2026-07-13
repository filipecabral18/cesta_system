import { z } from 'zod'

// Validação do formulário de login.
export const loginSchema = z.object({
  email: z.string().trim().email('E-mail inválido'),
  senha: z.string().min(1, 'Informe a senha'),
})

export type LoginForm = z.infer<typeof loginSchema>
