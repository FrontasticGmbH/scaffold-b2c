import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { products, shippingMethods } from 'helpers/mocks/mockCommonData';
import { wishlist } from 'helpers/mocks/mockData';
import ProductTile, { ProductTileProps } from '.';

export default {
  title: 'Molecules/Product Tile',
  component: ProductTile,
  argTypes: {},
} as Meta;

const Template: StoryFn<ProductTileProps> = () => (
  <div className="ml-44">
    <p className="mt-40 w-2/5 text-28 font-bold text-black">Tile Component</p>
    <p className="mt-20 w-3/5 text-20 leading-loose text-neutral-700">
      The Product Tile component displays product details in a card layout and can be used in product sliders and grids.
    </p>
    <div className="mt-44 w-330 border-x border-neutral-400 px-20">
      <ProductTile product={products[0]} wishlist={wishlist} shippingMethods={shippingMethods} />
    </div>
  </div>
);

export const Default = Template.bind({});
