import { Context, Request } from '@frontastic/extension-types';
import { CartApi } from '@Commerce-commercetools/apis/CartApi';
import { getCurrency, getLocale } from '@Commerce-commercetools/utils/Request';

const getCartApi = (request: Request, context: Context): CartApi => {
  return new CartApi(context, getLocale(request), getCurrency(request), request);
};

export default getCartApi;
