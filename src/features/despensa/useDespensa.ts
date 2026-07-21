import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'
import type { ProdutoComReferencia } from '@/types'

// Cache da "visão da despensa": cada item do catálogo já com a sua quantidade
// de referência. Distinta de ['produtos'] (só o catálogo), pois esta junta as
// duas tabelas — mas as duas se invalidam juntas quando um item muda.
const DESPENSA_KEY = ['despensa'] as const

// ── Leitura ──────────────────────────────────────────────────────────────────
// Busca o catálogo e as quantidades de referência (duas tabelas) e junta em
// memória. Itens sem linha na despensa entram com quantidade 0. Fazemos dois
// selects simples em vez de um JOIN embutido — fica mais fácil de ler e tipar.
async function listarDespensa(): Promise<ProdutoComReferencia[]> {
  const [produtosRes, despensaRes] = await Promise.all([
    supabase.from('produtos').select('*').order('nome'),
    supabase.from('despensa').select('produto_id, quantidade_referencia'),
  ])

  if (produtosRes.error) throw produtosRes.error
  if (despensaRes.error) throw despensaRes.error

  const referencias = new Map(
    despensaRes.data.map((d) => [d.produto_id, d.quantidade_referencia]),
  )

  return produtosRes.data.map((produto) => ({
    ...produto,
    quantidade_referencia: referencias.get(produto.id) ?? 0,
  }))
}

export function useDespensa() {
  return useQuery({
    queryKey: DESPENSA_KEY,
    queryFn: listarDespensa,
  })
}

// ── Escrita: definir a quantidade de referência de um item ───────────────────
// upsert: cria a linha na despensa se ainda não existir, ou atualiza se já
// existir (conflito na PK produto_id). updated_at é renovado a cada gravação.
export function useDefinirReferencia() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: {
      produto_id: string
      quantidade_referencia: number
    }) => {
      const { error } = await supabase.from('despensa').upsert(
        {
          produto_id: params.produto_id,
          quantidade_referencia: params.quantidade_referencia,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'produto_id' },
      )
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: DESPENSA_KEY }),
  })
}
