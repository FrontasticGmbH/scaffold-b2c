import { Address } from './account';
import { Money, Variant } from './product';

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
  discountedPrice?: Money; // Discounted price per item
  discountTexts?: string[]; // @deprecated use discountedPricePerCount instead
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

export interface ShippingInfo extends ShippingMethod {
  price?: Money;
  taxed?: Tax;
  taxIncludedInPrice?: boolean;
}

export interface Discount {
  discountId?: string;
  code?: string;
  state?: string;
  name?: string;
  description?: string;

  /**
   * Amount discounted.
   *
   * On Cart, the amount discounted in the cart.
   * On LineItem, the amount discounted per single line item.
   */
  discountedAmount?: Money;
}

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
  discountCodes?: Discount[];
  taxed?: Tax;
  payments?: Payment[];
  discountedAmount?: Money;
  origin?: CartOrigin;
  cartState?: CartState;
  accountId?: string;
  storeKey?: string;
}
