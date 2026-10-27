# syntax=docker/dockerfile:1
#
# Imagem do front (Next.js), a partir de templates/nextjs do repo de infra.
#
#   docker build -t wlstore-fe .
#
# Nada de NEXT_PUBLIC_*: o app só chama o backend pelo servidor Next, e as URLs
# (CATALOG_API_URL, PRICING_API_URL, TENANT_ID) são lidas em runtime, do
# Deployment. A mesma imagem serve todos os ambientes.
#
# Multi-arch (amd64 + arm64) sem emulação: o `next build` gera JavaScript,
# igual para as duas arquiteturas, e roda na arquitetura do runner
# ($BUILDPLATFORM); as dependências de produção são baixadas já com os
# binários da arquitetura de destino. Só o estágio final é da arquitetura de
# destino, e ele apenas copia arquivos.

ARG NODE_IMAGE=node:24-alpine
# Fixe a versão do npm que gera o lock (o da imagem pode recusar o `npm ci`).
ARG NPM_VERSION=11.6.2

# ---------------------------------------------------------------------------
# 1. Build — arquitetura do runner (nativo, rápido)
# ---------------------------------------------------------------------------
FROM --platform=$BUILDPLATFORM ${NODE_IMAGE} AS build
ARG NPM_VERSION
WORKDIR /app
RUN npm install -g npm@${NPM_VERSION}

COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---------------------------------------------------------------------------
# 2. Dependências de produção — também no runner, mas PARA a arquitetura de
#    destino: --cpu/--os/--libc baixam os binários pré-compilados certos
#    (sharp, por exemplo) sem executar nada da outra arquitetura. Os scripts
#    de instalação ficam de fora: o único (sharp) só confere esse binário.
# ---------------------------------------------------------------------------
FROM --platform=$BUILDPLATFORM ${NODE_IMAGE} AS deps
ARG NPM_VERSION
ARG TARGETARCH
WORKDIR /app
RUN npm install -g npm@${NPM_VERSION}

COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev --ignore-scripts --os=linux --libc=musl \
      --cpu="$([ "$TARGETARCH" = amd64 ] && echo x64 || echo "$TARGETARCH")"

# ---------------------------------------------------------------------------
# 3. Runtime
# ---------------------------------------------------------------------------
FROM ${NODE_IMAGE} AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000

# `next start` carrega o next.config.js em runtime (funciona sem as devDeps).
COPY --from=deps  /app/package.json ./
COPY --from=deps  /app/node_modules ./node_modules
COPY --from=build /app/next.config.js ./
COPY --from=build /app/public ./public
COPY --from=build /app/.next ./.next

USER node
EXPOSE 3000

CMD ["npx", "next", "start"]
