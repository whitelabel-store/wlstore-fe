// @vitest-environment node
// O cliente decide servidor × navegador por `window`: estes testes rodam em node.
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError, createHttpClient, resolveBaseUrl } from './client';

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const stubFetch = (impl: (request: Request) => Promise<Response>) => {
  const fetchMock = vi.fn(impl);
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
};

afterEach(() => vi.unstubAllGlobals());

describe('resolveBaseUrl', () => {
  it('no servidor usa a URL de servidor, depois a de navegador, depois o fallback', () => {
    expect(resolveBaseUrl({ server: 'http://svc:8081', browser: 'https://api', fallback: 'http://localhost' })).toBe(
      'http://svc:8081',
    );
    expect(resolveBaseUrl({ browser: 'https://api', fallback: 'http://localhost' })).toBe('https://api');
    expect(resolveBaseUrl({ fallback: 'http://localhost' })).toBe('http://localhost');
  });

  it('no navegador ignora a URL de servidor', () => {
    vi.stubGlobal('window', {});

    expect(resolveBaseUrl({ server: 'http://svc:8081', fallback: 'http://localhost' })).toBe('http://localhost');
  });
});

describe('createHttpClient', () => {
  it('monta a URL a partir da base e envia os headers do momento da chamada, ignorando vazios', async () => {
    const fetchMock = stubFetch(async () => json(200, { ok: true }));
    let tenant = 'tenant-a';
    const api = createHttpClient({
      baseUrl: 'http://catalog:8081',
      getHeaders: () => ({ 'X-Tenant-Id': tenant, Authorization: undefined }),
    });

    await api.get('api/v1/products').json();
    tenant = 'tenant-b';
    await api.get('api/v1/products').json();

    const [first, second] = fetchMock.mock.calls.map(([request]) => request as Request);
    expect(first.url).toBe('http://catalog:8081/api/v1/products');
    expect(first.headers.get('X-Tenant-Id')).toBe('tenant-a');
    expect(first.headers.has('Authorization')).toBe(false);
    expect(second.headers.get('X-Tenant-Id')).toBe('tenant-b');
  });

  it('transforma o ProblemDetail do Spring em ApiError com status e erros por campo', async () => {
    stubFetch(async () =>
      json(400, { title: 'Bad Request', detail: 'Validation failed', errors: { amountCents: 'must be positive' } }),
    );
    const api = createHttpClient({ baseUrl: 'http://pricing:8082' });

    const error = await api.put('api/v1/prices/SKU', { json: {} }).json().catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({
      message: 'Validation failed',
      status: 400,
      fieldErrors: { amountCents: 'must be positive' },
    });
  });

  it('sem corpo de erro, mantém o status e uma mensagem do ky', async () => {
    stubFetch(async () => new Response(null, { status: 503 }));
    const api = createHttpClient({ baseUrl: 'http://catalog:8081' });

    const error = await api.get('api/v1/products').json().catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).status).toBe(503);
    expect((error as ApiError).message).not.toBe('');
  });

  it('falha de rede vira ApiError com status 0 e mensagem sem a URL interna', async () => {
    stubFetch(async () => {
      throw new TypeError('fetch failed: connect ECONNREFUSED catalog:8081');
    });
    const api = createHttpClient({ baseUrl: 'http://catalog:8081' });

    const error = await api.get('api/v1/products').json().catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).status).toBe(0);
    expect((error as ApiError).message).toBe('Não foi possível falar com o servidor. Tente de novo.');
  });
});
