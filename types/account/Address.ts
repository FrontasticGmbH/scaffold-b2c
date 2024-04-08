export interface Address {
  addressId?: string;
  key?: string;
  salutation?: string;
  firstName?: string;
  lastName?: string;
  streetName?: string;
  streetNumber?: string;
  additionalStreetInfo?: string;
  additionalAddressInfo?: string;
  postalCode?: string;
  city?: string;
  country?: string; // 2 letter ISO code (https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)
  state?: string;
  phone?: string;
  isDefaultBillingAddress?: boolean;
  isDefaultShippingAddress?: boolean;
  isShippingAddress?: boolean;
  isBillingAddress?: boolean;
}
