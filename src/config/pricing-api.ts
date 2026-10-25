import { createHttpClient, resolveBaseUrl } from '@/lib/http';

// Tenant fixo enquanto não existe login; depois vem da sessão.
const DEV_TENANT_ID = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

/**
 * Cliente do pricing-service (painel do lojista). Usado só no servidor; em
 * produção, PRICING_API_URL aponta para o Service interno.
 */
export const api = createHttpClient({
  baseUrl: resolveBaseUrl({
    server: process.env.PRICING_API_URL,
    fallback: 'http://localhost:8082',
  }),
  getHeaders: () => ({ 'X-Tenant-Id': process.env.TENANT_ID ?? DEV_TENANT_ID }),
});
