import { Address } from 'shared/types/account/Address';
import { Cart } from 'shared/types/cart';
import { DiscountCode } from 'shared/types/cart/Discount';
import { Order } from 'shared/types/cart/Order';
import { ShippingMethod } from 'shared/types/cart/ShippingMethod';
import { Variant } from 'shared/types/product';
import { Money } from 'shared/types/product/Money';
import { ProjectSettings } from 'shared/types/ProjectSettings';

export interface CartDetails {
  account?: { email: string };
  shipping?: Address;
  billing?: Address;
}

export interface Transaction {
  isEstimatedShipping?: boolean;
  subtotal: Required<Money>;
  discount: Required<Money>;
  shipping: Required<Money>;
  tax: Required<Money>;
  total: Required<Money>;
}
export interface UseCartReturn {
  data?: Cart;
  totalItems: number;
  isEmpty: boolean;
  isShippingAccurate: boolean;
  hasOutOfStockItems: boolean;
  transaction: Transaction;
  addItem: (variant: Variant, quantity: number) => Promise<void>;
  updateCart: (payload: CartDetails) => Promise<Cart>;
  setShippingMethod: (shippingMethodId: string) => Promise<void>;
  removeItem: (lineItemId: string) => Promise<void>;
  updateItem: (lineItemId: string, newQuantity: number) => Promise<void>;
  removeDiscountCode?: (discount: DiscountCode) => Promise<void>;
  redeemDiscountCode?: (code: string) => Promise<void>;
  shippingMethods: { data?: ShippingMethod[] };
  orderCart: () => Promise<Order>;
  queryOrder: (orderId: string) => Promise<Order>;
  getOrder: (orderId: string) => Promise<Order>;
  orderHistory?: () => Promise<Order[]>;
  getProjectSettings?: () => Promise<ProjectSettings>;
  resetCart?: () => Promise<void>;
}
