import { Context, Request } from '@frontastic/extension-types';
import { getCurrency, getLocale } from '@Commerce-commercetools/utils/Request';
import { WishlistApi } from '@Commerce-commercetools/apis/WishlistApi';

const getWishlistApi = (request: Request, context: Context): WishlistApi => {
  return new WishlistApi(context, getLocale(request), getCurrency(request), request);
};

export default getWishlistApi;
