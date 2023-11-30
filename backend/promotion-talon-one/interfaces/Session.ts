export type Attributes = Record<string | number, string | number>;

export interface AdditionalCost {
  price: number;
}

export interface CartItem {
  name: string;
  sku: string;
  quantity: number;
  price: number;
  attributes?: Attributes;
}

export interface Session {
  profileId?: string;
  state?: string;
  cartItems?: CartItem[];
  couponCodes?: string[];
  referralCode?: string;
  additionalCosts?: {
    shipping?: AdditionalCost;
  };
  attributes?: Attributes;
}
