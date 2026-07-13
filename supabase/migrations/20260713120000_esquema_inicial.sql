-- ============================================================================
-- Migration: esquema inicial do Cesta
-- Cria os tipos (enums), tabelas, índices, RLS e habilita o realtime.
-- Como aplicar: cole este arquivo inteiro no SQL Editor do Supabase e rode.
-- ============================================================================

-- ─────────────────────────────────────────────────────────────────────────
-- 1. Tipos enumerados (ENUM)
--    No Postgres, um ENUM é um tipo cujos valores válidos são fixos. Usar
--    ENUM (em vez de texto livre) faz o BANCO garantir que a coluna só
--    aceite um desses valores — um erro de digitação é barrado na origem.
-- ─────────────────────────────────────────────────────────────────────────
create type categoria_produto as enum (
  'hortifruti', 'mercearia', 'limpeza', 'higiene', 'bebidas', 'outros'
);

create type unidade_produto as enum (
  'un', 'kg', 'g', 'l', 'ml', 'pacote'
);

create type status_lista as enum ('aberta', 'concluida');

create type modo_criacao_lista as enum ('vazia', 'referencia');

-- ─────────────────────────────────────────────────────────────────────────
-- 2. Tabelas
--    id é uuid gerado pelo próprio banco (gen_random_uuid).
--    timestamptz = data/hora com fuso; now() preenche na inserção.
-- ─────────────────────────────────────────────────────────────────────────

-- Catálogo de produtos — a "despensa padrão", coração do app.
create table produtos (
  id                    uuid primary key default gen_random_uuid(),
  nome                  text not null,
  categoria             categoria_produto not null,
  unidade               unidade_produto not null,
  quantidade_referencia numeric not null default 0 check (quantidade_referencia >= 0),
  created_at            timestamptz not null default now()
);

-- Listas de compras.
create table listas (
  id           uuid primary key default gen_random_uuid(),
  nome         text not null,
  status       status_lista not null default 'aberta',
  modo_criacao modo_criacao_lista not null,
  created_at   timestamptz not null default now()
);

-- Itens de cada lista: ligam uma lista a um produto, com quantidade e o
-- estado "comprado". As FKs (references) garantem integridade:
--   • on delete cascade  -> apagar a lista apaga seus itens juntos.
--   • on delete restrict -> impede apagar um produto que ainda está em listas
--     (evita itens "órfãos"; é a escolha mais segura para o MVP).
create table itens_lista (
  id         uuid primary key default gen_random_uuid(),
  lista_id   uuid not null references listas (id)   on delete cascade,
  produto_id uuid not null references produtos (id) on delete restrict,
  quantidade numeric not null default 0 check (quantidade >= 0),
  comprado   boolean not null default false
);

-- Índice na FK: acelera "buscar todos os itens de uma lista", a consulta
-- mais frequente do modo compra.
create index itens_lista_lista_id_idx on itens_lista (lista_id);

-- ─────────────────────────────────────────────────────────────────────────
-- 3. Row Level Security (RLS)
--    Este é o mecanismo de segurança que torna a publishable key segura.
--    Com RLS habilitado, NENHUMA linha é visível por padrão — nem para
--    quem tem a chave pública. As "policies" abaixo abrem acesso total,
--    porém apenas para usuários AUTENTICADOS (papel `authenticated`).
--    Visitante anônimo não lê nem escreve nada. Isso implementa o conceito
--    de "casa única" do MVP: os dois usuários logados compartilham tudo.
--       using      -> filtra quais linhas podem ser LIDAS/alteradas/apagadas
--       with check -> valida as linhas em INSERT/UPDATE
-- ─────────────────────────────────────────────────────────────────────────
alter table produtos    enable row level security;
alter table listas      enable row level security;
alter table itens_lista enable row level security;

create policy "casa: acesso total a produtos"
  on produtos for all to authenticated
  using (true) with check (true);

create policy "casa: acesso total a listas"
  on listas for all to authenticated
  using (true) with check (true);

create policy "casa: acesso total a itens_lista"
  on itens_lista for all to authenticated
  using (true) with check (true);

-- ─────────────────────────────────────────────────────────────────────────
-- 4. Realtime
--    Publica itens_lista no canal de realtime do Supabase, para que marcar
--    um item como comprado apareça na hora no celular do outro usuário.
--    REPLICA IDENTITY FULL faz o evento de UPDATE/DELETE carregar a linha
--    inteira (e não só o id), o que facilita atualizar a tela do cliente.
-- ─────────────────────────────────────────────────────────────────────────
alter table itens_lista replica identity full;
alter publication supabase_realtime add table itens_lista;
