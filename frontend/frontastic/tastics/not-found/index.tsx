'use client';

import React from 'react';
import NotFound from 'components/commercetools-ui/organisms/not-found';
import { TasticProps } from '../types';
import { ImageProps } from 'components/commercetools-ui/atoms/image';

const NotFoundTastic = ({ data }: TasticProps<{ image: ImageProps }>) => {
  return <NotFound image={data.image} />;
};

export default NotFoundTastic;
