import { ShippingMethod } from './ShippingMethod';
import { LineItem } from './LineItem';
import { Address } from '../account/Address';
import { Payment } from './Payment';
import { Discount } from './Discount';
import { Tax } from './Tax';
import { ShippingInfo } from './ShippingInfo';
import { Money } from '../product/Money';

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
  payments?: Payment[];
  discountCodes?: Discount[];
  taxed?: Tax;
  discountedAmount?: Money;
  origin?: CartOrigin;
  cartState?: CartState;
  accountId?: string;
  storeKey?: string;
}
