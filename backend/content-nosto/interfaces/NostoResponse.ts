import { Recommendations } from './Recommendations';

export interface NostoResponse {
  data: {
    updateSession: {
      pages: {
        [key in NostoPageTypes]: Recommendations[];
      };
    };
  };
}
export enum NostoPageTypes {
  SEARCH = 'forSearchPage',
  FRONT = 'forFrontPage',
  CATEGORY = 'forCategoryPage',
  CART = 'forCartPage',
  PRODUCT = 'forProductPage',
}
