# Cesta — Despensa e Listas de Compras

## Visão do projeto

App web responsivo (PWA, mobile-first) para um casal organizar as compras mensais da casa.
O coração do sistema é o **catálogo de produtos com quantidades de referência** (a "despensa
padrão"). As listas de compras são derivadas dele.

Usuários: 2 (o casal), com sincronização em tempo real — um marca um item no mercado,
o outro vê na hora.

## Funcionalidades (MVP)

1. **Itens (cadastro)**: cadastrar/editar/excluir itens com nome, categoria e unidade.
2. **Despensa**: definir a quantidade de referência de cada item cadastrado.
3. **Criar lista — modo vazio**: usuário seleciona produtos e quantidades manualmente.
4. **Criar lista — modo referência**: lista nasce pré-preenchida com as quantidades de
   referência da despensa; usuário ajusta antes de salvar.
5. **Modo compra**: dentro de uma lista, marcar itens como comprados (checkbox), com
   sincronização em tempo real entre os dois usuários.
6. **Autenticação**: login por e-mail/senha via Supabase Auth. Os dados são compartilhados
   entre os dois usuários (conceito de "casa" única no MVP).

### Fora do MVP (v2 — não implementar sem pedido explícito)

- Copiar lista a partir de outra lista existente.
- Modo diferença (informar o que tem em casa, gerar lista só com o que falta).
- Histórico e estatísticas de consumo.

## Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Estilo**: Tailwind CSS (mobile-first)
- **PWA**: vite-plugin-pwa (instalável, offline básico)
- **Backend/dados**: Supabase (Postgres, Auth, Realtime)
- **Dados no cliente**: TanStack Query
- **Validação**: Zod
- **Deploy**: Vercel

## Modelo de dados (Postgres / Supabase)

- `produtos`: id, nome, categoria (enum: hortifruti, mercearia, limpeza, higiene, bebidas,
  outros), unidade (un, kg, g, l, ml, pacote), created_at. É o **catálogo puro** (a
  definição do item); cadastrado/editado/excluído na aba **Itens**.
- `despensa`: produto_id (PK e FK → produtos, on delete cascade), quantidade_referencia
  (numeric), updated_at. Guarda a **quantidade de referência** de cada item (1 linha por
  produto); editada na aba **Despensa**. É o que alimenta o "modo referência" das listas.
- `listas`: id, nome, status (aberta | concluida), modo_criacao (vazia | referencia),
  created_at
- `itens_lista`: id, lista_id (FK), produto_id (FK), quantidade (numeric),
  comprado (boolean, default false)

Regras: RLS habilitado em todas as tabelas; no MVP, qualquer usuário autenticado da casa
lê e escreve tudo. Realtime habilitado em `itens_lista`.

## Estrutura de pastas

```
src/
├── components/     # UI reutilizável (Button, Card, Input, BottomNav...)
├── features/
│   ├── cadastro/    # catálogo de itens (criar/editar/excluir)
│   ├── despensa/    # quantidade de referência de cada item
│   ├── listas/
│   └── compra/
├── lib/            # supabaseClient.ts, helpers
├── hooks/
└── types/          # tipos TypeScript + schemas Zod
supabase/
└── migrations/
```

## Convenções

- TypeScript estrito (`strict: true`); nunca usar `any`.
- Nomes de arquivos de componentes em PascalCase; hooks começam com `use`.
- Todo acesso a dados passa por hooks com TanStack Query (`useProdutos`, `useLista`...);
  componentes não chamam o Supabase diretamente.
- Validar dados de formulários com Zod antes de enviar.
- UI mobile-first: projetar para ~380px de largura primeiro; desktop é adaptação.
- Textos da interface em português (pt-BR).
- Commits pequenos e em português, um por mudança lógica.
- Fazer mudanças mínimas; não refatorar código não relacionado ao pedido.
- Após qualquer mudança de código, rodar `npm run typecheck` e corrigir erros.
- Em caso de dúvida entre duas abordagens, explicar ambas e perguntar antes de decidir.

## Comandos

- Instalar: `npm install`
- Desenvolvimento: `npm run dev`
- Build: `npm run build`
- Type check: `npm run typecheck`
- Lint: `npm run lint`

## Referências

- O protótipo navegável original está em `docs/prototipo/cesta-prototipo.jsx` — usar como
  referência de fluxo e telas, mas reescrever seguindo a estrutura e convenções deste arquivo.
- O plano de construção em etapas está em `PLANO.md` (não faz parte do contexto permanente;
  consultar quando solicitado).
