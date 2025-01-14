'use client';

import React from 'react';
import { CheckoutWrappedProps } from 'components/commercetools-ui/organisms/checkout';
import CommercetoolsCheckout from 'components/commercetools-ui/organisms/checkout/ct-checkout';
import { TasticProps } from '../types';

const CheckoutTastic = ({ data }: TasticProps<Pick<CheckoutWrappedProps, 'logo'>>) => {
  //CT-Checkout
  return <CommercetoolsCheckout logo={data.logo} />;
};

export default CheckoutTastic;
