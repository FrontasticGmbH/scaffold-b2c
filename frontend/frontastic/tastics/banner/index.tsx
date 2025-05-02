'use client';

import Banner, { BannerProps } from 'components/commercetools-ui/molecules/banner';
import { TasticProps } from '../types';

const BannerTastic = ({ data }: TasticProps<BannerProps>) => {
  return <Banner {...data} />;
};

export default BannerTastic;
