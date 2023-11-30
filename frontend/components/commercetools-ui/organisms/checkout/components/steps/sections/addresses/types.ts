export interface Address {
  addressId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  line1: string;
  line2?: string;
  postalCode: string;
  city: string;
  state?: string;
  addressType?: 'shipping' | 'billing';
}
