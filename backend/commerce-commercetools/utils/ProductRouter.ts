import { Product } from '@Types/product/Product';
import { Context, Request } from '@frontastic/extension-types';
import { ProductQuery } from '@Types/query/ProductQuery';
import { LineItem } from '@Types/cart/LineItem';
import { LineItem as WishlistItem } from '@Types/wishlist/LineItem';
import { ProductApi } from '../apis/ProductApi';
import { getPath, getLocale, getCurrency } from './Request';

export class ProductRouter {
  private static isProduct(product: Product | LineItem | WishlistItem): product is Product {
    // Only Product has the property "slug"
    return product.hasOwnProperty('slug');
  }

  static generateUrlFor(item: Product | LineItem | WishlistItem) {
    if (ProductRouter.isProduct(item)) {
      return `/${item.slug}/p/${item.variants[0].sku}`;
    }
    return `/slug/p/${item.variant.sku}`;
  }

  static identifyFrom(request: Request) {
    if (getPath(request)?.match(/\/p\/([^\/]+)/)) {
      return true;
    }

    return false;
  }

  static loadFor = async (request: Request, frontasticContext: Context): Promise<Product> => {
    const productApi = new ProductApi(frontasticContext, getLocale(request), getCurrency(request), request);

    const urlMatches = getPath(request)?.match(/\/p\/([^\/]+)/);

    if (urlMatches) {
      const productQuery: ProductQuery = {
        skus: [urlMatches[1]],
      };
      return productApi.getProduct(productQuery);
    }

    return null;
  };
}
