import { Money } from '../product';
import { Tax } from './Tax';
import { DiscountedPrice } from './Discount';
import { ShippingRate } from './ShippingRate';
import { TaxRate } from './TaxRate';

export interface ShippingInfo {
  shippingMethodId?: string;
  name?: string;
  price?: Money;
  rate?: ShippingRate;
  taxRate?: TaxRate;
  taxed?: Tax;
  discountedPrice?: DiscountedPrice;
}
