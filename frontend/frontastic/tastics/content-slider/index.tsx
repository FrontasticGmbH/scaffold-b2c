'use client';

import React from 'react';
import ContentSlider from 'components/commercetools-ui/organisms/content-slider';
import { ContentSliderProps } from 'components/commercetools-ui/organisms/content-slider/types';
import { TasticProps } from '../types';

const ContentSliderTastic = ({ data }: TasticProps<ContentSliderProps>) => {
  return <ContentSlider {...data} />;
};

export default ContentSliderTastic;
