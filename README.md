# Cesta 🧺

App web (PWA, mobile-first) para um casal organizar as compras mensais da casa.
O coração do sistema é a **despensa** — um catálogo de produtos com quantidades de
referência — a partir da qual as **listas de compras** são derivadas.

> 🔗 **Acesse:** https://cesta-system.vercel.app · 📱 instalável na tela inicial

## Funcionalidades

- **Despensa** — catálogo de produtos com quantidades de referência, agrupados por categoria.
- **Listas** — criadas do zero (modo *vazia*) ou pré-preenchidas pela despensa (modo *referência*).
- **Modo compra** — itens com checkbox e barra de progresso, com **sincronização em tempo real**
  entre os dois usuários (um marca no mercado, o outro vê na hora).
- **Autenticação** por e-mail/senha; dados compartilhados (conceito de "casa única").
- **PWA** instalável, com ícone próprio e tela cheia.

## Stack

React 18 + TypeScript + Vite · Tailwind CSS · vite-plugin-pwa · TanStack Query ·
Zod · Supabase (Postgres, Auth, Realtime) · Deploy na Vercel.

## Começando

```bash
npm install
cp .env.example .env   # preencha com as chaves do seu projeto Supabase
npm run dev
```

## Scripts

| Comando             | Descrição                        |
| ------------------- | -------------------------------- |
| `npm run dev`       | Servidor de desenvolvimento      |
| `npm run build`     | Build de produção                |
| `npm run preview`   | Pré-visualiza o build            |
| `npm run typecheck` | Checagem de tipos (TypeScript)   |
| `npm run lint`      | Lint (ESLint)                    |
| `npm run gerar-icones` | Regera os PNGs do PWA a partir de `public/favicon.svg` |

## Deploy (Vercel)

O projeto é um SPA estático servido pela Vercel (preset **Vite**). O
`vercel.json` faz o rewrite de todas as rotas para `index.html`, para que URLs
profundas (ex.: `/listas/:id`) funcionem ao recarregar.

Variáveis de ambiente a configurar no painel da Vercel:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Documentação

- `CLAUDE.md` — visão do projeto, modelo de dados e convenções.
- `PLANO.md` — roteiro de construção em etapas.
