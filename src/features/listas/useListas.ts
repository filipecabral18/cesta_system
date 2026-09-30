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

// ── Escrita: editar lista aberta (nome + itens) ──────────────────────────────
export interface EditarListaInput {
  nome: string
  itens: Array<{ produto_id: string; quantidade: number }>
}

export function useEditarLista(listaId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: EditarListaInput): Promise<void> => {
      // O outro usuário pode ter concluído a lista durante a edição.
      const { data: lista, error: erroLista } = await supabase
        .from('listas')
        .select('status')
        .eq('id', listaId)
        .single()
      if (erroLista) throw erroLista
      if (lista.status !== 'aberta') {
        throw new Error('Esta lista já foi concluída e não pode ser editada.')
      }

      const { error: erroNome } = await supabase
        .from('listas')
        .update({ nome: input.nome })
        .eq('id', listaId)
      if (erroNome) throw erroNome

      // Aplica só a diferença, para os itens mantidos preservarem o "comprado".
      const { data: atuais, error: erroAtuais } = await supabase
        .from('itens_lista')
        .select('id, produto_id, quantidade')
        .eq('lista_id', listaId)
      if (erroAtuais) throw erroAtuais

      const desejados = new Map(
        input.itens.map((i) => [i.produto_id, i.quantidade]),
      )
      const produtosAtuais = new Set(atuais.map((i) => i.produto_id))

      const idsRemover = atuais
        .filter((item) => !desejados.has(item.produto_id))
        .map((item) => item.id)
      const alterar = atuais.flatMap((item) => {
        const quantidade = desejados.get(item.produto_id)
        return quantidade !== undefined && quantidade !== item.quantidade
          ? [{ id: item.id, quantidade }]
          : []
      })
      const inserir = input.itens.filter(
        (i) => !produtosAtuais.has(i.produto_id),
      )

      if (idsRemover.length > 0) {
        const { error } = await supabase
          .from('itens_lista')
          .delete()
          .in('id', idsRemover)
        if (error) throw error
      }

      const resultados = await Promise.all(
        alterar.map(({ id, quantidade }) =>
          supabase.from('itens_lista').update({ quantidade }).eq('id', id),
        ),
      )
      const erroAlterar = resultados.find((r) => r.error)?.error
      if (erroAlterar) throw erroAlterar

      if (inserir.length > 0) {
        const { error } = await supabase
          .from('itens_lista')
          .insert(inserir.map((i) => ({ ...i, lista_id: listaId })))
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LISTAS_KEY })
      queryClient.invalidateQueries({ queryKey: ['lista', listaId] })
      queryClient.invalidateQueries({ queryKey: ['itens_lista', listaId] })
    },
  })
}
