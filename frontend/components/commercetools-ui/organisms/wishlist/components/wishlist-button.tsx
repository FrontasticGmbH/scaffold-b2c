import React, { FC, useState } from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import { Wishlist } from 'shared/types/wishlist';
import { LineItem } from 'shared/types/wishlist/LineItem';
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
    'transition duration-150 ease-out hover:fill-red-500 hover:stroke-red-500',
    onWishlist ? 'fill-red-500 stroke-red-500' : 'fill-white stroke-gray-600',
  ]);

  const buttonClassName = className || 'absolute top-3 right-0 h-24 w-24 cursor-pointer';

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

  return (
    <HeartIcon
      className={buttonClassName + ' ' + pathClassNames}
      strokeWidth={'0.75'}
      onClick={onClick}
      data-testid="heart-icon"
    />
  );
};

export default WishlistButton;
