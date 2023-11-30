//TODO: refine our shipping methods strategy

export interface ShippingLocation {
  /**
   * 2 letter ISO code (https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)
   */
  country?: string;
  state?: string;
}
