import { ActionContext, Request, Response } from '@frontastic/extension-types';
import { ProductQuery } from '@Types/query/ProductQuery';
import { CategoryQuery, CategoryQueryFormat } from '@Types/query/CategoryQuery';
import { ProductApi } from '../apis/ProductApi';
import { ProductQueryFactory } from '../utils/ProductQueryFactory';
import { getCurrency, getLocale } from '../utils/Request';
import handleError from '@Commerce-commercetools/utils/handleError';

type ActionHook = (request: Request, actionContext: ActionContext) => Promise<Response>;

function getProductApi(request: Request, actionContext: ActionContext) {
  return new ProductApi(actionContext.frontasticContext, getLocale(request), getCurrency(request), request);
}

export const getProduct: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const productApi = getProductApi(request, actionContext);

    let productQuery: ProductQuery = {};

    if ('id' in request.query) {
      productQuery = {
        productIds: [request.query['id']],
      };
    }

    if ('key' in request.query) {
      productQuery = {
        productKeys: [request.query['key']],
      };
    }

    if ('ref' in request.query) {
      productQuery = {
        productRefs: [request.query['ref']],
      };
    }

    if ('sku' in request.query) {
      productQuery = {
        skus: [request.query['sku']],
      };
    }

    const product = await productApi.getProduct(productQuery);

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify(product),
      sessionData: {
        ...productApi.getSessionData(),
      },
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const query: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const productApi = getProductApi(request, actionContext);

    const productQuery = ProductQueryFactory.queryFromParams(request);

    const queryResult = await productApi.query(productQuery);

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify(queryResult),
      sessionData: {
        ...productApi.getSessionData(),
      },
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const queryCategories: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const productApi = getProductApi(request, actionContext);

    const categoryQuery: CategoryQuery = {
      limit: request.query?.limit ?? undefined,
      cursor: request.query?.cursor ?? undefined,
      slug: request.query?.slug ?? undefined,
      parentId: request.query?.parentId ?? undefined,
      format: request.query?.format ?? CategoryQueryFormat.FLAT,
    };

    const queryResult = await productApi.queryCategories(categoryQuery);

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify(queryResult),
      sessionData: {
        ...productApi.getSessionData(),
      },
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};

/*
 * Method used by Studio to dynamically retrieve product filters
 */
export const productFilters: ActionHook = async (request: Request, actionContext) => {
  try {
    const productApi = getProductApi(request, actionContext);

    const result = await productApi.getProductFilters();

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify(result),
      sessionData: {
        ...productApi.getSessionData(),
      },
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};

/*
 * Method used by Studio to dynamically retrieve category filters
 */
export const categoryFilters: ActionHook = async (request: Request, actionContext) => {
  try {
    const productApi = getProductApi(request, actionContext);

    const result = await productApi.getCategoryFilters();

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify(result),
      sessionData: {
        ...productApi.getSessionData(),
      },
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};
