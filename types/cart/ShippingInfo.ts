import { ShippingMethod } from './ShippingMethod';
import { Money } from '../product';
import { Tax } from './Tax';
import { DiscountedPrice } from './Discount';

export interface ShippingInfo extends ShippingMethod {
  price?: Money;
  taxed?: Tax;
  taxIncludedInPrice?: boolean;
  discountedPrice?: DiscountedPrice;
}
