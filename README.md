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
cp .env.example .env   # uma vez (valores locais)
npm run dev            # http://localhost:3000
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

Lidas em runtime pelo **servidor** Next (Server Actions), num lugar só:
`src/config/env.ts`. Nenhuma é `NEXT_PUBLIC_*`, então a mesma imagem serve
develop e prod.

| Variável | Local (`.env`) | Cluster (repo de infra, `values.yaml`) | Descrição |
| --- | --- | --- | --- |
| `CATALOG_API_URL` | `http://localhost:8081` | `http://catalog-service:8081` | catalog-service |
| `PRICING_API_URL` | `http://localhost:8082` | `http://pricing-service:8082` | pricing-service |
| `TENANT_ID` | tenant de dev | o mesmo, explícito | tenant das chamadas, até existir login |
| `NEXT_TELEMETRY_DISABLED` | `1` | `1` | telemetria anônima do Next |

### Arquivos por ambiente

| Arquivo | Vale em | Vai para o Git? |
| --- | --- | --- |
| `.env.example` | documentação de todas as variáveis | **sim** (o único) |
| `.env` | local, qualquer modo | não |
| `.env.development` | só `npm run dev` (ex.: apontar para o backend do cluster develop) | não |
| `.env.production` | só `npm run build` / `npm start` na sua máquina | não |
| `.env.local` | ajustes pessoais (prioridade maior) | não |

develop e prod (cluster) **não usam arquivo**: a imagem não leva `.env`
(`.dockerignore`) e os valores vêm de `projects/wlstore/apps/wlstore-fe/values*.yaml`
no repo de infra.

### Validação

- `npm run dev`: faltou uma variável → usa o padrão local.
- `npm start` e no cluster: faltou uma → o servidor **não sobe** e diz qual
  falta e onde configurar (`src/instrumentation.ts`). No Kubernetes aparece
  como `CrashLoopBackOff` com essa mensagem no log do pod.
- `npm run build` não exige as variáveis (a imagem é construída sem elas).

Variável nova: adicione em `src/config/env.ts` (com o padrão local), no
`.env.example` e nos values do repo de infra. Segredo (token, chave):
`projects/wlstore/secrets/<env>.env` no repo de infra + `make seal`, nunca
nos values nem aqui.

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
