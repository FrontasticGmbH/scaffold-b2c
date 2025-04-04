import { Context, Request } from '@frontastic/extension-types';
import { CategoryQuery } from '@Types/query/CategoryQuery';
import { Category } from '@Types/product/Category';
import { ProductPaginatedResult } from '@Types/result';
import { ProductApi } from '../../apis/ProductApi';
import { getCurrency, getLocale, getPath } from '../Request';
import { ProductQueryFactory } from '../ProductQueryFactory';

export class CategoryRouter {
  static identifyFrom(request: Request) {
    if (getPath(request)?.match(/[^/]+(?=\/$|$)/)) {
      return true;
    }

    return false;
  }

  static loadFor = async (request: Request, commercetoolsFrontendContext: Context): Promise<Category> => {
    const productApi = new ProductApi(commercetoolsFrontendContext, getLocale(request), getCurrency(request), request);

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

      return categoryQueryResult.items[0];
    }

    return null;
  };

  static loadProductsFor = async (
    request: Request,
    commercetoolsFrontendContext: Context,
    category: Category,
  ): Promise<ProductPaginatedResult> => {
    const productApi = new ProductApi(commercetoolsFrontendContext, getLocale(request), getCurrency(request), request);

    request.query.categories = [category.categoryRef];

    const productQuery = ProductQueryFactory.queryFromParams({
      ...request,
    });

    return await productApi.query(productQuery);
  };
}
