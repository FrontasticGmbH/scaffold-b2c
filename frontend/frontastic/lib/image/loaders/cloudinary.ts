import { ImageLoaderProps } from 'next/image';

function cloudinaryLoader({ src, width }: ImageLoaderProps) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME; //cloudinary cloud name
  const root = `https://res.cloudinary.com/${cloudName}/image/upload`; //base path

  const query = (src as string).split('?')[1]; //contains the query paremeters
  const queries = new URLSearchParams(query); //injected query params

  const ratio = queries.get('ratio'); //aspect asset ratio
  const gravity = queries.get('gravity'); //required gravity: faces, body, etc..
  const x = queries.get('x__coord'); //x coordinate for custom gravity
  const y = queries.get('y__coord'); //y coordinate for custom gravity

  //cloudinary transformations
  const params = ratio
    ? [
        ...['f_auto', 'c_limit', 'g_' + (gravity ?? 'auto')],
        ...(width ? ['w_' + width, 'q_' + 'auto', 'c_crop'] : []),
        ...(gravity === 'custom' ? ['x_' + x, 'y_' + y] : []),
        ...(ratio ? ['ar_' + ratio] : []),
      ]
    : [...(width ? ['w_' + width, 'q_' + 'auto', 'c_scale'] : [])];

  const transformations = params.join(',');

  //image source with the query paremeters removed
  let source = src.split('?')[0];

  //remove the backslash at the beginning if it exists
  source = source[0] === '/' ? source.slice(1) : source;

  return `${root}/${transformations}/${source}`;
}

export default cloudinaryLoader;
