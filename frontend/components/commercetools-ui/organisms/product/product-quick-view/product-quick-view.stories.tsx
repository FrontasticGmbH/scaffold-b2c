import React from 'react';
import { Story, Meta } from '@storybook/react';
import Typography from 'components/commercetools-ui/atoms/typography';
import { products } from 'helpers/mocks/mockCommonData';
import QuickView, { QuickViewProps } from '.';

export default {
  title: 'Organisms/Quick View',
  component: QuickView,
  argTypes: {},
} as Meta;

const Template: Story<QuickViewProps> = () => {
  return (
    <div className="ml-44 pr-20">
      <Typography className="mt-40 w-2/5 text-28 font-bold text-black">Quick View Component</Typography>
      <Typography className="mt-20 w-3/5 text-20 leading-loose text-neutral-700">
        The Quick View component is used to display a quick view of a product. It is used in the product list page.
      </Typography>
      <div className="mt-44 w-200">
        <QuickView product={products[0]} buttonIsVisible hideButton={() => {}} />
      </div>
    </div>
  );
};

export const Default = Template.bind({});
