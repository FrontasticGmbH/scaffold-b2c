import { Context, Request } from '@frontastic/extension-types';
import { ProductApi } from '@Commerce-commercetools/apis/ProductApi';
import { getCurrency, getLocale } from '@Commerce-commercetools/utils/Request';

const getProductApi = (request: Request, context: Context): ProductApi => {
  return new ProductApi(context, getLocale(request), getCurrency(request), request);
};

export default getProductApi;
