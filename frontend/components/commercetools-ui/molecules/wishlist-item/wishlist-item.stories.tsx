import React from 'react';
import { Story, Meta } from '@storybook/react';
import Typography from 'components/commercetools-ui/atoms/typography';
import { wishlist } from 'helpers/mocks/mockData';
import WishlistItem, { WishlistItemProps } from '.';

export default {
  title: 'Molecules/Wishlist Item',
  component: WishlistItem,
  argTypes: {},
} as Meta;

const Template: Story<WishlistItemProps> = () => (
  <div className="ml-44">
    <Typography className="mt-40 w-2/5 text-28 font-bold text-black">Wishlist Item Component</Typography>
    <Typography className="mt-20 w-3/5 text-20 leading-loose text-neutral-700">
      The Wishlist Item Component displays displays wishlist item details in a horizontal card layout and can be used in
      cart page or slideout.
    </Typography>
    <div className="mt-44 border-y border-neutral-400 pr-20">
      <WishlistItem item={wishlist.lineItems[0]} />
    </div>
  </div>
);

export const Default = Template.bind({});
