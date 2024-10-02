import { ImageProps } from '../../types';

const useDimensions = ({ media, width: baseWidth, height: baseHeight, fill }: Partial<ImageProps>) => {
  const width = baseWidth ?? +(media?.width ?? 0);
  const height = baseHeight ?? +(media?.height ?? 0);

  if (fill) return {};

  return { width, height };
};

export default useDimensions;
