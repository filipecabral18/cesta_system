import { z } from 'zod'
import { CATEGORIAS, UNIDADES } from './enums'

// Schema de validação do formulário de cadastro/edição de produto.
// O Zod valida os dados ANTES de enviar ao Supabase e, de quebra, gera o
// tipo TypeScript do formulário (ProdutoForm) — uma fonte, dois usos.
export const produtoFormSchema = z.object({
  nome: z.string().trim().min(1, 'Informe o nome do produto'),
  categoria: z.enum(CATEGORIAS),
  unidade: z.enum(UNIDADES),
  // coerce converte a string vinda do <input> em número antes de validar.
  quantidade_referencia: z.coerce
    .number({ invalid_type_error: 'Informe um número' })
    .nonnegative('A quantidade não pode ser negativa'),
})

export type ProdutoForm = z.infer<typeof produtoFormSchema>
