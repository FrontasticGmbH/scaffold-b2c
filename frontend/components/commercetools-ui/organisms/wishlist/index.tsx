import React from 'react';
import { useTranslations } from 'use-intl';
import Button from 'components/commercetools-ui/atoms/button';
import { ImageProps } from 'components/commercetools-ui/atoms/image';
import WishlistItem from 'components/commercetools-ui/molecules/wishlist-item';
import { EmptyState } from 'components/commercetools-ui/organisms/empty-state';
import { FooterLink } from 'components/commercetools-ui/organisms/footer/atoms/column';
import { LineItem, Wishlist as WishlistShape } from 'types/entity/wishlist';

export interface Props {
  wishlist?: WishlistShape;
  onRemoveFromWishlist?: (lineItemId: string) => Promise<void>;
  onMoveToCart?: (lineItem: LineItem) => Promise<void>;
  onClearWishlist?: () => Promise<void>;
  emptyWishlistTitle: string;
  emptyWishlistSubtitle: string;
  emptyWishlistImage: ImageProps;
  emptyWishlistCategories: FooterLink[];
  handleCategoryClick?: () => void;
}
const Wishlist: React.FC<Props> = ({
  wishlist,
  onRemoveFromWishlist,
  onMoveToCart,
  onClearWishlist,
  emptyWishlistTitle,
  emptyWishlistSubtitle,
  emptyWishlistImage,
  emptyWishlistCategories,
  handleCategoryClick,
}) => {
  const translate = useTranslations();

  return (
    <>
      {!wishlist?.lineItems?.length ? (
        <>
          <EmptyState
            title={emptyWishlistTitle}
            subtitle={emptyWishlistSubtitle}
            image={emptyWishlistImage}
            categories={emptyWishlistCategories}
            handleCategoryClick={handleCategoryClick}
          />
        </>
      ) : (
        <>
          <div className="h-[83vh] grow divide-y divide-neutral-400 overflow-auto px-12 md:px-22">
            {wishlist?.lineItems?.map((lineItem) => (
              <WishlistItem
                key={lineItem.lineItemId}
                item={lineItem}
                onRemove={async () => onRemoveFromWishlist?.(lineItem.lineItemId as string)}
                onMoveToCart={async () => onMoveToCart?.(lineItem)}
              />
            ))}
          </div>
          <div className="absolute bottom-0 h-88 w-full p-20">
            <Button onClick={onClearWishlist} variant="secondary" className="w-full text-16">
              {translate('wishlist.wishlist-clear-list')}
            </Button>
          </div>
        </>
      )}
    </>
  );
};
export default Wishlist;
