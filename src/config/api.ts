import { createHttpClient } from '@/lib/http';

import { serverEnv } from './env';

/**
 * Cliente do catalog-service. Usado só no servidor (Server Actions); em
 * produção, CATALOG_API_URL aponta para o Service interno.
 */
export const api = createHttpClient({
  baseUrl: serverEnv.catalogApiUrl,
  getHeaders: () => ({ 'X-Tenant-Id': serverEnv.tenantId }),
});
