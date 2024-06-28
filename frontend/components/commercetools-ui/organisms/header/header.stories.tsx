import React from 'react';
import { Story, Meta } from '@storybook/react';
import Typography from 'components/commercetools-ui/atoms/typography';
import { linkReferenceOne } from 'helpers/mocks/mockCommonData';
import { logo, links, tiles } from 'helpers/mocks/mockHeaderData';
import Header from './index';
import { HeaderProps } from './types';

export default {
  title: 'Organisms/Header',
  component: Header,
  argTypes: {},
} as Meta;

const Template: Story<HeaderProps> = () => (
  <div className="ml-44">
    <Typography className="mt-40 w-[40%] text-28 font-bold text-black">Page Header</Typography>
    <Typography className="mt-20 w-[60%] text-20 leading-loose text-black">
      The Page Header provides customers with a clear overview of the page&apos;s content. It includes a logo, search
      bar, page navigation and links for actions like account, wishlist and fly-out cart.
    </Typography>
    <div className="mt-40 pr-40">
      <Header
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
      />
    </div>
  </div>
);

export const Default = Template.bind({});
