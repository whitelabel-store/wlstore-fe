import { afterEach, describe, expect, it, vi } from 'vitest';

// env.ts lê process.env ao ser importado: cada teste importa de novo.
async function loadEnv() {
  vi.resetModules();
  return (await import('./env')).serverEnv;
}

const ALL = {
  CATALOG_API_URL: 'http://catalog-service:8081',
  PRICING_API_URL: 'http://pricing-service:8082',
  TENANT_ID: '11111111-1111-1111-1111-111111111111',
};

describe('serverEnv', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('usa as variáveis definidas', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    for (const [k, v] of Object.entries(ALL)) vi.stubEnv(k, v);
    expect(await loadEnv()).toEqual({
      catalogApiUrl: ALL.CATALOG_API_URL,
      pricingApiUrl: ALL.PRICING_API_URL,
      tenantId: ALL.TENANT_ID,
    });
  });

  it('em desenvolvimento, sem variáveis, usa os padrões locais', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    for (const k of Object.keys(ALL)) vi.stubEnv(k, '');
    const env = await loadEnv();
    expect(env.catalogApiUrl).toBe('http://localhost:8081');
    expect(env.pricingApiUrl).toBe('http://localhost:8082');
  });

  it('em produção, sem a variável, falha dizendo qual falta', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('NEXT_PHASE', '');
    vi.stubEnv('CATALOG_API_URL', ALL.CATALOG_API_URL);
    vi.stubEnv('PRICING_API_URL', '');
    vi.stubEnv('TENANT_ID', ALL.TENANT_ID);
    await expect(loadEnv()).rejects.toThrow(/PRICING_API_URL não definida/);
  });

  it('no next build (sem as variáveis do cluster) não falha', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('NEXT_PHASE', 'phase-production-build');
    for (const k of Object.keys(ALL)) vi.stubEnv(k, '');
    expect((await loadEnv()).catalogApiUrl).toBe('http://localhost:8081');
  });
});
