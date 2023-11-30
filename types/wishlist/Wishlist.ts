import { LineItem } from './LineItem';

export interface Wishlist {
  wishlistId: string;
  wishlistVersion?: string;
  anonymousId?: string;
  accountId?: string;
  name?: string;
  lineItems?: LineItem[];
}
