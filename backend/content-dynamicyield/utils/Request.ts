import { Request } from '@frontastic/extension-types';
import { ContextType } from '../interfaces/ContextType';
import { ValidationError } from '@Commerce-commercetools/errors/ValidationError';

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

export const getLocale = (request?: Request): string | null => {
  const locale =
    getHeader(request, [requestHeaders.commercetoolsFrontendLocale, requestHeaders.frontasticLocale]) ??
    request.query.locale;

  if (locale !== undefined) {
    return locale;
  }

  throw new ValidationError({ message: `Locale is missing from request ${request}` });
};

export const getContext = (request: Request, pageContextType: string): ContextType => {
  const referrer: string | undefined = getHeader(request, ['referrer']);
  const userAgent: string | undefined = getHeader(request, ['userAgent']);

  const ip: string = request?.clientIp;
  const hostname: string = request?.hostname;
  const path: string = getPath(request);
  const query: string = request?.query;
  const data: string[] = [];
  const dyContext = {
    page: {
      location: `https://${hostname}${path}`,
      referrer: referrer || '',
      type: pageContextType,
      data,
    },
    device: {
      userAgent: userAgent || '',
      ip,
    },
    pageAttributes: query,
  };
  return dyContext;
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
