import { createHttpClient, resolveBaseUrl } from '@/lib/http';

// Tenant fixo enquanto não existe login; depois vem da sessão.
const DEV_TENANT_ID = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

/**
 * Cliente do catalog-service. Usado só no servidor (Server Actions); em
 * produção, CATALOG_API_URL aponta para o Service interno.
 */
export const api = createHttpClient({
  baseUrl: resolveBaseUrl({
    server: process.env.CATALOG_API_URL,
    fallback: 'http://localhost:8081',
  }),
  getHeaders: () => ({ 'X-Tenant-Id': process.env.TENANT_ID ?? DEV_TENANT_ID }),
});
