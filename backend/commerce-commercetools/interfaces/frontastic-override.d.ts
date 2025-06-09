/**
 * Module augmentation for '@frontastic/extension-types'.
 *
 * Purpose:
 * - Provide type-safe `query` and `sessionData` properties on the `Request` interface
 * - Avoid usage of `any` in request handlers
 */

import '@frontastic/extension-types';
import { Token } from '@Types/Token';
import { Account } from '@Types/account';

// module to add sessionData and query types instead of any
declare module '@frontastic/extension-types' {
  export interface Request<T = never> {
    query: T;
    sessionData: SessionData;
  }
}
interface SessionData {
  checkoutSessionToken?: Record<string, Token>;
  accountId?: string;
  wishlistId?: string;
  cartId?: string;
  account: Account;
}
export interface RawFacetData {
  min?: string | number;
  max?: string | number;
  terms?: string[] | Record<string, string>;
  boolean?: string | boolean;
}
