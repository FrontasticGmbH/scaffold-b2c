import { ImageProps } from '../../types';

const useParameterizedSrc = ({ ratio, gravity, suffix, media, src }: Partial<ImageProps>) => {
  const parameters = new URLSearchParams();

  if (ratio) parameters.set('ratio', ratio);

  if (gravity?.mode) parameters.set('gravity', gravity.mode);

  if (gravity?.coordinates?.x) parameters.set('x__coord', gravity.coordinates.x.toString());

  if (gravity?.coordinates?.y) parameters.set('y__coord', gravity.coordinates.y.toString());

  if (suffix) parameters.set('suffix', suffix);

  const parameterizedSrc = `${media?.mediaId ?? src}?${parameters.toString()}`;

  return parameterizedSrc;
};

export default useParameterizedSrc;
