import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { shippingMethods } from 'helpers/mocks/mockCommonData';
import { lineItemsOrderHistory, moneyMock } from 'helpers/mocks/mockData';
import { logo } from 'helpers/mocks/mockHeaderData';
import { CheckoutWrapped, CheckoutWrappedProps } from '.';

export default {
  title: 'Organisms/Checkout',
  component: CheckoutWrapped,
  argTypes: {},
} as Meta;

const Template: StoryFn<CheckoutWrappedProps> = () => {
  return (
    <CheckoutWrapped
      cart={{ cartId: '', lineItems: lineItemsOrderHistory }}
      logo={logo}
      shippingMethods={shippingMethods}
      transaction={{
        total: moneyMock,
        subtotal: moneyMock,
        shipping: moneyMock,
        tax: moneyMock,
        discount: moneyMock,
      }}
    />
  );
};

export const Default = Template.bind({});

Default.args = {};
