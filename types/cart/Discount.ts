import { Money } from '../product';

export type DiscountType = 'absolute' | 'relative' | 'fixed' | 'giftLineItem' | 'external';

export type DiscountCodeState =
  | 'ApplicationStoppedByPreviousDiscount'
  | 'DoesNotMatchCart'
  | 'MatchesCart'
  | 'MaxApplicationReached'
  | 'NotActive'
  | 'NotValid';

export type ProductDiscountValue = AbsoluteDiscountValue | RelativeDiscountValue;

export type CartDiscountValue =
  | AbsoluteDiscountValue
  | RelativeDiscountValue
  | FixedDiscountValue
  | GiftLineItemDiscountValue;

export interface BaseDiscountValue {
  type: DiscountType;
}

export interface AbsoluteDiscountValue extends BaseDiscountValue {
  type: 'absolute';
  value: Money;
}

export interface RelativeDiscountValue extends BaseDiscountValue {
  type: 'relative';
  value: number;
}

export interface FixedDiscountValue extends BaseDiscountValue {
  type: 'fixed';
  value: Money;
}

export interface GiftLineItemDiscountValue extends BaseDiscountValue {
  type: 'giftLineItem';
  productId: string;
  variantId: string;
}

export interface ProductDiscount {
  discountValue?: ProductDiscountValue;
  description?: string;
  name?: string;
}

export interface CartDiscount {
  cartDiscountId?: string;
  name?: string;
  description?: string;
  discountValue?: CartDiscountValue;
}

export interface ProductDiscountedPrice {
  value?: Money;
  discount?: ProductDiscount;
}

export interface DiscountCode {
  discountCodeId?: string;
  code?: string;
  name?: string;
  description?: string;
  state?: DiscountCodeState;
  discountedAmount?: Money;
  discounts?: CartDiscount[];
}

export interface DirectDiscount {
  directDiscountId: string;
  discountValue: CartDiscountValue;
}

export interface DiscountedPricePerCount {
  count?: number;
  discountedPrice?: DiscountedPrice;
}

export interface DiscountedPrice {
  value: Money;
  includedDiscounts: DiscountedPortion[];
}

export interface DiscountOnTotalPrice {
  discountedAmount: Money;
  discountedGrossAmount?: Money;
  discountedNetAmount?: Money;
  includedDiscounts: DiscountedPortion[];
}

export interface DiscountedPortion {
  discountedAmount: Money;
  discount: CartDiscount;
}
