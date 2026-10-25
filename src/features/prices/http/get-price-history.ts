import { api } from '../../../config/pricing-api';
import type { Price } from '../types';

/** GET /api/v1/prices/{sku}/history: períodos de preço, do mais antigo ao atual. */
export async function getPriceHistory(sku: string): Promise<Price[]> {
  return api.get(`api/v1/prices/${encodeURIComponent(sku)}/history`).json<Price[]>();
}
