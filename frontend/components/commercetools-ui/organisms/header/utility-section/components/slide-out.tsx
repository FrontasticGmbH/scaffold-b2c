import React, { useMemo } from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import CloseIcon from '@heroicons/react/24/outline/XMarkIcon';
import Cart from 'components/commercetools-ui/organisms/cart-slideout';
import { Link } from 'components/commercetools-ui/organisms/header/types';
import Wishlist from 'components/commercetools-ui/organisms/wishlist';
import CartIcon from 'components/icons/cart';
import useClassNames from 'helpers/hooks/useClassNames';
import { useFormat } from 'helpers/hooks/useFormat';
import { useCart, useWishlist } from 'frontastic';
import { ImageProps } from 'frontastic/lib/image';

export type MenuState = 'wishlist' | 'cart';

export interface SlideOutProps {
  state?: MenuState;
  changeState?: (newState?: MenuState) => void;
  onClose?: () => void;
  emptyCartTitle: string;
  emptyCartSubtitle: string;
  emptyCartImage: ImageProps;
  emptyCartCategories: Link[];
  emptyWishlistTitle: string;
  emptyWishlistSubtitle: string;
  emptyWishlistImage: ImageProps;
  emptyWishlistCategories: Link[];
  enableCartState?: boolean;
  enableWishlistState?: boolean;
}

const Slideout: React.FC<SlideOutProps> = ({
  state,
  changeState,
  onClose,
  emptyCartTitle,
  emptyCartSubtitle,
  emptyCartImage,
  emptyCartCategories,
  emptyWishlistTitle,
  emptyWishlistSubtitle,
  emptyWishlistImage,
  emptyWishlistCategories,
  enableCartState = true,
  enableWishlistState = true,
}) => {
  const { formatMessage: formatCartMessage } = useFormat({ name: 'cart' });
  const { formatMessage: formatWishlistMessage } = useFormat({ name: 'wishlist' });

  const { totalItems: totalCartItems } = useCart();

  const { totalItems: totalWishlistItems } = useWishlist();

  const title = useMemo(() => {
    switch (state) {
      case 'cart':
        return formatCartMessage({ id: 'myCart', defaultMessage: 'My Cart' });
      case 'wishlist':
        return formatWishlistMessage({ id: 'my.wishlist', defaultMessage: 'My Wishlist' });
    }
  }, [formatCartMessage, formatWishlistMessage, state]);

  const iconClassName = 'absolute -bottom-23 left-1/2 -translate-x-1/2 h-2 w-[130%] transition duration-200';

  const wishlistClassName = useClassNames([
    iconClassName,
    state === 'wishlist' ? 'bg-secondary-grey ease-out' : 'bg-transparent ease-in',
  ]);

  const cartClassName = useClassNames([
    iconClassName,
    state === 'cart' ? 'bg-secondary-grey ease-out' : 'bg-transparent ease-in',
  ]);

  const ActiveSection = useMemo(
    () =>
      ({
        cart: (
          <Cart
            emptyStateImage={emptyCartImage}
            emptyStateTitle={emptyCartTitle}
            emptyStateSubtitle={emptyCartSubtitle}
            emptyStateCategories={emptyCartCategories}
            handleCategoryClick={onClose}
          />
        ),
        wishlist: (
          <Wishlist
            emptyWishlistTitle={emptyWishlistTitle}
            emptyWishlistSubtitle={emptyWishlistSubtitle}
            emptyWishlistImage={emptyWishlistImage}
            emptyWishlistCategories={emptyWishlistCategories}
            handleCategoryClick={onClose}
          />
        ),
      }[state as MenuState] ?? <></>),
    [
      emptyCartCategories,
      emptyCartImage,
      emptyCartSubtitle,
      emptyCartTitle,
      emptyWishlistCategories,
      emptyWishlistImage,
      emptyWishlistSubtitle,
      emptyWishlistTitle,
      onClose,
      state,
    ],
  );

  return (
    <>
      <div className="flex items-center justify-between border-b border-neutral-400 py-24 pb-22 pl-12 pr-8 md:pl-22 md:pr-18">
        <h3 className="text-18 font-medium leading-normal md:text-20">{title}</h3>
        <div className="flex h-full items-center gap-24">
          {enableWishlistState && (
            <div
              className="relative h-full cursor-pointer transition hover:opacity-80"
              onClick={() => changeState?.('wishlist')}
            >
              <div className={wishlistClassName} />
              {totalWishlistItems > 0 && (
                <span className="absolute right-[-8px] top-[-3px] h-10 w-10 rounded-full bg-green-500" />
              )}
              <HeartIcon className="w-28" stroke="#494949" />
            </div>
          )}
          {enableCartState && (
            <div
              className="relative h-full cursor-pointer transition hover:opacity-80"
              onClick={() => changeState?.('cart')}
            >
              <>
                <div className={cartClassName} />
                <div className="relative">
                  <CartIcon className="w-28" totalCartItems={totalCartItems} counterClassName="-translate-y-1/4" />
                </div>
              </>
            </div>
          )}
          <div onClick={onClose} className="cursor-pointer transition hover:opacity-80">
            <CloseIcon className="w-28" stroke="#494949" />
          </div>
        </div>
      </div>
      {ActiveSection}
    </>
  );
};

export default Slideout;
