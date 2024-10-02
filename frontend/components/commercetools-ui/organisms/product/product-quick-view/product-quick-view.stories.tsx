import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Typography from 'components/commercetools-ui/atoms/typography';
import { products, shippingMethods } from 'helpers/mocks/mockCommonData';
import { wishlist } from 'helpers/mocks/mockData';
import QuickView, { QuickViewProps } from '.';

export default {
  title: 'Organisms/Quick View',
  component: QuickView,
  argTypes: {},
} as Meta;

const Template: StoryFn<QuickViewProps> = () => {
  return (
    <div className="ml-44 pr-20">
      <Typography className="mt-40 w-2/5 text-28 font-bold text-black">Quick View Component</Typography>
      <Typography className="mt-20 w-3/5 text-20 leading-loose text-neutral-700">
        The Quick View component is used to display a quick view of a product. It is used in the product list page.
      </Typography>
      <div className="mt-44 w-200">
        <QuickView
          product={products[0]}
          wishlist={wishlist}
          shippingMethods={shippingMethods}
          buttonIsVisible
          hideButton={() => {}}
        />
      </div>
    </div>
  );
};

export const Default = Template.bind({});
