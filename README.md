# wlstore-vitrine

A **loja** da WLStore: home, busca, menu de categorias, vitrines e listagens de
produtos. É o app padrão do domínio: atende `/` e tudo que nenhum outro
microfrontend reivindica.

Faz parte da arquitetura de microfrontends (Next.js Multi-Zones). Cada app tem
repositório, build, deploy e versão próprios e **não importa código de outro
app**:

| App | Caminho | Repositório |
| --- | --- | --- |
| vitrine | `/` | este |
| painel do lojista | `/painel` | [wlstore-painel](https://github.com/whitelabel-store/wlstore-painel) |

O que é comum (design system, cabeçalho, rodapé, cliente HTTP) vem dos pacotes
versionados de [wlstore-platform-fe](https://github.com/whitelabel-store/wlstore-platform-fe).

## Rodar

Pré-requisitos: Node 22+, npm 11 e token do GitHub Packages (veja abaixo).

```sh
npm install
npm run dev          # http://localhost:3000
```

A vitrine precisa do `catalog-service` (repo
[wlstore-be](https://github.com/whitelabel-store/wlstore-be)) em
`http://localhost:8081`. Para ver `/painel` através da vitrine, suba também o
`wlstore-painel` (porta 4300). Em dev, a vitrine encaminha `/painel/*` para ele.

### Token do GitHub Packages

Os pacotes `@whitelabel-store/*` vêm do GitHub Packages, que exige token até
para pacote público:

```sh
gh auth refresh -h github.com -s read:packages
echo "//npm.pkg.github.com/:_authToken=$(gh auth token)" >> ~/.npmrc
```

## Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento na porta 3000 |
| `npm run build` / `npm start` | Build e servidor de produção |
| `npm run lint` | ESLint (regras do Next) |
| `npm run typecheck` | TypeScript |
| `npm test` | Testes (Vitest) |

## Variáveis de ambiente

| Variável | Padrão | Descrição |
| --- | --- | --- |
| `CATALOG_API_URL` | `http://localhost:8081` | catalog-service, chamado só no servidor |
| `TENANT_ID` | tenant de dev | Tenant das chamadas, até existir login |
| `PAINEL_URL` | `http://localhost:4300` | Só em dev: para onde a vitrine encaminha `/painel` |

São lidas em runtime (Deployment), não no build. A imagem é a mesma em todos
os ambientes.

## Estrutura

Cada feature segue o padrão componente → hook (TanStack Query) → Server Action
→ `http/` → backend, com testes ao lado de cada arquivo:

```
src/
├── app/                      rotas (home com ?q=, ?categoria=, ?marca=)
├── config/api.ts             cliente do catalog-service
├── shared/                   tipos e helpers de teste comuns às features
└── features/
    ├── category-navigation/  menu "Todas as categorias"
    ├── products/             ProductCard, ProductShelf (vitrine e grade)
    └── pricing/              exibição de preço (PriceTag, DiscountBadge, parcelas)
```

**Links:** dentro da vitrine, `next/link`. Para outro app (ex.: `/painel`),
`<a>`, porque é outro runtime Next e a navegação recarrega o documento.

## Docker

```sh
docker build --secret id=npm_token,env=NODE_AUTH_TOKEN -t wlstore-vitrine .
```

O token do GitHub Packages entra como build secret, só no `npm ci`, e não fica
na imagem.
