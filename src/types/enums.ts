// Valores dos enums do banco, definidos UMA vez aqui e reaproveitados pelos
// tipos TypeScript, pelos schemas Zod e pela UI. Mantêm o front alinhado com
// os ENUMs criados na migration SQL.
//
// `as const` congela o array: o TypeScript passa a conhecer os valores
// exatos ('hortifruti' | 'mercearia' | ...) em vez de um `string[]` genérico.

export const CATEGORIAS = [
  'hortifruti',
  'mercearia',
  'limpeza',
  'higiene',
  'bebidas',
  'outros',
] as const
export type Categoria = (typeof CATEGORIAS)[number]

export const UNIDADES = ['un', 'kg', 'g', 'l', 'ml', 'pacote'] as const
export type Unidade = (typeof UNIDADES)[number]

export const STATUS_LISTA = ['aberta', 'concluida'] as const
export type StatusLista = (typeof STATUS_LISTA)[number]

export const MODOS_CRIACAO = ['vazia', 'referencia'] as const
export type ModoCriacao = (typeof MODOS_CRIACAO)[number]

// Rótulos amigáveis para exibir na interface (a chave é o valor do enum).
export const CATEGORIA_LABELS: Record<Categoria, string> = {
  hortifruti: 'Hortifrúti',
  mercearia: 'Mercearia',
  limpeza: 'Limpeza',
  higiene: 'Higiene',
  bebidas: 'Bebidas',
  outros: 'Outros',
}

export const UNIDADE_LABELS: Record<Unidade, string> = {
  un: 'un',
  kg: 'kg',
  g: 'g',
  l: 'L',
  ml: 'mL',
  pacote: 'pacote',
}
