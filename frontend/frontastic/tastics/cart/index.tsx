'use client';

import React from 'react';
import Cart from 'components/commercetools-ui/organisms/cart';
import { CartProps } from 'components/commercetools-ui/organisms/cart/types';
import { TasticProps } from '../types';

const CartTastic = ({ data, categories }: TasticProps<CartProps>) => {
  return <Cart {...data} categories={categories} />;
};

export default CartTastic;
