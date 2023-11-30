'use client';

import React from 'react';
import TilesGroup, { Props as TilesGroupProps } from 'components/commercetools-ui/organisms/content/tiles-group';
import { TasticProps } from 'frontastic/tastics/types';

export interface Props {
  data: TilesGroupProps;
}

const TilesGroupTastic = ({ data }: TasticProps<TilesGroupProps>) => {
  return <TilesGroup {...data} />;
};

export default TilesGroupTastic;
