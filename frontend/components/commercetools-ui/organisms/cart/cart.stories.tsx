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
    emptyStateTitle="Nothing in your cart yet!"
    emptyStateDescription="Continue shopping to find exactly what you're looking for."
    emptyStateImage={{ src: '/images/empty-cart.png' }}
    emptyStateLinkText="Explore items"
    emptyStateReference={{ type: 'link', link: '#' }}
    categories={categories}
    paymentMethods={paymentMethods}
    onRemoveItem={async () => {}}
    OnMoveToWishlist={async () => {}}
    onUpdateItem={async () => {}}
  />
);

export const Default = Template.bind({});

Default.args = {};
