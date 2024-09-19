import { FC, useState } from 'react';
import { Wishlist } from 'shared/types/wishlist';
import { LineItem } from 'shared/types/wishlist/LineItem';
import HeartIcon from 'components/icons/heart';
import useClassNames from 'helpers/hooks/useClassNames';

interface WishlistButtonProps {
  lineItem: LineItem;
  className?: string;
  data?: Wishlist;
  addToWishlist?: (lineItem: LineItem, count: number) => Promise<void>;
  removeFromWishlist?: (item: LineItem) => Promise<void>;
}

const WishlistButton: FC<WishlistButtonProps> = ({ lineItem, className, data, removeFromWishlist, addToWishlist }) => {
  const [processing, setProcessing] = useState(false);

  const onWishlist = !!data?.lineItems?.find(({ variant }) => variant?.sku === lineItem.variant?.sku);

  const pathClassNames = useClassNames([
    'transition duration-150 ease-out hover:fill-accent-red hover:stroke-accent-red',
    onWishlist ? 'fill-accent-red stroke-accent-red' : 'fill-white stroke-secondary-black',
  ]);

  const buttonClassName = className || 'absolute top-3 right-0 h-20 w-20 cursor-pointer';

  const handleAddToWishList = async () => {
    await addToWishlist?.(lineItem, 1);
  };

  const onRemoveFromWishlist = async () => {
    if (onWishlist) {
      const item = data?.lineItems?.find(({ variant }) => variant?.sku === lineItem.variant?.sku);

      if (item) await removeFromWishlist?.(item);
    }
  };

  const onClick = async () => {
    if (processing) return;
    setProcessing(true);
    if (onWishlist) {
      await onRemoveFromWishlist?.();
    } else {
      await handleAddToWishList?.();
    }
    setProcessing(false);
  };

  return <HeartIcon className={buttonClassName} pathClassName={pathClassNames} onClick={onClick} />;
};

export default WishlistButton;
