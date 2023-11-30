import { Context, Request } from '@frontastic/extension-types';
import { ProductApi } from '../apis/ProductApi';
import { CategoryQuery } from '@Types/query/CategoryQuery';
import { Category } from '@Types/product/Category';
import { getCurrency, getLocale, getPath } from './Request';
import { ProductQueryFactory } from './ProductQueryFactory';
import { ProductPaginatedResult } from '@Types/result';

export class CategoryRouter {
  static identifyFrom(request: Request) {
    if (getPath(request)?.match(/[^/]+(?=\/$|$)/)) {
      return true;
    }

    return false;
  }

  static loadFor = async (request: Request, frontasticContext: Context): Promise<ProductPaginatedResult> => {
    const productApi = new ProductApi(frontasticContext, getLocale(request), getCurrency(request));

    // We are using the last subdirectory of the path to identify the category slug
    const urlMatches = getPath(request)?.match(/[^/]+(?=\/$|$)/);

    if (urlMatches) {
      const categoryQuery: CategoryQuery = {
        slug: urlMatches[0],
      };

      const categoryQueryResult = await productApi.queryCategories(categoryQuery);

      if (categoryQueryResult.items.length == 0) {
        return null;
      }

      request.query.categories = [(categoryQueryResult.items[0] as Category).categoryId];

      const productQuery = ProductQueryFactory.queryFromParams({
        ...request,
      });

      return await productApi.query(productQuery);
    }

    return null;
  };
}
