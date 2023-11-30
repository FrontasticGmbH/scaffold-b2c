'use client';

import React from 'react';
import CategorySlider, { Props as CategorySliderProps } from 'components/commercetools-ui/organisms/category-slider';
import { TasticProps } from '../types';

const CategorySliderTastic = ({ data }: TasticProps<CategorySliderProps>) => {
  return <CategorySlider {...data} />;
};

export default CategorySliderTastic;
