import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { orders, shippingMethods } from 'helpers/mocks/mockCommonData';
import { account } from 'helpers/mocks/mockData';
import Account, { AccountDetailsProps } from '.';

export default {
  title: 'Pages/Account',
  component: Account,
  argTypes: {},
  parameters: {
    account: account,
  },
} as Meta;

const commonData: Omit<AccountDetailsProps, 'hash' | 'id'> = {
  phoneNumber: '123456789',
  workingHoursWeekdays: '8:00 - 16:00',
  workingHoursWeekends: '8:00 - 12:00',
  email: 'user@example.com',
  addressLine: 'Example Street 123',
  cityAndPostalCode: '12345 Example City',
  country: 'Example Country',
  orders: [...orders, ...orders],
  shippingMethods: shippingMethods,
  faqs: [],
};

const Template: StoryFn<AccountDetailsProps> = (args) => {
  return <Account {...args} />;
};

export const AccountDetails = Template.bind({});
AccountDetails.args = {
  ...commonData,
  hash: '',
};

export const Orders = Template.bind({});
Orders.args = {
  ...commonData,
  hash: 'orders',
};

export const OrderSummary = Template.bind({});
OrderSummary.args = {
  ...commonData,
  hash: 'orders',
  id: `order_${orders[0].orderId}`,
};

export const CustomerSupport = Template.bind({});
CustomerSupport.args = {
  ...commonData,
  hash: 'support',
};
