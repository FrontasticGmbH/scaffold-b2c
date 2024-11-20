import { PageResponse, RedirectResponse } from '@commercetools/frontend-sdk';

export const isRedirectResponse = function (data: PageResponse | RedirectResponse): data is RedirectResponse {
  return typeof (data as RedirectResponse).target === 'string';
};
