import { ImageLoaderProps } from 'next/image';

function defaultLoader({ src }: ImageLoaderProps) {
  //image source with the query paremeters removed
  const [source, query] = src.split('?');

  const queries = new URLSearchParams(query); //injected query params

  const suffix = queries.get('suffix'); //image variants: small, medium, large, etc...

  //add suffix if exists
  if (suffix) {
    const lastDotIndex = src.lastIndexOf('.');

    return `${source.substring(0, lastDotIndex)}-${suffix}.${source.substring(lastDotIndex + 1)}`;
  }

  return source;
}

export default defaultLoader;
