import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'
import type { Lista, ModoCriacao } from '@/types'

const LISTAS_KEY = ['listas'] as const

// ── Leitura ──────────────────────────────────────────────────────────────────
async function listarListas(): Promise<Lista[]> {
  const { data, error } = await supabase
    .from('listas')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export function useListas() {
  return useQuery({
    queryKey: LISTAS_KEY,
    queryFn: listarListas,
  })
}

// ── Escrita: criar lista + seus itens ────────────────────────────────────────
export interface NovaListaInput {
  nome: string
  modo_criacao: ModoCriacao
  itens: Array<{ produto_id: string; quantidade: number }>
}

export function useCriarLista() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: NovaListaInput): Promise<string> => {
      // Passo 1: cria a lista e recupera o id gerado pelo banco.
      const { data: lista, error: erroLista } = await supabase
        .from('listas')
        .insert({ nome: input.nome, modo_criacao: input.modo_criacao })
        .select('id')
        .single()
      if (erroLista) throw erroLista

      // Passo 2: cria os itens já vinculados a essa lista (lista_id).
      // Obs.: são dois INSERTs separados; o supabase-js não abre transação no
      // cliente, então em teoria o passo 2 poderia falhar deixando uma lista
      // sem itens. Para o MVP é aceitável; a forma "atômica" seria uma função
      // no Postgres (RPC) — fica como possível melhoria futura.
      if (input.itens.length > 0) {
        const itens = input.itens.map((item) => ({
          lista_id: lista.id,
          produto_id: item.produto_id,
          quantidade: item.quantidade,
        }))
        const { error: erroItens } = await supabase
          .from('itens_lista')
          .insert(itens)
        if (erroItens) throw erroItens
      }

      return lista.id
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: LISTAS_KEY }),
  })
}
