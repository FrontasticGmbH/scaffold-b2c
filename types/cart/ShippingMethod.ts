import { ShippingRate } from './ShippingRate';

export interface ShippingMethod {
  shippingMethodId: string;
  name?: string;
  description?: string;
  rates?: ShippingRate[]; // TODO: should we get rid of rates?
}
