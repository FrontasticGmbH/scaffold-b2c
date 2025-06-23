/**
 * Module augmentation for '@frontastic/extension-types'.
 *
 * Purpose:
 * - Provide type-safe `query` and `sessionData` properties on the `Request` interface
 * - Avoid usage of `any` in request handlers
 */

import '@frontastic/extension-types';
import { Token } from '@Types/Token';
import { ProductListDataSourceConfiguration } from '@Commerce-commercetools/interfaces/DataSource';

declare module '@frontastic/extension-types' {
  interface Request {
    sessionData: SessionData;
  }
  export interface DataSourceConfiguration {
    configuration: ProductListDataSourceConfiguration;
  }
}

interface SessionData {
  checkoutSessionToken?: Record<string, Token>;
  accountId?: string;
  accountGroupId?: string;
  wishlistId?: string;
  cartId?: string;
}
