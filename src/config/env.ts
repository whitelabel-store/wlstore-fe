/**
 * Variáveis de ambiente do servidor Next, num lugar só (veja .env.example).
 *
 * - `npm run dev` (desenvolvimento): falta uma variável → usa o padrão local
 *   (backend em localhost, tenant de desenvolvimento).
 * - `next start` em produção (develop e prod no cluster): falta uma variável →
 *   erro na subida do servidor (instrumentation.ts), em vez de chamar
 *   localhost ou usar o tenant de teste sem ninguém perceber.
 *
 * Só para o servidor: nada aqui é NEXT_PUBLIC_, nada vai para o navegador.
 */

const isProduction = process.env.NODE_ENV === 'production';
// `next build` também roda com NODE_ENV=production, mas sem as variáveis do
// cluster (a mesma imagem serve develop e prod): não valida no build.
const isBuild = process.env.NEXT_PHASE === 'phase-production-build';

function read(name: string, localDefault: string): string {
  const value = process.env[name]?.trim();
  if (value) return value;
  if (isProduction && !isBuild) {
    throw new Error(
      `Variável de ambiente ${name} não definida. No cluster ela vem dos values do repo de infra ` +
        `(projects/wlstore/apps/wlstore-fe/values*.yaml); localmente, do .env (veja .env.example).`,
    );
  }
  return localDefault;
}

export const serverEnv = {
  /** catalog-service. No cluster: http://catalog-service:8081 (Service interno). */
  catalogApiUrl: read('CATALOG_API_URL', 'http://localhost:8081'),
  /** pricing-service. No cluster: http://pricing-service:8082. */
  pricingApiUrl: read('PRICING_API_URL', 'http://localhost:8082'),
  /** Tenant da loja enquanto não há login (depois vem da sessão). */
  tenantId: read('TENANT_ID', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
} as const;
