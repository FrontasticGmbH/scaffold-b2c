import { Attributes } from './Attributes';
import { Money } from './Money';

export interface DiscountValue {
  type: 'absolute' | 'relative' | 'external';
  description?: string;
  value?: number | Money;
  permyriad?: number;
}
export interface Variant {
  id?: string;
  sku: string;
  groupId?: string;
  price?: Money;
  discountedPrice?: Money; // Discounted price
  discounts?: DiscountValue[];
  attributes?: Attributes;
  images?: string[];
  isOnStock?: boolean;
  restockableInDays?: number;
  availableQuantity?: number;
}
