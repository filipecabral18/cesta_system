import type { Categoria, Unidade, StatusLista, ModoCriacao } from './enums'

// Tipagem do banco para o supabase-js. Passamos `Database` para o
// createClient (ver lib/supabaseClient.ts) e, com isso, toda consulta fica
// tipada — `supabase.from('produtos').select()` devolve `Produto[]`, sem `any`.
//
// Para cada tabela há três formatos:
//   Row    -> como a linha volta do banco (todas as colunas presentes)
//   Insert -> o que é preciso enviar ao inserir (campos com default são
//             opcionais, marcados com `?`)
//   Update -> tudo opcional, pois se atualiza só o que muda
//
// Obs.: mais adiante isto pode ser gerado automaticamente com
// `supabase gen types typescript`. Por enquanto mantemos à mão para aprender.

export interface Database {
  public: {
    Tables: {
      produtos: {
        Row: {
          id: string
          nome: string
          categoria: Categoria
          unidade: Unidade
          created_at: string
        }
        Insert: {
          id?: string
          nome: string
          categoria: Categoria
          unidade: Unidade
          created_at?: string
        }
        Update: {
          id?: string
          nome?: string
          categoria?: Categoria
          unidade?: Unidade
          created_at?: string
        }
        Relationships: []
      }
      despensa: {
        Row: {
          produto_id: string
          quantidade_referencia: number
          updated_at: string
        }
        Insert: {
          produto_id: string
          quantidade_referencia?: number
          updated_at?: string
        }
        Update: {
          produto_id?: string
          quantidade_referencia?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'despensa_produto_id_fkey'
            columns: ['produto_id']
            referencedRelation: 'produtos'
            referencedColumns: ['id']
          },
        ]
      }
      listas: {
        Row: {
          id: string
          nome: string
          status: StatusLista
          modo_criacao: ModoCriacao
          created_at: string
        }
        Insert: {
          id?: string
          nome: string
          status?: StatusLista
          modo_criacao: ModoCriacao
          created_at?: string
        }
        Update: {
          id?: string
          nome?: string
          status?: StatusLista
          modo_criacao?: ModoCriacao
          created_at?: string
        }
        Relationships: []
      }
      itens_lista: {
        Row: {
          id: string
          lista_id: string
          produto_id: string
          quantidade: number
          comprado: boolean
        }
        Insert: {
          id?: string
          lista_id: string
          produto_id: string
          quantidade?: number
          comprado?: boolean
        }
        Update: {
          id?: string
          lista_id?: string
          produto_id?: string
          quantidade?: number
          comprado?: boolean
        }
        Relationships: [
          {
            foreignKeyName: 'itens_lista_lista_id_fkey'
            columns: ['lista_id']
            referencedRelation: 'listas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'itens_lista_produto_id_fkey'
            columns: ['produto_id']
            referencedRelation: 'produtos'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      categoria_produto: Categoria
      unidade_produto: Unidade
      status_lista: StatusLista
      modo_criacao_lista: ModoCriacao
    }
    CompositeTypes: Record<string, never>
  }
}

// Atalhos usados pelo resto do app.
export type Produto = Database['public']['Tables']['produtos']['Row']
export type ProdutoInsert = Database['public']['Tables']['produtos']['Insert']
export type ProdutoUpdate = Database['public']['Tables']['produtos']['Update']
export type Despensa = Database['public']['Tables']['despensa']['Row']
export type DespensaInsert = Database['public']['Tables']['despensa']['Insert']
// Produto do catálogo já com a quantidade de referência da despensa embutida —
// o formato que a tela da Despensa e a montagem de listas consomem.
export type ProdutoComReferencia = Produto & { quantidade_referencia: number }
export type Lista = Database['public']['Tables']['listas']['Row']
export type ListaInsert = Database['public']['Tables']['listas']['Insert']
export type ItemLista = Database['public']['Tables']['itens_lista']['Row']
export type ItemListaInsert = Database['public']['Tables']['itens_lista']['Insert']
