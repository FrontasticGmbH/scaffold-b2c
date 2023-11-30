import { Request } from '@frontastic/extension-types';

export const getPath = (request: Request): string | null => {
  return getHeader(request, 'frontastic-path') ?? request.query.path;
};

export const getLocale = (request: Request): string | null => {
  if (request !== undefined) {
    const locale = getHeader(request, 'frontastic-locale') ?? request.query.locale;

    if (locale !== undefined) {
      return getHeader(request, 'frontastic-locale') ?? request.query.locale;
    }
  }

  return null;
};

export const getCurrency = (request: Request): string | null => {
  if (request !== undefined) {
    const currency = getHeader(request, 'frontastic-currency') ?? request.query['currency'];

    if (currency !== undefined) {
      return getHeader(request, 'frontastic-currency') ?? request.query['currency'];
    }
  }

  return null;
};

export const getCountry = (locale: string) => {
  return { de_DE: 'DE', en_US: 'US', 'de_DE@EUR': 'DE', 'en_US@USD': 'US' }[locale];
};

const getHeader = (request: Request, header: string): string | null => {
  if (header in request.headers) {
    const foundHeader = request.headers[header];
    if (Array.isArray(foundHeader)) {
      return foundHeader[0];
    }
    return foundHeader;
  }

  return null;
};
