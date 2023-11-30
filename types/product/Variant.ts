import { Attributes } from './Attributes';
import { Money } from './Money';

export interface Variant {
  id?: string;
  sku: string;
  groupId?: string;
  price?: Money;
  discountedPrice?: Money; // Discounted price
  discounts?: string[]; // Discount descriptions
  attributes?: Attributes;
  images?: string[];
  isOnStock?: boolean;
  restockableInDays?: number;
  availableQuantity?: number;
}
