import { AbsoluteDiscountValue, RelativeDiscountValue } from './cart';
import { Category } from './category';

export interface Money {
  fractionDigits?: number;
  centAmount?: number;
  currencyCode?: string; // The currency code compliant to ISO 4217.
}

export type ProductDiscountValue = AbsoluteDiscountValue | RelativeDiscountValue;

export interface ProductDiscount {
  discountValue?: ProductDiscountValue;
  description?: string;
  name?: string;
}

export interface ProductDiscountedPrice {
  value?: Money;
  discount?: ProductDiscount;
}

export interface Variant {
  id?: string;
  sku: string;
  groupId?: string;
  price?: Money;
  discountedPrice?: ProductDiscountedPrice;
  // discounts?: DiscountValue[];
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
