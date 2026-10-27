import { createHttpClient } from '@/lib/http';

import { serverEnv } from './env';

/**
 * Cliente do pricing-service (painel do lojista). Usado só no servidor; em
 * produção, PRICING_API_URL aponta para o Service interno.
 */
export const api = createHttpClient({
  baseUrl: serverEnv.pricingApiUrl,
  getHeaders: () => ({ 'X-Tenant-Id': serverEnv.tenantId }),
});
