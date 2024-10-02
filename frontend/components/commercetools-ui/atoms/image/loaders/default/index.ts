import { DefaultLoaderProps } from './types';

function defaultLoader({ src, suffix }: DefaultLoaderProps) {
  let source = src;

  //add suffix if exists
  if (suffix) {
    const lastDotIndex = src.lastIndexOf('.');

    source = `${source.substring(0, lastDotIndex)}-${suffix}.${source.substring(lastDotIndex + 1)}`;
  }

  return source;
}

export default defaultLoader;
