'use client';

import React from 'react';
import Spacer, { Props as SpacerProps } from 'components/commercetools-ui/organisms/spacer';
import { TasticProps } from '../types';

const SpacerTastic = ({ data }: TasticProps<SpacerProps>) => {
  return <Spacer {...data} />;
};

export default SpacerTastic;
