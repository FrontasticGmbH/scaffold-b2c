'use client';

import React from 'react';
import Tile, { TileProps } from 'components/commercetools-ui/organisms/content/tile';
import { TasticProps } from 'frontastic/tastics/types';

const TileTastic = ({ data }: TasticProps<TileProps>) => {
  return (
    <Tile
      image={data.image}
      title={data.title}
      subtitle={data.subtitle}
      ctaLabel={data.ctaLabel}
      ctaReference={data.ctaReference}
    />
  );
};

export default TileTastic;
