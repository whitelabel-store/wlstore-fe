import { api } from '../../../config/pricing-api';
import type { DefinePriceInput, Price } from '../types';

/** PUT /api/v1/prices/{sku}: define o preço em vigor a partir de agora. */
export async function putPrice(sku: string, input: DefinePriceInput): Promise<Price> {
  return api.put(`api/v1/prices/${encodeURIComponent(sku)}`, { json: input }).json<Price>();
}
