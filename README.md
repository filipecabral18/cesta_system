# Cesta 🧺

App web (PWA, mobile-first) para um casal organizar as compras mensais da casa.
O coração do sistema é a **despensa** — um catálogo de produtos com quantidades de
referência — a partir da qual as **listas de compras** são derivadas.

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

## Documentação

- `CLAUDE.md` — visão do projeto, modelo de dados e convenções.
- `PLANO.md` — roteiro de construção em etapas.
