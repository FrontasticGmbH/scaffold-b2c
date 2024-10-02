'use client';

import React from 'react';
import NextImage from 'next/image';
import { useResolvedLocalizedObject } from 'helpers/hooks/useResolvedLocalizedObject';
import useDimensions from './hooks/useDimensions';
import cloudinaryLoader from './loaders/cloudinary';
import defaultLoader from './loaders/default';
import { ImageProps } from './types';

const Image = ({ media, ratio, gravity, suffix, src = '', width, height, alt = '', title, ...props }: ImageProps) => {
  const dimensions = useDimensions({ media, width, height, ...props });

  const resovledTitle = useResolvedLocalizedObject(title ?? '');

  const resolvedAlt = useResolvedLocalizedObject(alt ?? '');

  const isStaticImage = src.startsWith('/');

  if (!media?.mediaId)
    return (
      <NextImage
        unoptimized={!isStaticImage}
        src={defaultLoader({ src, suffix })}
        loader={({ src }) => src}
        alt={resolvedAlt}
        title={resovledTitle}
        {...dimensions}
        {...props}
      />
    );

  return (
    <NextImage
      src={media.mediaId}
      loader={({ src: mediaId, width }) =>
        cloudinaryLoader({
          mediaId,
          width,
          ratio,
          gravity: gravity?.mode,
          x: gravity?.coordinates?.x?.toString(),
          y: gravity?.coordinates?.y?.toString(),
        })
      }
      alt={resolvedAlt}
      title={resovledTitle}
      {...dimensions}
      {...props}
    />
  );
};

export default Image;

export * from './types';
