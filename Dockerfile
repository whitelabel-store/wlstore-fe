# syntax=docker/dockerfile:1
#
# Imagem da vitrine (Next.js), a partir de templates/nextjs do repo de infra.
#
# Diferença do template: os pacotes @whitelabel-store vêm do GitHub Packages,
# que exige token. Ele entra como BUILD SECRET, só durante o `npm ci`, e não
# fica em nenhuma camada da imagem:
#
#   docker build --secret id=npm_token,env=NODE_AUTH_TOKEN -t wlstore-vitrine .
#
# Nada de NEXT_PUBLIC_*: a vitrine só chama o backend pelo servidor Next, e as
# URLs (CATALOG_API_URL, TENANT_ID) são lidas em runtime, do Deployment.

# ---------------------------------------------------------------------------
# 1. Dependências + build
# ---------------------------------------------------------------------------
FROM node:24-alpine AS build
WORKDIR /app

# Fixe a versão do npm que gera o lock (o da imagem pode recusar o `npm ci`).
ARG NPM_VERSION=11.6.2
RUN npm install -g npm@${NPM_VERSION}

COPY package.json package-lock.json .npmrc ./
RUN --mount=type=secret,id=npm_token \
    echo "//npm.pkg.github.com/:_authToken=$(cat /run/secrets/npm_token)" > /root/.npmrc \
  && npm ci \
  && rm /root/.npmrc

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build \
  && npm prune --omit=dev

# ---------------------------------------------------------------------------
# 2. Runtime
# ---------------------------------------------------------------------------
FROM node:24-alpine AS runner
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
