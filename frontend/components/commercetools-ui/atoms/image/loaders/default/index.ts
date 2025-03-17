import { DefaultLoaderProps } from './types';

/**
 * Processes an image source URL, optionally adding a suffix before the extension.
 */
function defaultLoader({ src, suffix }: DefaultLoaderProps) {
  // If src is empty or invalid, just return it as is
  if (!src || typeof src !== 'string') {
    return src;
  }

  // If no suffix needed, return src as is
  if (!suffix) {
    return src;
  }

  // If src doesn't contain a dot (for file extension), return it as is
  const lastDotIndex = src.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return src;
  }

  // Add suffix before extension
  return `${src.substring(0, lastDotIndex)}-${suffix}.${src.substring(lastDotIndex + 1)}`;
}

export default defaultLoader;
