import { Request } from '@frontastic/extension-types';
import { ValidationError } from '@Commerce-commercetools/errors/ValidationError';
import parseQueryParams from '@Commerce-commercetools/utils/parseRequestParams';

enum requestHeaders {
  'commercetoolsFrontendPath' = 'commercetools-frontend-path',
  'frontasticPath' = 'frontastic-path',
  'commercetoolsFrontendLocale' = 'commercetools-frontend-locale',
  'frontasticLocale' = 'frontastic-locale',
  'commercetoolsFrontendCurrency' = 'commercetools-frontend-currency',
  'frontasticCurrency' = 'frontastic-currency',
}

export const getPath = (request: Request): string | null => {
  return (
    getHeader(request, [requestHeaders.frontasticPath, requestHeaders.commercetoolsFrontendPath]) ?? request.query.path
  );
};

export const getLocale = (request: Request): string | null => {
  const locale =
    getHeader(request, [requestHeaders.commercetoolsFrontendLocale, requestHeaders.frontasticLocale]) ??
    request.query.locale;

  if (locale !== undefined) {
    return locale;
  }

  throw new ValidationError({ message: `Locale is missing from request ${request}` });
};

export const getCurrency = (request: Request): string | null => {
  if (request !== undefined) {
    const currency =
      getHeader(request, [requestHeaders.commercetoolsFrontendCurrency, requestHeaders.frontasticCurrency]) ??
      request.query['currency'];

    if (currency !== undefined) {
      return currency;
    }
  }

  return null;
};

export const getCountry = (locale: string) => {
  return { de_DE: 'DE', en_US: 'US', 'de_DE@EUR': 'DE', 'en_US@USD': 'US' }[locale];
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

export const getProductSelectionId = (request: Request): string | null => {
  if (request !== undefined) {
    const { productSelectionId } = parseQueryParams<{
      productSelectionId: string;
    }>(request.query);

    return productSelectionId ?? request.sessionData?.productSelectionId;
  }

  return null;
};

export const getAccountGroupIds = (request: Request): string[] | null => {
  if (request !== undefined) {
    const { accountGroupIds } = parseQueryParams<{
      accountGroupIds: string[];
    }>(request.query);
    return accountGroupIds ?? request.sessionData?.accountGroupIds;
  }

  return null;
};
