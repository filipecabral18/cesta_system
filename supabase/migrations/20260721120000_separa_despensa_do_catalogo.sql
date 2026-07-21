-- ============================================================================
-- Migration: separa o catálogo (produtos) da despensa (quantidade de referência)
--
-- Antes: a tabela `produtos` guardava, na mesma linha, a definição do item
-- (nome, categoria, unidade) E a quantidade de referência.
-- Depois: `produtos` é só o catálogo (definição do item); a quantidade de
-- referência mora numa tabela própria `despensa`, uma linha por produto.
--
-- Como aplicar: cole este arquivo inteiro no SQL Editor do Supabase e rode.
-- IMPORTANTE: rode ANTES de publicar o novo frontend, que já espera a tabela
-- `despensa` e não usa mais a coluna produtos.quantidade_referencia.
-- ============================================================================

-- ─────────────────────────────────────────────────────────────────────────
-- 1. Tabela despensa: a "despensa padrão".
--    produto_id é, ao mesmo tempo, chave primária E chave estrangeira:
--    garante no máximo UMA linha de referência por produto (relação 1‑para‑1).
--    on delete cascade -> apagar um produto apaga sua linha de despensa junto.
-- ─────────────────────────────────────────────────────────────────────────
create table despensa (
  produto_id            uuid primary key references produtos (id) on delete cascade,
  quantidade_referencia numeric not null default 0 check (quantidade_referencia >= 0),
  updated_at            timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────
-- 2. Migra os dados existentes: cada produto vira uma linha na despensa,
--    levando a quantidade de referência que estava na própria tabela produtos.
-- ─────────────────────────────────────────────────────────────────────────
insert into despensa (produto_id, quantidade_referencia)
select id, quantidade_referencia
from produtos;

-- ─────────────────────────────────────────────────────────────────────────
-- 3. Remove a coluna de produtos — agora é catálogo puro (nome, categoria,
--    unidade). Os dados já foram copiados no passo 2, então nada se perde.
-- ─────────────────────────────────────────────────────────────────────────
alter table produtos drop column quantidade_referencia;

-- ─────────────────────────────────────────────────────────────────────────
-- 4. Row Level Security na nova tabela, no mesmo padrão "casa única":
--    acesso total, porém só para usuários autenticados.
-- ─────────────────────────────────────────────────────────────────────────
alter table despensa enable row level security;

create policy "casa: acesso total a despensa"
  on despensa for all to authenticated
  using (true) with check (true);
