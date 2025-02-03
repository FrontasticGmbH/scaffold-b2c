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
import { Product } from '@Types/product/Product';
import { ProductPaginatedResult } from '@Types/result';
import * as AccountActions from './actionControllers/AccountController';
import * as ProductActions from './actionControllers/ProductController';
import * as CartActions from './actionControllers/CartController';
import * as WishlistActions from './actionControllers/WishlistController';
import * as ProjectActions from './actionControllers/ProjectController';
import { getCurrency, getLocale, getPath } from './utils/Request';
import { ProductRouter } from './utils/routers/ProductRouter';
import { SearchRouter } from './utils/routers/SearchRouter';
import { CategoryRouter } from './utils/routers/CategoryRouter';
import { ProductApi } from './apis/ProductApi';
import { ProductQueryFactory } from './utils/ProductQueryFactory';
import { ValidationError } from '@Commerce-commercetools/errors/ValidationError';
import handleError from '@Commerce-commercetools/utils/handleError';

const getPreviewPayload = (queryResult: ProductPaginatedResult) => {
  return (queryResult.items as Product[]).map((product): DataSourcePreviewPayloadElement => {
    return {
      title: product.name,
      image: product?.variants[0]?.images[0],
    };
  });
};

// Master data source is only available in the context of a dynamic page
const findDynamicPageMasterDataSource = (context: DataSourceContext, dataSourceType: string) => {
  // Since the DataSourceConfiguration doesn't return the streamId, we need to access the private property directly.
  // This needs to be refactored once the dataSourceId is returned in the DataSourceConfiguration.
  return context.pageFolder.dataSourceConfigurations.find(
    (dataSource) => (dataSource as any).streamId === '__master' && dataSource.type === dataSourceType,
  );
};

export default {
  'dynamic-page-handler': async (
    request: Request,
    context: DynamicPageContext,
  ): Promise<DynamicPageSuccessResult | DynamicPageRedirectResult | null> => {
    // Identify static page
    try {
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
          return null;
        });
      }

      return null;
    } catch (error) {
      if (context.frontasticContext.environment !== 'production') {
        return {
          dynamicPageType: 'frontastic/error',
          dataSourcePayload: handleError(error, request),
        };
      }
      return null;
    }
  },
  'data-sources': {
    'frontastic/product-list': async (config: DataSourceConfiguration, context: DataSourceContext) => {
      try {
        const productApi = new ProductApi(
          context.frontasticContext,
          getLocale(context.request),
          getCurrency(context.request),
          context.request,
        );
        const productQuery = ProductQueryFactory.queryFromParams(context?.request, config);

        const queryResult = await productApi.query(productQuery);

        return !context.isPreview
          ? { dataSourcePayload: queryResult }
          : {
              dataSourcePayload: queryResult,
              previewPayload: getPreviewPayload(queryResult),
            };
      } catch (error) {
        return {
          dataSourcePayload: handleError(error, context.request),
        };
      }
    },

    'frontastic/similar-products': async (config: DataSourceConfiguration, context: DataSourceContext) => {
      try {
        if (!context.hasOwnProperty('request')) {
          throw new ValidationError({
            message: `Request is not defined in context ${context}`,
          });
        }

        const masterDataSource = findDynamicPageMasterDataSource(context, 'frontastic/product');

        if (!masterDataSource) {
          return {
            dataSourcePayload: {},
            previewPayload: [],
          };
        }

        const productApi = new ProductApi(
          context.frontasticContext,
          getLocale(context.request),
          getCurrency(context.request),
          context.request,
        );
        const productQuery = ProductQueryFactory.queryFromParams(context.request, config);

        const masterProduct = masterDataSource.preloadedValue?.product as Product;

        const masterProductCategories = masterProduct ? [masterProduct.categories?.[0]?.categoryId] : [];

        const query = {
          ...productQuery,
          categories: masterProductCategories,
        };

        const queryResult = await productApi.query(query);

        return !context.isPreview
          ? { dataSourcePayload: queryResult }
          : {
              dataSourcePayload: queryResult,
              previewPayload: getPreviewPayload(queryResult),
            };
      } catch (error) {
        return {
          dataSourcePayload: handleError(error, context.request),
        };
      }
    },

    'frontastic/product': async (config: DataSourceConfiguration, context: DataSourceContext) => {
      try {
        const productApi = new ProductApi(
          context.frontasticContext,
          getLocale(context.request),
          getCurrency(context.request),
          context.request,
        );
        const productQuery = ProductQueryFactory.queryFromParams(context?.request, config);

        const queryResult = await productApi.getProduct(productQuery);
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
      } catch (error) {
        return {
          dataSourcePayload: handleError(error, context.request),
        };
      }
    },

    'frontastic/other-products': async (config: DataSourceConfiguration, context: DataSourceContext) => {
      if (!context.hasOwnProperty('request')) {
        throw new ValidationError({
          message: `Request is not defined in context ${context}`,
        });
      }

      try {
        const productApi = new ProductApi(
          context.frontasticContext,
          getLocale(context.request),
          getCurrency(context.request),
          context.request,
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

        const queryResult = await productApi.query(productQuery);

        return {
          dataSourcePayload: {
            ...queryResult,
            items: shuffleArray(queryResult.items),
          },
        };
      } catch (error) {
        return {
          dataSourcePayload: handleError(error, context.request),
        };
      }
    },

    'frontastic/referenced-products': async (config: DataSourceConfiguration, context: DataSourceContext) => {
      try {
        if (!context.hasOwnProperty('request')) {
          throw new ValidationError({
            message: `Request is not defined in context ${context}`,
          });
        }

        const masterDataSource = findDynamicPageMasterDataSource(context, 'frontastic/product');

        const referencedProductsIdField = config?.configuration?.referencedProductsIdField;

        if (!masterDataSource || !referencedProductsIdField) {
          return {
            dataSourcePayload: {},
            previewPayload: [],
          };
        }

        const masterProduct = masterDataSource.preloadedValue?.product as Product;

        const masterProductReferencedProductIds = masterProduct.variants?.[0]?.attributes?.[referencedProductsIdField];

        context.request.query['productIds'] = masterProductReferencedProductIds || [];

        const productApi = new ProductApi(
          context.frontasticContext,
          getLocale(context.request),
          getCurrency(context.request),
          context.request,
        );

        const productQuery = ProductQueryFactory.queryFromParams(context.request, config);

        const queryResult = await productApi.query(productQuery);

        return !context.isPreview
          ? { dataSourcePayload: queryResult }
          : {
              dataSourcePayload: queryResult,
              previewPayload: getPreviewPayload(queryResult),
            };
      } catch (error) {
        return {
          dataSourcePayload: handleError(error, context.request),
        };
      }
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
