import { api } from '../../../config/pricing-api';
import type { Price } from '../types';

/** GET /api/v1/prices?skus=A,B: preço em vigor de cada SKU (sem preço = ausente). */
export async function getCurrentPrices(skus: string[]): Promise<Price[]> {
  return api.get('api/v1/prices', { searchParams: { skus: skus.join(',') } }).json<Price[]>();
}
