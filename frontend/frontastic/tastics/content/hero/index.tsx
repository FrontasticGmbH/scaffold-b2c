'use client';

import React from 'react';
import Hero, { HeroProps } from 'components/commercetools-ui/organisms/content/hero';
import { TasticProps } from 'frontastic/tastics/types';

const HeroTastic = ({ data }: TasticProps<HeroProps>) => {
  return (
    <Hero
      image={data.image}
      title={data.title}
      subtitle={data.subtitle}
      ctaLabel={data.ctaLabel}
      ctaReference={data.ctaReference}
      imageQuality={data.imageQuality}
      isPriority={data.isPriority}
    />
  );
};

export default HeroTastic;
