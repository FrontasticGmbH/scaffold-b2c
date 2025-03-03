import React, { useMemo } from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import CloseIcon from '@heroicons/react/24/outline/XMarkIcon';
import { ImageProps } from 'components/commercetools-ui/atoms/image';
import Cart from 'components/commercetools-ui/organisms/cart-slideout';
import { Link } from 'components/commercetools-ui/organisms/header/types';
import Wishlist from 'components/commercetools-ui/organisms/wishlist';
import CartIcon from 'components/icons/cart';
import useClassNames from 'helpers/hooks/useClassNames';
import { useFormat } from 'helpers/hooks/useFormat';
import { Cart as CartShape, DiscountCode, LineItem as CartLineItem } from 'types/entity/cart';
import { LineItem as WishlistLineItem, Wishlist as WishlistShape } from 'types/entity/wishlist';

export type MenuState = 'wishlist' | 'cart';

export interface SlideOutProps {
  cart?: CartShape;
  isEmpty?: boolean;
  onApplyDiscountCode?: (code: string) => Promise<void>;
  onRemoveDiscountCode?: (discount: DiscountCode) => Promise<void>;
  totalCartItems?: number;
  totalWishlistItems?: number;
  onRemoveItem(itemId: string): Promise<void>;
  onUpdateItem(itemId: string, quantity: number): Promise<void>;
  OnMoveToWishlist(lineItem: CartLineItem): Promise<void>;
  wishlist?: WishlistShape;
  onRemoveFromWishlist?: (lineItemId: string) => Promise<void>;
  onMoveToCart?: (lineItem: WishlistLineItem) => Promise<void>;
  onClearWishlist?: () => Promise<void>;
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
  cart,
  isEmpty,
  totalCartItems = 0,
  onApplyDiscountCode,
  onRemoveDiscountCode,
  totalWishlistItems = 0,
  onRemoveItem,
  onUpdateItem,
  OnMoveToWishlist,
  wishlist,
  onRemoveFromWishlist,
  onMoveToCart,
  onClearWishlist,
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

  const title = useMemo(() => {
    switch (state) {
      case 'cart':
        return formatCartMessage({ id: 'myCart', defaultMessage: 'Cart' });
      case 'wishlist':
        return formatWishlistMessage({ id: 'my.wishlist', defaultMessage: 'Wishlist' });
    }
  }, [formatCartMessage, formatWishlistMessage, state]);

  const iconClassName = 'absolute -bottom-23 left-1/2 -translate-x-1/2 h-2 w-[130%] transition duration-200';

  const wishlistClassName = useClassNames([
    iconClassName,
    state === 'wishlist' ? 'bg-accent ease-out' : 'bg-transparent ease-in',
  ]);

  const cartClassName = useClassNames([
    iconClassName,
    state === 'cart' ? 'bg-accent ease-out' : 'bg-transparent ease-in',
  ]);

  const ActiveSection = useMemo(
    () =>
      ({
        cart: (
          <Cart
            cart={cart}
            isEmpty={isEmpty}
            onApplyDiscountCode={onApplyDiscountCode}
            onRemoveDiscountCode={onRemoveDiscountCode}
            emptyStateImage={emptyCartImage}
            emptyStateTitle={emptyCartTitle}
            emptyStateSubtitle={emptyCartSubtitle}
            emptyStateCategories={emptyCartCategories}
            handleCategoryClick={onClose}
            onRemoveItem={onRemoveItem}
            onUpdateItem={onUpdateItem}
            OnMoveToWishlist={OnMoveToWishlist}
          />
        ),
        wishlist: (
          <Wishlist
            wishlist={wishlist}
            onRemoveFromWishlist={onRemoveFromWishlist}
            onMoveToCart={onMoveToCart}
            onClearWishlist={onClearWishlist}
            emptyWishlistTitle={emptyWishlistTitle}
            emptyWishlistSubtitle={emptyWishlistSubtitle}
            emptyWishlistImage={emptyWishlistImage}
            emptyWishlistCategories={emptyWishlistCategories}
            handleCategoryClick={onClose}
          />
        ),
      })[state as MenuState] ?? <></>,
    [
      cart,
      isEmpty,
      onApplyDiscountCode,
      onRemoveDiscountCode,
      onRemoveItem,
      onUpdateItem,
      OnMoveToWishlist,
      wishlist,
      onRemoveFromWishlist,
      onMoveToCart,
      onClearWishlist,
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
            <button
              className="relative h-full cursor-pointer transition hover:opacity-80"
              onClick={() => changeState?.('wishlist')}
              aria-label={formatWishlistMessage({ id: 'wishlist', defaultMessage: 'Wishlist' })}
            >
              <div className={wishlistClassName} />
              {totalWishlistItems > 0 && (
                <span className="absolute -right-8 -top-3 size-10 rounded-full bg-green-500" />
              )}
              <HeartIcon className="w-28" stroke="#494949" />
            </button>
          )}
          {enableCartState && (
            <button
              className="relative h-full cursor-pointer transition hover:opacity-80"
              onClick={() => changeState?.('cart')}
              aria-label={formatCartMessage({ id: 'myCart', defaultMessage: 'My Cart' })}
            >
              <div className={cartClassName} />
              <div className="relative">
                <CartIcon className="w-28" totalCartItems={totalCartItems} counterClassName="-translate-y-1/4" />
              </div>
            </button>
          )}
          <button onClick={onClose} className="cursor-pointer transition hover:opacity-80" data-testid="close-icon">
            <CloseIcon className="w-28" stroke="#494949" />
          </button>
        </div>
      </div>
      {ActiveSection}
    </>
  );
};

export default Slideout;
