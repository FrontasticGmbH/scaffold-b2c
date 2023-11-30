import { Account, Address } from 'shared/types/account';
import { ResponseError } from 'frontastic';

export interface GetAccountResult {
  loggedIn: boolean;
  accountLoading: boolean;
  account?: Account;
  error?: ResponseError;
}

export interface UpdateAccount {
  firstName?: string;
  lastName?: string;
  salutation?: string;
  birthdayYear?: number;
  birthdayMonth?: number;
  birthdayDay?: number;
}

export interface RegisterAccount extends UpdateAccount {
  email: string;
  password: string;
  billingAddress?: Address;
  shippingAddress?: Address;
}

export interface UseAccountReturn extends GetAccountResult {
  shippingAddresses: Address[];
  billingAddresses: Address[];
  defaultShippingAddress?: Address;
  defaultBillingAddress?: Address;
  login: (email: string, password: string, remember?: boolean) => Promise<Account>;
  logout: () => Promise<void>;
  register: (account: RegisterAccount) => Promise<Account>;
  confirm: (token: string) => Promise<Account>;
  requestConfirmationEmail: (email: string, password: string) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<Account>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<Account>;
  update: (account: UpdateAccount) => Promise<Account>;
  addAddress: (address: Omit<Address, 'addressId'>) => Promise<Account>;
  addShippingAddress: (address: Omit<Address, 'addressId'>) => Promise<Account>;
  addBillingAddress: (address: Omit<Address, 'addressId'>) => Promise<Account>;
  updateAddress: (address: Address) => Promise<Account>;
  removeAddress: (addressId: string) => Promise<Account>;
  setDefaultBillingAddress: (addressId: string) => Promise<Account>;
  setDefaultShippingAddress: (addressId: string) => Promise<Account>;
}
