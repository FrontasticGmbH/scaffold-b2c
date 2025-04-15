import { Variant } from '.';

export interface LineItem {
  lineItemId: string;
  productId?: string;
  productSlug?: string;
  name?: string;
  type?: string;
  addedAt?: Date;
  count?: number;
  variant?: Variant;
  _url?: string;
}
