import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { products, shippingMethods } from 'helpers/mocks/mockCommonData';
import { categories, wishlist } from 'helpers/mocks/mockData';
import ProductList, { ProductListProps } from '.';
import ProductListProvider from './context';

export default {
  title: 'Organisms/Product List',
  component: ProductList,
  argTypes: {},
  decorators: [
    (Story) => (
      <ProductListProvider
        uiState={{ totalItems: products.length }}
        facetsConfiguration={{}}
        pricesConfiguration={{}}
        categories={categories}
        shippingMethods={shippingMethods}
        wishlist={wishlist}
      >
        <Story />
      </ProductListProvider>
    ),
  ],
} as Meta;

const Template: StoryFn<ProductListProps> = () => (
  <div className="ml-44 pr-20">
    <p className="mt-40 w-2/5 text-28 font-bold text-black">Product List Component</p>
    <p className="mt-20 w-3/5 text-20 leading-loose text-neutral-700">
      The Product List component displays the list of products with their details and actions like adding to cart.
    </p>
    <div className="mt-44">
      <ProductList products={products} />
    </div>
  </div>
);

export const Default = Template.bind({});
