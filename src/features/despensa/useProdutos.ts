import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'
import type { Produto, ProdutoForm } from '@/types'

// Chave de cache do TanStack Query. Toda leitura/escrita de produtos usa a
// mesma chave; invalidá-la faz a lista se atualizar sozinha na tela.
const PRODUTOS_KEY = ['produtos'] as const

// ── Leitura ────────────────────────────────────────────────────────────────
async function listarProdutos(): Promise<Produto[]> {
  const { data, error } = await supabase
    .from('produtos')
    .select('*')
    .order('nome')

  if (error) throw error
  return data
}

// Hook que os componentes usam para obter a lista. Cuida de cache, estados de
// carregamento/erro e refetch automático — sem nada disso no componente.
export function useProdutos() {
  return useQuery({
    queryKey: PRODUTOS_KEY,
    queryFn: listarProdutos,
  })
}

// ── Escrita: criar produto ───────────────────────────────────────────────────
export function useCriarProduto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (dados: ProdutoForm) => {
      const { error } = await supabase.from('produtos').insert(dados)
      if (error) throw error
    },
    // Ao concluir, invalida a lista para o TanStack Query buscar de novo e a
    // tela refletir o novo produto.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUTOS_KEY }),
  })
}

// ── Escrita: editar a quantidade de referência direto na listagem ────────────
export function useAtualizarQuantidadeReferencia() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: { id: string; quantidade_referencia: number }) => {
      const { error } = await supabase
        .from('produtos')
        .update({ quantidade_referencia: params.quantidade_referencia })
        .eq('id', params.id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUTOS_KEY }),
  })
}
