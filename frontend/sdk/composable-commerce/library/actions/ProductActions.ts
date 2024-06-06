import { Event, SDK, ServerOptions } from '@commercetools/frontend-sdk';
import { GetProductQuery, ProductQueryQuery, QueryProductCategoriesQuery } from '../../types/queries/ProductQueries';
import {
  GetProductAction,
  GetSearchableProductAttributesAction,
  ProductQueryAction,
  QueryProductCategoriesAction,
} from '../../types/actions/ProductActions';
import { Product, FilterField, Category } from 'shared/types/product';
import { ComposableCommerceEvents } from '../../types/events/ComposableCommerceEvents';
import { PaginatedResult, ProductPaginatedResult } from 'shared/types/result';

export type ProductActions = {
  getProduct: GetProductAction;
  query: ProductQueryAction;
  queryCategories: QueryProductCategoriesAction;
  getSearchableAttributes: GetSearchableProductAttributesAction;
};

export const getProductActions = (sdk: SDK<ComposableCommerceEvents>): ProductActions => {
  return {
    getProduct: async (
      query: GetProductQuery,
      options: {
        skipQueue?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<Product>({
        actionName: 'product/getProduct',
        query,
        skipQueue: options.skipQueue,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });

      if (!response.isError && response.data) {
        sdk.trigger(
          new Event({
            eventName: 'productFetched',
            data: {
              product: response.data,
            },
          }),
        );
      }
      return response;
    },
    query: async (
      query: ProductQueryQuery,
      options: {
        skipQueue?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<ProductPaginatedResult>({
        actionName: 'product/query',
        query,
        skipQueue: options.skipQueue,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });

      if (!response.isError) {
        sdk.trigger(
          new Event({
            eventName: 'productsQueried',
            data: {
              query: query,
              result: response.data,
            },
          }),
        );
      }
      return response;
    },
    queryCategories: async (
      query: QueryProductCategoriesQuery,
      options: {
        skipQueue?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<PaginatedResult<Category>>({
        actionName: 'product/queryCategories',
        query,
        skipQueue: options.skipQueue,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });

      if (!response.isError) {
        sdk.trigger(
          new Event({
            eventName: 'productCategoriesQueried',
            data: {
              query: query,
              result: response.data,
            },
          }),
        );
      }
      return response;
    },
    getSearchableAttributes: async (
      options: {
        skipQueue?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<FilterField[]>({
        actionName: 'product/searchableAttributes',
        skipQueue: options.skipQueue,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });

      if (!response.isError) {
        sdk.trigger(
          new Event({
            eventName: 'searchableProductAttributesFetched',
            data: {
              filterFields: response.data,
            },
          }),
        );
      }
      return response;
    },
  };
};
