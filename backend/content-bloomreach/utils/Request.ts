import { Request } from '@frontastic/extension-types';

export const getPath = (request: Request) => {
  return getHeader(request, 'frontastic-path') ?? request.query.path;
};

export const getLocale = (request?: Request) => {
  if (request !== undefined) {
    const locale = getHeader(request, 'frontastic-locale') ?? request.query.locale;

    if (locale !== undefined) {
      return getHeader(request, 'frontastic-locale') ?? request.query.locale;
    }
  }

  return null;
};

const getHeader = (request: Request, header: string) => {
  if (request.headers && header in request.headers) {
    const foundHeader = request.headers[header];
    if (Array.isArray(foundHeader)) {
      return foundHeader[0];
    }
    return foundHeader;
  }

  return null;
};
