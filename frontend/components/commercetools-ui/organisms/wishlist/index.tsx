import React from 'react';
import Button from 'components/commercetools-ui/atoms/button';
import { EmptyState } from 'components/commercetools-ui/organisms/empty-state';
import { FooterLink } from 'components/commercetools-ui/organisms/footer/atoms/column';
import { useFormat } from 'helpers/hooks/useFormat';
import { useWishlist } from 'frontastic';
import { ImageProps } from 'frontastic/lib/image';
import WishlistItem from './components/wishlist-item';

export interface Props {
  emptyWishlistTitle: string;
  emptyWishlistSubtitle: string;
  emptyWishlistImage: ImageProps;
  emptyWishlistCategories: FooterLink[];
  handleCategoryClick?: () => void;
}
const Wishlist: React.FC<Props> = ({
  emptyWishlistTitle,
  emptyWishlistSubtitle,
  emptyWishlistImage,
  emptyWishlistCategories,
  handleCategoryClick,
}) => {
  const { formatMessage: formatWishlistMessage } = useFormat({ name: 'wishlist' });
  const { data: wishlistData, deleteWishlist } = useWishlist();
  const handleDeleteWishlist = async () => {
    if (wishlistData) await deleteWishlist(wishlistData);
  };

  return (
    <>
      {!wishlistData?.lineItems?.length ? (
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
            {wishlistData?.lineItems?.map((lineItem) => (
              <WishlistItem key={lineItem.lineItemId} item={lineItem} />
            ))}
          </div>
          <div className="absolute bottom-0 h-88 w-full p-20">
            <Button onClick={handleDeleteWishlist} variant="secondary" className="w-full text-16">
              {formatWishlistMessage({ id: 'wishlist.clear.list', defaultMessage: 'Clear the list' })}
            </Button>
          </div>
        </>
      )}
    </>
  );
};
export default Wishlist;
