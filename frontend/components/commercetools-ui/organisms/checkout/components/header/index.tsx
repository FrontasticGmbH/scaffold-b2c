import React, { useState } from 'react';
import Drawer from 'components/commercetools-ui/atoms/drawer';
import Link from 'components/commercetools-ui/atoms/link';
import { EmptyStateProps } from 'components/commercetools-ui/organisms/header/types';
import Slideout from 'components/commercetools-ui/organisms/header/utility-section/components/slide-out';
import CartIcon from 'components/icons/cart';
import { useCart } from 'frontastic';
import Image, { FrontasticImage } from 'frontastic/lib/image';

export interface Props extends EmptyStateProps {
  logo: FrontasticImage;
}

const Header: React.FC<Props> = ({ logo, ...emptyState }) => {
  const { totalItems: totalCartItems } = useCart();

  const [isCartSlideoutOpen, setIsCartSlideoutOpen] = useState(false);

  return (
    <div className="flex items-center justify-between border-b border-neutral-400 bg-white px-16 py-18 md:p-24 lg:px-48 lg:py-28">
      <Link link="/">
        <div className="relative h-[36px] w-[208px] lg:h-[44px] lg:w-[259px]">
          <Image {...logo} style={{ objectFit: 'contain' }} fill />
        </div>
      </Link>
      <div onClick={() => setIsCartSlideoutOpen(true)} className="cursor-pointer">
        <CartIcon
          className="w-28 text-secondary-black"
          totalCartItems={totalCartItems}
          counterClassName="-translate-y-1/4"
        />
      </div>
      <Drawer
        isOpen={isCartSlideoutOpen}
        direction="right"
        className="w-[90%] max-w-[380px] bg-white"
        onClose={() => setIsCartSlideoutOpen(false)}
      >
        <Slideout
          state="cart"
          onClose={() => setIsCartSlideoutOpen(false)}
          enableWishlistState={false}
          {...emptyState}
        />
      </Drawer>
    </div>
  );
};

export default Header;
