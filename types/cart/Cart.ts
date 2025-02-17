import { LineItem } from './LineItem';
import { Address, AccountGroup } from '../account';
import { Payment } from './Payment';
import { DirectDiscount, DiscountCode, DiscountOnTotalPrice } from './Discount';
import { Tax } from './Tax';
import { ShippingInfo } from './ShippingInfo';
import { Money } from '../product';
import { ShippingMethod } from './ShippingMethod';

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
  discountCodes?: DiscountCode[];
  directDiscounts?: DirectDiscount[];
  taxed?: Tax;
  origin?: CartOrigin;
  cartState?: CartState;
  accountId?: string;
  storeKey?: string;
  discountOnTotalPrice?: DiscountOnTotalPrice;
  accountGroup?: AccountGroup;
}
