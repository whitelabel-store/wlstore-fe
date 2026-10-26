# syntax=docker/dockerfile:1
#
# Imagem do front (Next.js), a partir de templates/nextjs do repo de infra.
#
#   docker build -t wlstore-fe .
#
# Nada de NEXT_PUBLIC_*: o app só chama o backend pelo servidor Next, e as URLs
# (CATALOG_API_URL, PRICING_API_URL, TENANT_ID) são lidas em runtime, do
# Deployment. A mesma imagem serve todos os ambientes.

# ---------------------------------------------------------------------------
# 1. Dependências + build
# ---------------------------------------------------------------------------
FROM node:26-alpine AS build
WORKDIR /app

# Fixe a versão do npm que gera o lock (o da imagem pode recusar o `npm ci`).
ARG NPM_VERSION=11.6.2
RUN npm install -g npm@${NPM_VERSION}

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build \
  && npm prune --omit=dev

# ---------------------------------------------------------------------------
# 2. Runtime
# ---------------------------------------------------------------------------
FROM node:26-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000

# `next start` carrega o next.config.js em runtime (funciona sem as devDeps).
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/next.config.js ./
COPY --from=build /app/public ./public
COPY --from=build /app/.next ./.next

USER node
EXPOSE 3000

CMD ["npx", "next", "start"]
