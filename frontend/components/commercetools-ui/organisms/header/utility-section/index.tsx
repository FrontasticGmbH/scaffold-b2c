import React, { useState } from 'react';
import Drawer from 'components/commercetools-ui/atoms/drawer';
import { ImageProps } from 'components/commercetools-ui/atoms/image';
import { Link } from 'components/commercetools-ui/organisms/header/types';
import Slideout, { MenuState } from 'components/commercetools-ui/organisms/header/utility-section/components/slide-out';
import CartIcon from 'components/icons/cart';
import WishlistIcon from 'components/icons/wishlist';
import { useFormat } from 'helpers/hooks/useFormat';
import { Cart, DiscountCode, LineItem as CartLineItem } from 'types/entity/cart';
import { LineItem as WishlistLineItem, Wishlist } from 'types/entity/wishlist';
import AccountButton from './components/account-button';

export interface Props {
  cart?: Cart;
  isEmpty?: boolean;
  onApplyDiscountCode?: (code: string) => Promise<void>;
  onRemoveDiscountCode?: (discount: DiscountCode) => Promise<void>;
  totalCartItems?: number;
  totalWishlistItems?: number;
  onRemoveItem(itemId: string): Promise<void>;
  onUpdateItem(itemId: string, quantity: number): Promise<void>;
  OnMoveToWishlist(lineItem: CartLineItem): Promise<void>;
  wishlist?: Wishlist;
  onRemoveFromWishlist?: (lineItemId: string) => Promise<void>;
  onMoveToCart?: (lineItem: WishlistLineItem) => Promise<void>;
  onClearWishlist?: () => Promise<void>;
  emptyCartTitle: string;
  emptyCartSubtitle: string;
  emptyCartImage: ImageProps;
  emptyCartCategories: Link[];
  emptyWishlistTitle: string;
  emptyWishlistSubtitle: string;
  emptyWishlistImage: ImageProps;
  emptyWishlistCategories: Link[];
}

const UtilitySection: React.FC<Props> = ({
  cart,
  isEmpty,
  onApplyDiscountCode,
  onRemoveDiscountCode,
  onRemoveItem,
  onUpdateItem,
  OnMoveToWishlist,
  totalCartItems = 0,
  totalWishlistItems = 0,
  wishlist,
  onRemoveFromWishlist,
  onMoveToCart,
  onClearWishlist,
  emptyCartTitle,
  emptyCartSubtitle,
  emptyCartImage,
  emptyCartCategories,
  emptyWishlistTitle,
  emptyWishlistSubtitle,
  emptyWishlistImage,
  emptyWishlistCategories,
}) => {
  const { formatMessage: formatCartMessage } = useFormat({ name: 'cart' });
  const { formatMessage: formatWishlistMessage } = useFormat({ name: 'wishlist' });

  const [menuState, setMenuState] = useState<MenuState>();
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const onWishlistClicked = () => {
    setIsDrawerOpen(true);
    setMenuState('wishlist');
  };

  const onCartClicked = () => {
    setIsDrawerOpen(true);
    setMenuState('cart');
  };

  return (
    <div className="mt-12 flex h-40 items-center">
      <div className="flex justify-between gap-x-8 lg:gap-x-16">
        <AccountButton />

        <div className="h-40 w-fit">
          <button
            aria-label={formatWishlistMessage({ id: 'myWishlist', defaultMessage: 'My wishlist' })}
            className="relative h-fit cursor-pointer border-secondary-black pb-8 hover:border-b-2"
            onClick={onWishlistClicked}
          >
            <WishlistIcon totalWishlistItems={totalWishlistItems} className="w-28 text-secondary-black" />
          </button>
        </div>

        <div className="h-40 w-fit">
          <button
            aria-label={formatCartMessage({ id: 'myCart', defaultMessage: 'My Cart' })}
            className="h-fit cursor-pointer border-secondary-black pb-8 hover:border-b-2"
            onClick={onCartClicked}
          >
            <CartIcon
              className="w-28 text-secondary-black"
              totalCartItems={totalCartItems}
              counterClassName="-translate-y-1/4"
            />
          </button>
        </div>
      </div>

      <Drawer
        isOpen={isDrawerOpen}
        direction="right"
        className="w-[90%] max-w-380 bg-white"
        onClose={() => setIsDrawerOpen(false)}
      >
        <Slideout
          cart={cart}
          isEmpty={isEmpty}
          onApplyDiscountCode={onApplyDiscountCode}
          onRemoveDiscountCode={onRemoveDiscountCode}
          onRemoveItem={onRemoveItem}
          onUpdateItem={onUpdateItem}
          OnMoveToWishlist={OnMoveToWishlist}
          wishlist={wishlist}
          onRemoveFromWishlist={onRemoveFromWishlist}
          onMoveToCart={onMoveToCart}
          onClearWishlist={onClearWishlist}
          state={menuState}
          onClose={() => setIsDrawerOpen(false)}
          changeState={(newState) => setMenuState(newState)}
          emptyCartTitle={emptyCartTitle}
          emptyCartSubtitle={emptyCartSubtitle}
          emptyCartImage={emptyCartImage}
          emptyCartCategories={emptyCartCategories}
          emptyWishlistTitle={emptyWishlistTitle}
          emptyWishlistSubtitle={emptyWishlistSubtitle}
          emptyWishlistImage={emptyWishlistImage}
          emptyWishlistCategories={emptyWishlistCategories}
        />
      </Drawer>
    </div>
  );
};

export default UtilitySection;
