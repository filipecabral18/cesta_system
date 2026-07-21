import { z } from 'zod'
import { CATEGORIAS, UNIDADES } from './enums'

// Schema de validação do formulário de cadastro/edição de item.
// Depois que a despensa virou tabela própria, o item guarda só a sua
// definição — categoria, nome e unidade. A quantidade de referência é
// editada à parte, na tela da Despensa.
// O Zod valida os dados ANTES de enviar ao Supabase e, de quebra, gera o
// tipo TypeScript do formulário (ProdutoForm) — uma fonte, dois usos.
export const produtoFormSchema = z.object({
  nome: z.string().trim().min(1, 'Informe o nome do item'),
  categoria: z.enum(CATEGORIAS),
  unidade: z.enum(UNIDADES),
})

export type ProdutoForm = z.infer<typeof produtoFormSchema>
