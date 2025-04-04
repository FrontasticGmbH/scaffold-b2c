import { Address } from './account';
import { ProductDiscountedPrice, Money, Variant } from './product';

export interface TaxRate {
  taxRateId?: string;
  taxRateKey?: string;
  name?: string;
  amount?: number;
  includedInPrice?: boolean;
  country?: string;
  state?: string;
}

export interface LineItem {
  lineItemId?: string;
  productId?: string;
  name?: string;
  type?: string;
  count?: number;
  price?: Money; // Price of a single item
  discountedPrice?: ProductDiscountedPrice; // Discounted price per item
  discountedPricePerCount?: DiscountedPricePerCount[];
  totalPrice?: Money;
  taxed?: Tax;
  taxRate?: TaxRate;
  variant?: Variant;
  isGift?: boolean;
  _url?: string;
}

export interface ShippingLocation {
  /**
   * 2 letter ISO code (https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)
   */
  country?: string;
  state?: string;
}

export interface ShippingRate {
  // TODO: should we called zoneId?
  shippingRateId?: string;
  name?: string;
  locations?: ShippingLocation[]; // Shipping locations this rate applies to.
  price?: Money;
}

export interface ShippingMethod {
  shippingMethodId: string;
  name?: string;
  description?: string;
  rates?: ShippingRate[]; // TODO: should we get rid of rates?
}

export interface ShippingInfo {
  shippingMethodId?: string;
  name?: string;
  price?: Money;
  rate?: ShippingRate;
  taxRate?: TaxRate;
  taxed?: Tax;
  discountedPrice?: DiscountedPrice;
}

export type DiscountCodeState =
  | 'ApplicationStoppedByPreviousDiscount'
  | 'DoesNotMatchCart'
  | 'MatchesCart'
  | 'MaxApplicationReached'
  | 'NotActive'
  | 'NotValid';

export interface DiscountCode {
  discountCodeId?: string;
  code?: string;
  state?: DiscountCodeState;
  name?: string;
  description?: string;

  /**
   * Amount discounted.
   *
   * On Cart, the amount discounted in the cart.
   * On LineItem, the amount discounted per single line item.
   */
  discountedAmount?: Money;
  discounts?: CartDiscount[];
}

export interface CartDiscount {
  cartDiscountId?: string;
  name?: string;
  description?: string;
  discountValue?: CartDiscountValue;
}

export interface DiscountedPricePerCount {
  count?: number;
  discountedPrice?: DiscountedPrice;
}

export interface DiscountedPrice {
  value: Money;
  includedDiscounts: DiscountedPortion[];
}

export interface DiscountedPortion {
  discountedAmount: Money;
  discount: CartDiscount;
}

export interface DiscountOnTotalPrice {
  discountedAmount: Money;
  discountedGrossAmount?: Money;
  discountedNetAmount?: Money;
  includedDiscounts: DiscountedPortion[];
}

export type DiscountType = 'absolute' | 'relative' | 'fixed' | 'giftLineItem';

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

export type CartDiscountValue =
  | AbsoluteDiscountValue
  | RelativeDiscountValue
  | FixedDiscountValue
  | GiftLineItemDiscountValue;

export interface Tax {
  netAmount?: Money;
  grossAmount?: Money;
  taxAmount?: Money;
  name?: string;
}

export enum PaymentStatuses {
  INIT = 'init',
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
}

export interface Payment {
  id: string;
  paymentProvider: string;
  paymentId: string;
  amountPlanned: Money;
  debug?: string;
  paymentStatus: string;
  version?: number;
  paymentMethod: string;
  paymentDetails?: [];
}

export type CartOrigin = 'Customer' | 'Merchant';

export type CartState = 'Active' | 'Frozen' | 'Merged' | 'Ordered';

export interface Cart {
  cartId: string;
  cartVersion?: string;
  lineItems?: LineItem[];
  email?: string;
  shippingInfo?: ShippingInfo; // Info of the shipping method selected by the customer
  availableShippingMethods?: ShippingMethod[]; // Available shipping methods for this cart
  shippingAddress?: Address;
  billingAddress?: Address;
  itemShippingAddresses?: Address[];
  sum?: Money;
  discountCodes?: DiscountCode[];
  discountOnTotalPrice?: DiscountOnTotalPrice;
  taxed?: Tax;
  payments?: Payment[];
  discountedAmount?: Money;
  origin?: CartOrigin;
  cartState?: CartState;
  accountId?: string;
  storeKey?: string;
}
