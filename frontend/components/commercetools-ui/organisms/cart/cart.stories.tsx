import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { paymentMethods } from 'helpers/mocks/mockCommonData';
import { categories, lineItemsOrderHistory } from 'helpers/mocks/mockData';
import Cart from '.';
import { CartProps } from './types';

export default {
  title: 'Organisms/Cart',
  component: Cart,
  argTypes: {},
} as Meta;

const Template: StoryFn<CartProps> = () => (
  <Cart
    cart={{ cartId: '', lineItems: lineItemsOrderHistory }}
    categories={categories}
    paymentMethods={paymentMethods}
    onRemoveItem={async () => {}}
    OnMoveToWishlist={async () => {}}
    onUpdateItem={async () => {}}
  />
);

export const Default = Template.bind({});

Default.args = {};
