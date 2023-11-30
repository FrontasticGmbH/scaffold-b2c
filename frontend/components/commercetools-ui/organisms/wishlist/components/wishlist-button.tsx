import { FC, useEffect, useState } from 'react';
import { LineItem } from 'shared/types/wishlist/LineItem';
import HeartIcon from 'components/icons/heart';
import useClassNames from 'helpers/hooks/useClassNames';
import { useWishlist } from 'frontastic';

interface wishlistButtonProps {
  lineItem: LineItem;
  className?: string;
}

const WishlistButton: FC<wishlistButtonProps> = ({ lineItem, className }) => {
  const wishlist = useWishlist();
  const [onWishlist, setOnWishlist] = useState<boolean>(false);
  const [processing, setProcessing] = useState(false);
  const pathClassNames = useClassNames([
    'transition duration-150 ease-out hover:fill-accent-red hover:stroke-accent-red',
    onWishlist ? 'fill-accent-red stroke-accent-red' : 'fill-white stroke-secondary-black',
  ]);

  const buttonClassName = className || 'absolute top-3 right-0 h-20 w-20 cursor-pointer';
  useEffect(() => {
    if (wishlist?.data?.lineItems) {
      const item = wishlist.data.lineItems.find(({ variant }) => variant?.sku === lineItem.variant?.sku);
      setOnWishlist(!!item);
    }
  }, [wishlist?.data?.lineItems, lineItem.variant?.sku]);

  const handleAddToWishList = async () => {
    if (wishlist?.data) await wishlist.addToWishlist(wishlist?.data, lineItem, 1);
  };

  const handleRemoveFromWishlist = async () => {
    if (wishlist?.data?.lineItems) {
      const item = wishlist.data.lineItems.find(({ variant }) => variant?.sku === lineItem.variant?.sku);
      if (item) await wishlist.removeLineItem(wishlist.data, item);
    }
  };

  const onClick = async () => {
    if (processing) return;
    setProcessing(true);
    if (onWishlist) {
      await handleRemoveFromWishlist();
    } else {
      await handleAddToWishList();
    }
    setProcessing(false);
  };

  return <HeartIcon className={buttonClassName} pathClassName={pathClassNames} onClick={onClick} />;
};

export default WishlistButton;
