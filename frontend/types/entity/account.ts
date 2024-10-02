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

export interface AccountToken {
  email?: string;
  token?: string;
  tokenValidUntil?: Date;
}

export interface Account {
  accountId?: string;
  email: string;
  salutation?: string;
  firstName?: string;
  lastName?: string;
  birthday?: Date;
  password?: string; // TODO: should we use hash the password or use plain password?
  confirmationToken?: AccountToken;
  confirmed?: boolean;
  addresses?: Address[];
  apiToken?: string;
  version?: number;
}
