import React from 'react';
import Link from 'components/commercetools-ui/atoms/link';
import CartIcon from 'components/icons/cart';
import { useCart } from 'frontastic';
import Image, { FrontasticImage } from 'frontastic/lib/image';

export interface Props {
  logo: FrontasticImage;
}

const Header: React.FC<Props> = ({ logo }) => {
  const { totalItems: totalCartItems } = useCart();

  return (
    <div className="flex items-center justify-between border-b border-neutral-400 bg-white px-16 py-18 md:p-24 lg:px-48 lg:py-28">
      <Link link="/">
        <div className="relative h-36 w-208 lg:h-44 lg:w-259">
          <Image {...logo} style={{ objectFit: 'contain' }} fill />
        </div>
      </Link>
      <Link link="/cart">
        <CartIcon
          className="w-28 text-secondary-black"
          totalCartItems={totalCartItems}
          counterClassName="-translate-y-1/4"
        />
      </Link>
    </div>
  );
};

export default Header;
