import { Money } from '../product/Money';

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

export interface DiscountedPricePerCount {
  count?: number;
  discounts?: Discount[];
}
