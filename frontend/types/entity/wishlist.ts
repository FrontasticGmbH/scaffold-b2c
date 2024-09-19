import { Variant } from './product';

export interface LineItem {
  lineItemId: string;
  productId?: string;
  name?: string;
  type?: string;
  addedAt?: Date;
  count?: number;
  variant?: Variant;
  _url?: string;
}

export interface Wishlist {
  wishlistId: string;
  wishlistVersion?: string;
  anonymousId?: string;
  accountId?: string;
  name?: string;
  lineItems?: LineItem[];
}
