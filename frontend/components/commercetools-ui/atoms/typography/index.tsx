import React, { createElement, Fragment, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { TypographyProps } from './types';
import Skeleton from '../skeleton';

const Typography: React.FC<TypographyProps> = ({
  children,
  className = '',
  as = 'p',
  asSkeleton = false,
  ...props
}) => {
  const { locale } = useParams();

  const getContent = useCallback(() => {
    // Check if the children has different locales
    if (children !== undefined && typeof children !== 'string') {
      // Update text based on locale
      return children?.[locale as string];
    }

    return children;
  }, [locale, children]);

  // Constructing default props of the element
  const elementProps: React.HTMLAttributes<HTMLElement> & React.Attributes = {
    className: `${className} relative`,
    ...props,
  };

  const TypographyElement = createElement(
    as === 'fragment' ? Fragment : as || 'p',
    as !== 'fragment' ? elementProps : undefined,
    <>
      {asSkeleton && <Skeleton />}
      {getContent()}
    </>,
  );

  return TypographyElement;
};

export default Typography;
