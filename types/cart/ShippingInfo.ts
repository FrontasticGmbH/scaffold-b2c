import { ShippingMethod } from './ShippingMethod';
import { Money } from '../product/Money';

export interface ShippingInfo extends ShippingMethod {
  price?: Money;
  discounts?: Money[];
}
