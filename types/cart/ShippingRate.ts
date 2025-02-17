import { ShippingLocation } from './ShippingLocation';
import { Money } from '../product/Money';

export interface ShippingRate {
  shippingRateId?: string;
  name?: string;
  locations?: ShippingLocation[]; // Shipping locations this rate applies to.
  price?: Money;
  freeAbove?: Money;
}
