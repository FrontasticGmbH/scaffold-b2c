import React from 'react';
import { Story, Meta } from '@storybook/react';
import Typography from 'components/commercetools-ui/atoms/typography';
import { products } from 'helpers/mocks/mockCommonData';
import { categories } from 'helpers/mocks/mockData';
import ProductList, { ProductListProps } from '.';

export default {
  title: 'Organisms/Product List',
  component: ProductList,
  argTypes: {},
} as Meta;

const Template: Story<ProductListProps> = () => (
  <div className="ml-44 pr-20">
    <Typography className="mt-40 w-2/5 text-28 font-bold text-black">Product List Component</Typography>
    <Typography className="mt-20 w-3/5 text-20 leading-loose text-neutral-700">
      The Product List component displays the list of products with their details and actions like adding to cart.
    </Typography>
    <div className="mt-44">
      <ProductList categories={categories} products={products} />
    </div>
  </div>
);

export const Default = Template.bind({});
