import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Typography from 'components/commercetools-ui/atoms/typography';
import { orders } from 'helpers/mocks/mockCommonData';
import OrderSummary from './components/order-summary';
import ThankYou from './index';

export default {
  title: 'Organisms/Order Summary',
  component: ThankYou,
  argTypes: {},
} as Meta;

const Template: StoryFn = (args) => (
  <div className="ml-44">
    <Typography className="mt-40 w-2/5 text-28 font-bold text-black">Order Summary</Typography>
    <Typography className="mt-20 w-3/5 text-20 leading-loose text-neutral-700">
      The Order Summary Component displays a summary of items that the customer has added to their shopping cart or
      placed in an order. It presents a list of products displaying product name, image, quantity and price. The
      component also includes a subtotal, shipping information, a total price for the order and an interactive button
      that when clicked completes the purchase order.
    </Typography>
    <div className="mt-40 rounded-lg border bg-neutral-100 shadow-200 md:w-1/2 lg:w-[45%] xl:w-[35%]">
      <OrderSummary order={orders[0]} onPrint={() => {}} {...args} />
    </div>
  </div>
);

export const Default = Template.bind({});
