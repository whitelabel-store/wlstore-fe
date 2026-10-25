# wlstore-fe

Frontend da WLStore: **um app Next.js** com três áreas.

| Área | Rotas | Backend |
| --- | --- | --- |
| Loja | `/` (home, busca `?q=`, filtros `?categoria=` e `?marca=`) | `catalog-service` |
| Painel do lojista | `/painel` | `pricing-service` |
| Checkout | `/checkout` → `/checkout/carrinho` | `order-service` (ainda sem endpoints: carrinho vazio) |

O backend está em [wlstore-be](https://github.com/whitelabel-store/wlstore-be).

## Rodar

Pré-requisitos: Node 22+ e npm 11.

```sh
npm install
npm run dev          # http://localhost:3000
```

Precisa do `catalog-service` em `http://localhost:8081` (e do
`pricing-service` em `:8082` para o painel). Sem o backend, a loja mostra o
aviso "Não foi possível carregar".

## Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento (porta 3000) |
| `npm run build` / `npm start` | Build e servidor de produção |
| `npm run lint` | ESLint (regras do Next) |
| `npm run typecheck` | TypeScript |
| `npm test` | Testes (Vitest) |

## Variáveis de ambiente

Lidas em runtime pelo servidor Next (a mesma imagem serve todos os ambientes):

| Variável | Padrão | Descrição |
| --- | --- | --- |
| `CATALOG_API_URL` | `http://localhost:8081` | catalog-service |
| `PRICING_API_URL` | `http://localhost:8082` | pricing-service |
| `TENANT_ID` | tenant de dev | Tenant das chamadas, até existir login |

## Estrutura

```
src/
├── app/
│   ├── layout.tsx            raiz: fontes, tema, React Query
│   ├── (loja)/               / — cabeçalho com busca, menu de categorias, rodapé
│   ├── painel/               /painel — navegação do painel
│   └── checkout/             /checkout — cabeçalho enxuto
├── components/
│   ├── ui/                   componentes shadcn/ui
│   ├── store-header.tsx      cabeçalho da loja (aviso, logo, busca)
│   ├── store-footer.tsx
│   ├── section-nav.tsx       navegação de área (painel)
│   └── providers/            QueryProvider
├── config/                   um cliente HTTP por serviço (api.ts = catalog, pricing-api.ts)
├── features/                 category-navigation, products, pricing, prices, cart
├── lib/                      utils (cn), fonts, http (cliente ky + ApiError)
└── styles/globals.css        tema do design system WLStore (Tailwind v4)
```

Cada feature segue o padrão componente → hook (TanStack Query) → Server Action
→ `http/` → backend, com testes ao lado de cada arquivo. As regras estão em
[skills/SKILLS.md](skills/SKILLS.md).

Novo componente shadcn: `npx shadcn@latest add dialog` (os aliases `@/` estão
em `components.json`).

## Deploy

O workflow `.github/workflows/deploy.yml` (template da
[plataforma](https://github.com/infra-devops-full/infra)) testa, builda a
imagem `ghcr.io/whitelabel-store/wlstore-fe/wlstore-fe` e grava a tag em
`projects/wlstore/apps/wlstore-fe/` no repo de infra; o ArgoCD aplica.
`develop` → ambiente develop; `main` → prod.

```sh
docker build -t wlstore-fe .
```
