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
