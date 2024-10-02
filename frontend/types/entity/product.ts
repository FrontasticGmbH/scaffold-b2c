import { Category } from './category';

export interface Money {
  fractionDigits?: number;
  centAmount?: number;
  currencyCode?: string; // The currency code compliant to ISO 4217.
}

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
  discountedPrice?: Money;
  discounts?: DiscountValue[];
  attributes?: Record<string, any>; //eslint-disable-line
  images?: string[];
  isOnStock?: boolean;
  restockableInDays?: number;
  availableQuantity?: number;
  isMatchingVariant?: boolean;
}

export interface Product {
  productId?: string;
  productKey?: string;
  productRef?: string;
  changed?: Date;
  version?: string;
  name?: string;
  slug?: string;
  description?: string;
  categories?: Category[];
  variants: Variant[];
  _url?: string;
}
