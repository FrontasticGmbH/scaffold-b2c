import React, { useCallback, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { TrashIcon } from '@heroicons/react/24/outline';
import { LineItem } from 'shared/types/cart/LineItem';
import { LineItem as LineItemWishlist } from 'shared/types/wishlist/LineItem';
import OutOfStock from 'components/commercetools-ui/atoms/out-of-stock';
import { CurrencyHelpers } from 'helpers/currencyHelpers';
import useClassNames from 'helpers/hooks/useClassNames';
import { useFormat } from 'helpers/hooks/useFormat';
import { useCart, useWishlist } from 'frontastic';
import Image from 'frontastic/lib/image';

interface ClassNames {
  moveToWishlist?: string;
}

export interface Props {
  item: LineItem;
  classNames?: ClassNames;
}

const CartItem: React.FC<Props> = ({ item, classNames = {} }) => {
  const { locale } = useParams();

  const { formatMessage: formatCartMessage } = useFormat({ name: 'cart' });

  const { removeItem, updateItem } = useCart();

  const { data: wishlist, addToWishlist } = useWishlist();

  const [processing, setProcessing] = useState(false);

  const counterClassName = useClassNames([
    'flex w-fit items-center gap-12 rounded-sm border border-neutral-400 transition hover:border-neutral-800',
    processing ? 'cursor-not-allowed bg-neutral-300' : 'cursor-pointer bg-white',
  ]);

  const updateCartItem = useCallback(
    async (newQuantity: number) => {
      if (processing) return;

      setProcessing(true);

      if (newQuantity < 1) await removeItem(item.lineItemId as string);
      else await updateItem(item.lineItemId as string, newQuantity);

      setProcessing(false);
    },
    [updateItem, removeItem, processing, item],
  );

  const cartLineItemToWishlistLineItem = useMemo<LineItemWishlist>(() => {
    return {
      lineItemId: item.lineItemId ?? '',
      productId: item.productId,
      name: item.name,
      type: item.type,
      count: 1,
      variant: item.variant,
      addedAt: new Date(),
      _url: item._url,
    };
  }, [item]);

  const moveToWishlist = useCallback(async () => {
    if (item.lineItemId) await removeItem(item.lineItemId);
    if (wishlist) addToWishlist(wishlist, cartLineItemToWishlistLineItem, 1);
  }, [removeItem, item.lineItemId, addToWishlist, wishlist, cartLineItemToWishlistLineItem]);

  return (
    <div className="flex max-w-full items-stretch justify-start gap-10 py-18 md:gap-15">
      <div className="w-125 shrink-0 bg-white p-12">
        <div className="relative h-full w-full rounded-sm">
          <Image src={item.variant?.images?.[0]} suffix="small" style={{ objectFit: 'contain' }} fill />
        </div>
      </div>
      <div className="max-w-full grow overflow-hidden">
        <div className="flex items-center justify-between">
          <p
            className="max-w-[85%] overflow-hidden text-ellipsis whitespace-pre text-14 uppercase leading-loose"
            title={item.name}
          >
            {item.name}
          </p>
          <i onClick={() => removeItem(item.lineItemId ?? '')} className="block cursor-pointer">
            <TrashIcon stroke="#494949" className="w-20" />
          </i>
        </div>
        {!item.variant?.isOnStock && (
          <div className="mt-8">
            <OutOfStock variant={item.variant} />
          </div>
        )}
        <div className="mt-8">
          {item.discountedPrice ? (
            <div className="flex items-center gap-5">
              <span className="text-14 font-medium leading-loose text-accent-red">
                {CurrencyHelpers.formatForCurrency(item.discountedPrice, locale)}
              </span>
              <span className="text-12 font-normal leading-loose text-gray-500 line-through">
                {CurrencyHelpers.formatForCurrency(item.price ?? 0, locale)}
              </span>
            </div>
          ) : (
            <span className="text-14 font-medium leading-loose">
              {CurrencyHelpers.formatForCurrency(item.price ?? 0, locale)}
            </span>
          )}
        </div>
        <div className="mt-16">
          <div className={counterClassName}>
            <button
              onClick={() => updateCartItem((item.count as number) - 1)}
              className="cursor-[inherit] py-3 pl-12 text-secondary-black"
            >
              -
            </button>
            <span className="py-3 text-14 text-secondary-black">{item.count}</span>
            <button
              onClick={() => updateCartItem((item.count as number) + 1)}
              className="cursor-[inherit] py-3 pr-12 text-secondary-black"
            >
              +
            </button>
          </div>
        </div>
        <div className="mt-16 text-12">
          <p
            className={`cursor-pointer text-secondary-black decoration-secondary-black decoration-solid hover:underline hover:underline-offset-2 ${
              classNames.moveToWishlist ?? ''
            }`}
            onClick={moveToWishlist}
          >
            {formatCartMessage({ id: 'move.to.wishlist', defaultMessage: 'Move to wishlist' })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
