import * as AccountActions from './actionControllers/AccountController';
import * as ProductActions from './actionControllers/ProductController';
import * as CartActions from './actionControllers/CartController';
import * as WishlistActions from './actionControllers/WishlistController';
import * as ProjectActions from './actionControllers/ProjectController';
import { DataSourcePreviewPayloadElement } from '@frontastic/extension-types/src/ts';

import {
  DataSourceConfiguration,
  DataSourceContext,
  DynamicPageContext,
  DynamicPageRedirectResult,
  DynamicPageSuccessResult,
  ExtensionRegistry,
  Request,
} from '@frontastic/extension-types';
import { getCurrency, getLocale, getPath } from './utils/Request';
import { ProductRouter } from './utils/ProductRouter';
import { Product } from '@Types/product/Product';
import { SearchRouter } from './utils/SearchRouter';
import { CategoryRouter } from './utils/CategoryRouter';
import { ProductApi } from './apis/ProductApi';
import { ProductQueryFactory } from './utils/ProductQueryFactory';
import { ValidationError } from './utils/Errors';
import { ProductPaginatedResult } from '@Types/result';

const getPreviewPayload = (queryResult: ProductPaginatedResult) => {
  return (queryResult.items as Product[]).map((product): DataSourcePreviewPayloadElement => {
    return {
      title: product.name,
      image: product?.variants[0]?.images[0],
    };
  });
};

export default {
  'dynamic-page-handler': async (
    request: Request,
    context: DynamicPageContext,
  ): Promise<DynamicPageSuccessResult | DynamicPageRedirectResult | null> => {
    // Identify static page
    const staticPageMatch = getPath(request)?.match(
      /^\/(cart|checkout|wishlist|account|login|register|reset-password|thank-you)$/,
    );
    if (staticPageMatch) {
      return {
        dynamicPageType: `frontastic${staticPageMatch[0]}`,
        dataSourcePayload: {},
        pageMatchingPayload: {},
      } as DynamicPageSuccessResult;
    }

    // Identify Product
    if (ProductRouter.identifyFrom(request)) {
      return ProductRouter.loadFor(request, context.frontasticContext).then((product: Product) => {
        if (product) {
          return {
            dynamicPageType: 'frontastic/product-detail-page',
            dataSourcePayload: {
              product: product,
            },
            pageMatchingPayload: {
              product: product,
            },
          };
        }

        // FIXME: Return proper error result
        return null;
      });
    }

    // Identify Search
    if (SearchRouter.identifyFrom(request)) {
      return SearchRouter.loadFor(request, context.frontasticContext).then((result: ProductPaginatedResult) => {
        if (result) {
          return {
            dynamicPageType: 'frontastic/search',
            dataSourcePayload: result,
            pageMatchingPayload: result,
          };
        }

        // FIXME: Return proper error result
        return null;
      });
    }

    if (CategoryRouter.identifyFrom(request)) {
      return CategoryRouter.loadFor(request, context.frontasticContext).then((result: ProductPaginatedResult) => {
        if (result) {
          return {
            dynamicPageType: 'frontastic/category',
            dataSourcePayload: result,
            pageMatchingPayload: result,
          };
        }

        // FIXME: Return proper error result
        return null;
      });
    }

    return null;
  },
  'data-sources': {
    'frontastic/product-list': async (config: DataSourceConfiguration, context: DataSourceContext) => {
      const productApi = new ProductApi(
        context.frontasticContext,
        getLocale(context.request),
        getCurrency(context.request),
      );
      const productQuery = ProductQueryFactory.queryFromParams(context?.request, config);

      return await productApi.query(productQuery).then((queryResult) => {
        return !context.isPreview
          ? { dataSourcePayload: queryResult }
          : {
              dataSourcePayload: queryResult,
              previewPayload: getPreviewPayload(queryResult),
            };
      });
    },

    'frontastic/similar-products': async (config: DataSourceConfiguration, context: DataSourceContext) => {
      if (!context.hasOwnProperty('request')) {
        throw new ValidationError({
          message: `Request is not defined in context ${context}`,
        });
      }

      const productApi = new ProductApi(
        context.frontasticContext,
        getLocale(context.request),
        getCurrency(context.request),
      );
      const productQuery = ProductQueryFactory.queryFromParams(context.request, config);
      const query = {
        ...productQuery,
        categories: [
          (context.pageFolder.dataSourceConfigurations.find((stream) => (stream as any).streamId === '__master') as any)
            ?.preloadedValue?.product?.categories?.[0]?.categoryId,
        ],
      };

      return await productApi.query(query).then((queryResult) => {
        return !context.isPreview
          ? { dataSourcePayload: queryResult }
          : {
              dataSourcePayload: queryResult,
              previewPayload: getPreviewPayload(queryResult),
            };
      });
    },

    'frontastic/product': async (config: DataSourceConfiguration, context: DataSourceContext) => {
      const productApi = new ProductApi(
        context.frontasticContext,
        getLocale(context.request),
        getCurrency(context.request),
      );
      const productQuery = ProductQueryFactory.queryFromParams(context?.request, config);

      return await productApi.getProduct(productQuery).then((queryResult) => {
        const payLoadResult = { dataSourcePayload: { product: queryResult } };

        return !context.isPreview
          ? payLoadResult
          : {
              payLoadResult,
              previewPayload: [
                {
                  title: queryResult.name,
                  image: queryResult?.variants[0]?.images[0],
                },
              ],
            };
      });
    },

    'frontastic/other-products': async (config: DataSourceConfiguration, context: DataSourceContext) => {
      if (!context.hasOwnProperty('request')) {
        throw new ValidationError({
          message: `Request is not defined in context ${context}`,
        });
      }

      const productApi = new ProductApi(
        context.frontasticContext,
        getLocale(context.request),
        getCurrency(context.request),
      );
      const productQuery = ProductQueryFactory.queryFromParams(context.request, config);

      const shuffleArray = (array: any) => {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const temp = array[i];
          array[i] = array[j];
          array[j] = temp;
        }
        return array;
      };

      return await productApi.query(productQuery).then((queryResult) => {
        return {
          dataSourcePayload: {
            ...queryResult,
            items: shuffleArray(queryResult.items),
          },
        };
      });
    },

    'frontastic/empty': async (config: DataSourceConfiguration, context: DataSourceContext) => {
      return !context.isPreview
        ? { dataSourcePayload: {} }
        : {
            dataSourcePayload: {},
            previewPayload: [],
          };
    },
  },
  actions: {
    account: AccountActions,
    cart: CartActions,
    product: ProductActions,
    wishlist: WishlistActions,
    project: ProjectActions,
  },
} as ExtensionRegistry;
