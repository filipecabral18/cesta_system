import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'
import type { Produto, ProdutoForm } from '@/types'

// Chave de cache do TanStack Query para o catálogo de itens. É a mesma chave
// usada pela Despensa (que lê os mesmos produtos), então criar/editar/excluir
// aqui também mantém aquela tela em dia — ver `invalidarProdutos`.
const PRODUTOS_KEY = ['produtos'] as const
const DESPENSA_KEY = ['despensa'] as const

// ── Leitura: catálogo de itens (só a definição: nome, categoria, unidade) ────
async function listarProdutos(): Promise<Produto[]> {
  const { data, error } = await supabase
    .from('produtos')
    .select('*')
    .order('nome')

  if (error) throw error
  return data
}

export function useProdutos() {
  return useQuery({
    queryKey: PRODUTOS_KEY,
    queryFn: listarProdutos,
  })
}

// Invalida tudo que depende dos produtos: a própria lista do catálogo e a
// visão da despensa (que junta produto + quantidade de referência).
function useInvalidarProdutos() {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: PRODUTOS_KEY })
    queryClient.invalidateQueries({ queryKey: DESPENSA_KEY })
  }
}

// ── Escrita: criar item ──────────────────────────────────────────────────────
export function useCriarProduto() {
  const invalidar = useInvalidarProdutos()

  return useMutation({
    mutationFn: async (dados: ProdutoForm) => {
      const { error } = await supabase.from('produtos').insert(dados)
      if (error) throw error
    },
    onSuccess: invalidar,
  })
}

// ── Escrita: editar item ─────────────────────────────────────────────────────
export function useAtualizarProduto() {
  const invalidar = useInvalidarProdutos()

  return useMutation({
    mutationFn: async (params: { id: string; dados: ProdutoForm }) => {
      const { error } = await supabase
        .from('produtos')
        .update(params.dados)
        .eq('id', params.id)
      if (error) throw error
    },
    onSuccess: invalidar,
  })
}

// ── Escrita: excluir item ────────────────────────────────────────────────────
// A FK de itens_lista usa `on delete restrict`: se o item estiver em alguma
// lista, o banco recusa a exclusão. Traduzimos esse erro numa mensagem clara.
export function useExcluirProduto() {
  const invalidar = useInvalidarProdutos()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('produtos').delete().eq('id', id)
      if (error) {
        // 23503 = foreign_key_violation (item ainda referenciado por uma lista).
        if (error.code === '23503') {
          throw new Error(
            'Este item está em uma ou mais listas e não pode ser excluído.',
          )
        }
        throw error
      }
    },
    onSuccess: invalidar,
  })
}
