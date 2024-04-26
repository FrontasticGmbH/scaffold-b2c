import { Request } from '@frontastic/extension-types';
import { ValidationError } from '@Commerce-commercetools/errors/ValidationError';

enum requestHeaders {
  'commercetoolsFrontendPath' = 'commercetools-frontend-path',
  'frontasticPath' = 'frontastic-path',
  'commercetoolsFrontendLocale' = 'commercetools-frontend-locale',
  'frontasticLocale' = 'frontastic-locale',
  'commercetoolsFrontendCurrency' = 'commercetools-frontend-currency',
  'frontasticCurrency' = 'frontastic-currency',
}

export const getPath = (request: Request) => {
  return (
    getHeader(request, [requestHeaders.frontasticPath, requestHeaders.commercetoolsFrontendPath]) ?? request.query.path
  );
};

export const getLocale = (request?: Request) => {
  const locale =
    getHeader(request, [requestHeaders.commercetoolsFrontendLocale, requestHeaders.frontasticLocale]) ??
    request.query.locale;

  if (locale !== undefined) {
    return locale;
  }

  throw new ValidationError({ message: `Locale is missing from request ${request}` });
};

const getHeader = (request: Request, headers: string[]): string | null => {
  for (const header of headers) {
    const foundHeader = request.headers[header.toLowerCase()];
    if (foundHeader !== undefined) {
      if (Array.isArray(foundHeader)) {
        return foundHeader[0];
      }
      return foundHeader;
    }
  }

  return null;
};
