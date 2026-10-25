/** Espelha o PriceResponseDTO do pricing-service. */
export interface Price {
  sku: string;
  amountCents: number;
  originalAmountCents: number | null;
  validFrom: string;
  validTo: string | null;
}

/** Espelha o PriceRequestDTO: `originalAmountCents`, se houver, maior que `amountCents`. */
export interface DefinePriceInput {
  amountCents: number;
  originalAmountCents?: number;
}
