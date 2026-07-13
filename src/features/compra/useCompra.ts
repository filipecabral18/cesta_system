import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { QueryData } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabaseClient'
import type { Lista } from '@/types'

const LISTA_KEY = (listaId: string) => ['lista', listaId] as const
const ITENS_KEY = (listaId: string) => ['itens_lista', listaId] as const

// ── A lista em si (para nome e status no cabeçalho) ──────────────────────────
async function buscarLista(listaId: string): Promise<Lista> {
  const { data, error } = await supabase
    .from('listas')
    .select('*')
    .eq('id', listaId)
    .single()
  if (error) throw error
  return data
}

export function useLista(listaId: string) {
  return useQuery({
    queryKey: LISTA_KEY(listaId),
    queryFn: () => buscarLista(listaId),
  })
}

// ── Itens da lista, já com os dados do produto (JOIN) ─────────────────────────
// `produto:produtos(*)` traz, em cada item, o produto relacionado num campo
// chamado `produto`. O tipo QueryData deriva o formato exato do retorno — sem
// precisar escrever o tipo do join à mão.
function itensQuery(listaId: string) {
  return supabase
    .from('itens_lista')
    .select('*, produto:produtos(*)')
    .eq('lista_id', listaId)
}

export type ItemComProduto = QueryData<ReturnType<typeof itensQuery>>[number]

async function listarItens(listaId: string): Promise<ItemComProduto[]> {
  const { data, error } = await itensQuery(listaId)
  if (error) throw error
  return data
}

export function useItensLista(listaId: string) {
  return useQuery({
    queryKey: ITENS_KEY(listaId),
    queryFn: () => listarItens(listaId),
  })
}

// ── Realtime: ouve mudanças em itens_lista desta lista ───────────────────────
// Quando o outro usuário marca/desmarca um item, o Supabase avisa e nós
// invalidamos a query — a lista se atualiza sozinha na tela.
export function useRealtimeItens(listaId: string) {
  const queryClient = useQueryClient()

  useEffect(() => {
    const canal = supabase
      .channel(`itens_lista:${listaId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'itens_lista',
          filter: `lista_id=eq.${listaId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ITENS_KEY(listaId) })
        },
      )
      .subscribe()

    // Encerra o canal ao sair da tela.
    return () => {
      supabase.removeChannel(canal)
    }
  }, [listaId, queryClient])
}

// ── Marcar/desmarcar comprado (com atualização otimista) ─────────────────────
export function useMarcarComprado(listaId: string) {
  const queryClient = useQueryClient()
  const queryKey = ITENS_KEY(listaId)

  return useMutation({
    mutationFn: async (params: { id: string; comprado: boolean }) => {
      const { error } = await supabase
        .from('itens_lista')
        .update({ comprado: params.comprado })
        .eq('id', params.id)
      if (error) throw error
    },
    // Otimista: atualiza o cache ANTES da resposta do servidor, para o
    // checkbox reagir instantaneamente.
    onMutate: async ({ id, comprado }) => {
      await queryClient.cancelQueries({ queryKey })
      const anterior = queryClient.getQueryData<ItemComProduto[]>(queryKey)
      queryClient.setQueryData<ItemComProduto[]>(queryKey, (atual) =>
        atual?.map((item) => (item.id === id ? { ...item, comprado } : item)),
      )
      return { anterior }
    },
    // Se der erro, desfaz a mudança otimista.
    onError: (_erro, _params, contexto) => {
      if (contexto?.anterior) {
        queryClient.setQueryData(queryKey, contexto.anterior)
      }
    },
    // Ao final, revalida para ficar em sincronia com o banco.
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  })
}

// ── Concluir a lista ─────────────────────────────────────────────────────────
export function useConcluirLista(listaId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('listas')
        .update({ status: 'concluida' })
        .eq('id', listaId)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LISTA_KEY(listaId) })
      queryClient.invalidateQueries({ queryKey: ['listas'] })
    },
  })
}
