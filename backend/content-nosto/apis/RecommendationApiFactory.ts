import { Context } from '@frontastic/extension-types';
import { ValidationError } from '../utils/Errors';
import ProductPageRecommendationApi from './ProductPageRecommendationApi';
import CategoryPageRecommendationApi from './CategoryPageRecommendationApi';
import SearchPageRecommendationApi from './SearchPageRecommendationApi';
import CartPageRecommendationApi from './CartPageRecommendationApi';
import FrontPageRecommendationApi from './FrontPageRecommendationApi';
import BaseApi from './BaseApi';

export default class RecommendationApiFactory {
  public static getInstance(frontasticContext: Context, nostoSessionId: string, pageType: string): BaseApi {
    switch (pageType) {
      case 'PRODUCT':
        return new ProductPageRecommendationApi(frontasticContext, nostoSessionId);
      case 'CATEGORY':
        return new CategoryPageRecommendationApi(frontasticContext, nostoSessionId);
      case 'SEARCH':
        return new SearchPageRecommendationApi(frontasticContext, nostoSessionId);
      case 'CART':
        return new CartPageRecommendationApi(frontasticContext, nostoSessionId);
      case 'FRONT':
        return new FrontPageRecommendationApi(frontasticContext, nostoSessionId);
      default:
        throw new ValidationError({
          message: `pageType is not valid. ${pageType} is not included within [PRODUCT, CATEGORY, SEARCH, CART, FRONT]`,
        });
    }
  }
}
