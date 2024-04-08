export interface TaxRate {
  taxRateId?: string;
  taxRateKey?: string;
  name?: string;
  amount?: number;
  includedInPrice?: boolean;
  country?: string;
  state?: string;
}
