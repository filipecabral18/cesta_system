import type { ProdutoComReferencia } from '@/types'

// Estado de cada produto na tela de montagem: se entra na lista e com que
// quantidade (string, porque vem de um <input>).
export interface LinhaEstado {
  incluido: boolean
  quantidade: string
}

export function itensSelecionados(
  produtos: ProdutoComReferencia[],
  linhas: Record<string, LinhaEstado>,
): Array<{ produto_id: string; quantidade: number }> {
  return produtos
    .filter((p) => linhas[p.id]?.incluido)
    .map((p) => ({
      produto_id: p.id,
      quantidade: Number(linhas[p.id].quantidade),
    }))
    .filter((i) => Number.isFinite(i.quantidade) && i.quantidade > 0)
}
