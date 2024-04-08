import { URL } from 'url';
import { ValidationError } from '@Commerce-commercetools/errors/ValidationError';

export const normalizeUrl = (url: string): string => {
  try {
    // Remove trailing slash
    url = url.replace(/\/$/, '');

    // Encode URI components
    url = encodeURI(url);

    // Validate URL
    new URL(url);

    return url;
  } catch (error) {
    throw new ValidationError({ message: `Invalid URL: ${url}` });
  }
};
