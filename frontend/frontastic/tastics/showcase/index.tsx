'use client';

import React from 'react';
import Showcase, { Props as ShowcaseProps } from 'components/commercetools-ui/organisms/showcase';
import { TasticProps } from '../types';

const ShowcaseTastic = ({ data }: TasticProps<ShowcaseProps>) => {
  return <Showcase {...data} />;
};

export default ShowcaseTastic;
