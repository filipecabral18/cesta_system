# PLANO.md — Roteiro de construção do Cesta

Este arquivo é o plano de execução do projeto. Use uma etapa por vez no Claude Code:
cole o prompt sugerido, revise o resultado, teste no navegador e só então avance.
Marque as etapas concluídas com [x].

---

## Etapa 0 — Pré-requisitos (manual, fora do Claude Code)

- [x] Criar conta gratuita no Supabase (supabase.com) e criar um projeto chamado `cesta`.
- [x] Anotar a `Project URL` e a `anon public key` (Settings → API).
- [x] Ter Node.js LTS instalado.
- [x] Instalar o Claude Code e abrir a pasta do projeto nele.

## Etapa 1 — Fundação do projeto

- [x] Prompt sugerido:

> Configure o projeto do zero conforme o CLAUDE.md: Vite + React + TypeScript + Tailwind
> + vite-plugin-pwa + TanStack Query + Zod + cliente do Supabase. Crie a estrutura de
> pastas descrita, um `.env.example` com as variáveis do Supabase, o script `typecheck`,
> e uma tela inicial placeholder com a navegação inferior (Despensa / Listas). Rode o
> build para confirmar que tudo compila.

- [x] Depois: criar o arquivo `.env` local com suas chaves reais (não commitar).

## Etapa 2 — Banco de dados

- [x] Prompt sugerido:

> Crie a migration SQL em `supabase/migrations/` com as tabelas `produtos`, `listas` e
> `itens_lista` conforme o modelo de dados do CLAUDE.md, incluindo RLS e a publicação
> de realtime em `itens_lista`. Gere também os tipos TypeScript e schemas Zod
> correspondentes em `src/types/`. Me explique como aplicar a migration no painel do
> Supabase.

- [x] Depois: aplicar a migration no SQL Editor do Supabase e habilitar Auth por e-mail.

## Etapa 3 — Autenticação

- [x] Prompt sugerido:

> Implemente o fluxo de login com Supabase Auth (e-mail/senha): tela de login, proteção
> das rotas do app e botão de sair. Sem cadastro público — os dois usuários serão
> criados manualmente no painel do Supabase.

- [ ] Depois: criar os 2 usuários (você e sua esposa) em Authentication → Users.
      _(1 de 2 criados; falta o 2º usuário.)_

## Etapa 4 — Despensa (catálogo de produtos)

- [x] Prompt sugerido:

> Implemente a feature de despensa: listar produtos agrupados por categoria, cadastrar
> novo produto (nome, categoria, unidade, quantidade de referência) e editar a quantidade
> de referência direto na listagem. Use os hooks com TanStack Query conforme as
> convenções. Use o protótipo em `docs/prototipo/` como referência visual do fluxo.

## Etapa 5 — Listas de compras

- [x] Prompt sugerido:

> Implemente a criação de listas nos dois modos do CLAUDE.md (vazia e a partir da
> referência) e a tela de listagem de listas com status. Na criação, o usuário ajusta
> produtos e quantidades antes de salvar.

## Etapa 6 — Modo compra + realtime

- [x] Prompt sugerido:

> Implemente o detalhe da lista em "modo compra": itens agrupados por categoria com
> checkbox de comprado, barra de progresso, e sincronização em tempo real via Supabase
> Realtime para que dois usuários vejam as marcações um do outro instantaneamente.
> Adicione a ação de concluir a lista.

- [ ] Teste real: abrir em dois celulares e marcar itens simultaneamente.
      _(Realtime validado entre duas abas; teste com 2 usuários pendente do 2º usuário.)_

## Etapa 7 — PWA e polimento

- [x] Prompt sugerido:

> Finalize o PWA: manifest com nome, ícones e cores do app, tela cheia standalone,
> e cache offline básico dos assets. Revise a responsividade das telas em 380px.

## Etapa 8 — Deploy

- [x] Prompt sugerido:

> Me guie no deploy deste projeto na Vercel, incluindo a configuração das variáveis de
> ambiente do Supabase. Prepare o repositório: README curto explicando o projeto, e
> confirme que `.env` está no .gitignore.

- [ ] Instalar o PWA na tela inicial dos dois celulares e usar na próxima compra do mês!
      _(Instalado no iPhone; falta o segundo celular.)_

---

## v2 (backlog — não iniciar sem decidir juntos)

- Copiar lista a partir de lista existente.
- Modo diferença: informar o que tem em casa e gerar a lista só com o que falta.
- Histórico de listas e variação de consumo.
