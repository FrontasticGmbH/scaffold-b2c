import { GetProductQuery, ProductQueryQuery, QueryProductCategoriesQuery } from '../queries/ProductQueries';
import { Category, FilterField, Product } from 'shared/types/product';
import { SDKResponse, ServerOptions } from '@commercetools/frontend-sdk';
import { PaginatedResult, ProductPaginatedResult } from 'shared/types/result';

type GetProductAction = (
  query: GetProductQuery,
  options?: {
    /**
     * @param {boolean} [options.skipQueue] - An optional boolean, default false. Indicates whether or not to skip the action queue on the coFE base SDK and execute fully asyncronously. May cause race conditions if used incorrectly.
     */
    skipQueue?: boolean;
    /**
     * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value. Overrides customHeaderValue passed in coFE base SDK configure.
     */
    customHeaderValue?: string;
    /**
     * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
     */
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<Product>>;

type ProductQueryAction = (
  query: ProductQueryQuery,
  options?: {
    /**
     * @param {boolean} [options.skipQueue] - An optional boolean, default false. Indicates whether or not to skip the action queue on the coFE base SDK and execute fully asyncronously. May cause race conditions if used incorrectly.
     */
    skipQueue?: boolean;
    /**
     * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value. Overrides customHeaderValue passed in coFE base SDK configure.
     */
    customHeaderValue?: string;
    /**
     * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
     */
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<ProductPaginatedResult>>;

type QueryProductCategoriesAction = (
  query: QueryProductCategoriesQuery,
  options?: {
    /**
     * @param {boolean} [options.skipQueue] - An optional boolean, default false. Indicates whether or not to skip the action queue on the coFE base SDK and execute fully asyncronously. May cause race conditions if used incorrectly.
     */
    skipQueue?: boolean;
    /**
     * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value. Overrides customHeaderValue passed in coFE base SDK configure.
     */
    customHeaderValue?: string;
    /**
     * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
     */
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<PaginatedResult<Category>>>;

type GetSearchableProductAttributesAction = (options?: {
  /**
   * @param {boolean} [options.skipQueue] - An optional boolean, default false. Indicates whether or not to skip the action queue on the coFE base SDK and execute fully asyncronously. May cause race conditions if used incorrectly.
   */
  skipQueue?: boolean;
  /**
   * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value. Overrides customHeaderValue passed in coFE base SDK configure.
   */
  customHeaderValue?: string;
  /**
   * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
   */
  serverOptions?: ServerOptions;
}) => Promise<SDKResponse<FilterField[]>>;

export {
  type GetProductAction,
  type ProductQueryAction,
  type QueryProductCategoriesAction,
  type GetSearchableProductAttributesAction,
};
