import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { wishlist } from 'helpers/mocks/mockData';
import WishlistItem, { WishlistItemProps } from '.';

export default {
  title: 'Molecules/Wishlist Item',
  component: WishlistItem,
  argTypes: {},
} as Meta;

const Template: StoryFn<WishlistItemProps> = () => (
  <div className="ml-44">
    <p className="mt-40 w-2/5 text-28 font-bold text-black">Wishlist Item Component</p>
    <p className="mt-20 w-3/5 text-20 leading-loose text-neutral-700">
      The Wishlist Item Component displays displays wishlist item details in a horizontal card layout and can be used in
      cart page or slideout.
    </p>
    <div className="mt-44 border-y border-neutral-400 pr-20">
      <WishlistItem item={wishlist.lineItems[0]} onRemove={async () => {}} onMoveToCart={async () => {}} />
    </div>
  </div>
);

export const Default = Template.bind({});
