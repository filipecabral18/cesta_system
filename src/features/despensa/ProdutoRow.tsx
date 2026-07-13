import { useState } from 'react'
import { UNIDADE_LABELS, type Produto } from '@/types'
import { useAtualizarQuantidadeReferencia } from './useProdutos'

// Uma linha da despensa. A quantidade de referência é editável no próprio
// campo: o valor é confirmado ao sair do campo (blur) ou ao apertar Enter.
export default function ProdutoRow({ produto }: { produto: Produto }) {
  const atualizar = useAtualizarQuantidadeReferencia()
  const [valor, setValor] = useState(String(produto.quantidade_referencia))

  function confirmar() {
    const numero = Number(valor)
    // Valor inválido ou negativo: reverte para o valor atual do produto.
    if (!Number.isFinite(numero) || numero < 0) {
      setValor(String(produto.quantidade_referencia))
      return
    }
    // Só salva se realmente mudou (evita chamadas desnecessárias).
    if (numero !== produto.quantidade_referencia) {
      atualizar.mutate({ id: produto.id, quantidade_referencia: numero })
    }
  }

  return (
    <li className="flex items-center justify-between gap-3 px-4 py-3">
      <span className="min-w-0 truncate">{produto.nome}</span>
      <div className="flex shrink-0 items-center gap-1.5">
        <input
          type="number"
          inputMode="decimal"
          min={0}
          step="any"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          onBlur={confirmar}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.currentTarget.blur()
          }}
          disabled={atualizar.isPending}
          className="w-16 rounded-md border border-gray-300 px-2 py-1 text-right focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 disabled:opacity-60"
        />
        <span className="w-10 text-sm text-gray-500">
          {UNIDADE_LABELS[produto.unidade]}
        </span>
      </div>
    </li>
  )
}
