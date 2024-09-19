import { CloudinaryLoaderProps } from './types';

function cloudinaryLoader({ mediaId, width, ratio, gravity, x, y }: CloudinaryLoaderProps) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME; //cloudinary cloud name
  const root = `https://res.cloudinary.com/${cloudName}/image/upload`; //base path

  //cloudinary transformations
  const params = ratio
    ? [
        ...['f_auto', 'c_limit', 'g_' + (gravity ?? 'auto')],
        ...(width ? ['w_' + width, 'q_' + 'auto', 'c_crop'] : []),
        ...(gravity === 'custom' ? ['x_' + x, 'y_' + y] : []),
        ...['ar_' + ratio],
      ]
    : [...(width ? ['w_' + width, 'q_' + 'auto', 'c_scale'] : [])];

  const transformations = params.join(',');

  return `${root}/${transformations}/${mediaId}`;
}

export default cloudinaryLoader;
