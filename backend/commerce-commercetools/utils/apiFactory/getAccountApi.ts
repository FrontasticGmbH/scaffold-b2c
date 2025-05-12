import { Context, Request } from '@frontastic/extension-types';
import { AccountApi } from '@Commerce-commercetools/apis/AccountApi';
import { getCurrency, getLocale } from '@Commerce-commercetools/utils/Request';

const getAccountApi = (request: Request, context: Context): AccountApi => {
  return new AccountApi(context, getLocale(request), getCurrency(request), request);
};

export default getAccountApi;
