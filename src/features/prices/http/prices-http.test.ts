import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getCurrentPrices } from './get-current-prices';
import { getPriceHistory } from './get-price-history';
import { putPrice } from './put-price';

const { get, put } = vi.hoisted(() => ({ get: vi.fn(), put: vi.fn() }));
vi.mock('../../../config/pricing-api', () => ({ api: { get, put } }));

const price = {
  sku: 'CAM P/AZUL',
  amountCents: 9000,
  originalAmountCents: 10000,
  validFrom: '2026-10-24T12:00:00Z',
  validTo: null,
};
const reply = (data: unknown) => ({ json: () => Promise.resolve(data) });

describe('camada http de preços', () => {
  beforeEach(() => {
    get.mockReset();
    put.mockReset();
  });

  it('putPrice envia o preço no corpo e codifica o SKU na URL', async () => {
    put.mockReturnValue(reply(price));

    await expect(putPrice('CAM P/AZUL', { amountCents: 9000, originalAmountCents: 10000 })).resolves.toEqual(price);
    expect(put).toHaveBeenCalledWith('api/v1/prices/CAM%20P%2FAZUL', {
      json: { amountCents: 9000, originalAmountCents: 10000 },
    });
  });

  it('getCurrentPrices junta os SKUs com vírgula', async () => {
    get.mockReturnValue(reply([price]));

    await expect(getCurrentPrices(['A', 'B'])).resolves.toEqual([price]);
    expect(get).toHaveBeenCalledWith('api/v1/prices', { searchParams: { skus: 'A,B' } });
  });

  it('getPriceHistory busca o histórico do SKU', async () => {
    get.mockReturnValue(reply([price]));

    await expect(getPriceHistory('CAM P/AZUL')).resolves.toEqual([price]);
    expect(get).toHaveBeenCalledWith('api/v1/prices/CAM%20P%2FAZUL/history');
  });

  it('propaga o erro do cliente HTTP', async () => {
    get.mockReturnValue({ json: () => Promise.reject(new Error('sku is not a known SKU')) });

    await expect(getPriceHistory('X')).rejects.toThrow('sku is not a known SKU');
  });
});
