'use client';

import React from 'react';
import NextImage from 'next/image';
import { useResolvedLocalizedObject } from 'helpers/hooks/useResolvedLocalizedObject';
import useDimensions from './hooks/useDimensions';
import useParameterizedSrc from './hooks/useParameterizedSrc';
import cloudinaryLoader from './loaders/cloudinary';
import defaultLoader from './loaders/default';
import { ImageProps } from './types';

const Image = ({ media, ratio, gravity, suffix, src, width, height, alt = '', title, ...props }: ImageProps) => {
  const parameterizedSrc = useParameterizedSrc({ ratio, gravity, suffix, media, src });

  const dimensions = useDimensions({ media, width, height, ...props });

  const resovledTitle = useResolvedLocalizedObject(title ?? '');

  const resolvedAlt = useResolvedLocalizedObject(alt ?? '');

  if (!media?.mediaId)
    return (
      <NextImage
        src={parameterizedSrc}
        loader={defaultLoader}
        alt={resolvedAlt}
        title={resovledTitle}
        {...dimensions}
        {...props}
      />
    );

  return (
    <NextImage
      src={parameterizedSrc}
      loader={cloudinaryLoader}
      alt={resolvedAlt}
      title={resovledTitle}
      {...dimensions}
      {...props}
    />
  );
};

export default Image;

export * from './types';
