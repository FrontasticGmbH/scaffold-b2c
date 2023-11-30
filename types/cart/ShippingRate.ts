import { ShippingLocation } from './ShippingLocation';
import { Money } from '../product/Money';

export interface ShippingRate {
  // TODO: should we called zoneId?
  shippingRateId?: string;
  name?: string;
  locations?: ShippingLocation[]; // Shipping locations this rate applies to.
  price?: Money;
}
