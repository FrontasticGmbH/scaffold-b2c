import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { linkReferenceOne } from 'helpers/mocks/mockCommonData';
import { links, logo, tiles } from 'helpers/mocks/mockHeaderData';
import Header from './index';
import { HeaderProps } from './types';

export default {
  title: 'Organisms/Header',
  component: Header,
  argTypes: {},
} as Meta;

const Template: StoryFn<HeaderProps> = () => (
  <div className="ml-44">
    <p className="mt-40 w-2/5 text-28 font-bold text-black">Page Header</p>
    <p className="mt-20 w-3/5 text-20 leading-loose text-black">
      The Page Header provides customers with a clear overview of the page&apos;s content. It includes a logo, search
      bar, page navigation and links for actions like account, wishlist and fly-out cart.
    </p>
    <div className="mt-40 pr-40">
      <Header
        onRemoveItem={async () => {}}
        onUpdateItem={async () => {}}
        OnMoveToWishlist={async () => {}}
        navLinks={links}
        logo={logo}
        categories={links}
        logoMobile={logo}
        logoLink={linkReferenceOne}
        logoLinkMobile={linkReferenceOne}
        emptyCartTitle={''}
        emptyCartSubtitle={''}
        emptyCartImage={logo}
        emptyCartCategories={[]}
        emptyWishlistTitle={''}
        emptyWishlistSubtitle={''}
        emptyWishlistImage={logo}
        emptyWishlistCategories={[]}
        tiles={tiles}
        searchItems={[]}
      />
    </div>
  </div>
);

export const Default = Template.bind({});
