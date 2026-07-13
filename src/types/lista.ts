import { z } from 'zod'
import { MODOS_CRIACAO } from './enums'

// Schema do formulário de criação de lista. A quantidade/seleção de itens é
// tratada à parte, na tela de montagem da lista (Etapa 5).
export const listaFormSchema = z.object({
  nome: z.string().trim().min(1, 'Dê um nome para a lista'),
  modo_criacao: z.enum(MODOS_CRIACAO),
})

export type ListaForm = z.infer<typeof listaFormSchema>
