import React, { FC } from 'react';
import { useParams } from 'next/navigation';
import { TrashIcon } from '@heroicons/react/24/outline';
import { LineItem } from 'shared/types/wishlist/LineItem';
import Button from 'components/commercetools-ui/atoms/button';
import Image from 'components/commercetools-ui/atoms/image';
import { CurrencyHelpers } from 'helpers/currencyHelpers';
import { useFormat } from 'helpers/hooks/useFormat';

export interface WishlistItemProps {
  item: LineItem;
  onRemove?: () => Promise<void>;
  onMoveToCart?: () => Promise<void>;
}

const WishlistItem: FC<WishlistItemProps> = ({ item, onRemove, onMoveToCart }) => {
  const { locale } = useParams();

  const { formatMessage: formatWishlistMessage } = useFormat({ name: 'wishlist' });

  return (
    <div className="flex max-w-full items-stretch justify-start gap-10 py-18 md:gap-15">
      <div className="h-145 w-125 shrink-0 bg-white p-12">
        <div className="relative size-full">
          <Image
            src={item.variant?.images?.[0]}
            suffix="small"
            style={{ objectFit: 'contain' }}
            alt={item.name ?? ''}
            fill
          />
        </div>
      </div>
      <div className="grow">
        <div className="flex max-w-full items-center justify-between">
          <p className="max-w-150 overflow-hidden text-ellipsis whitespace-pre text-14 uppercase leading-loose">
            {item.name}
          </p>
          <i onClick={onRemove} className="block cursor-pointer" data-testid="remove-button">
            <TrashIcon stroke="#494949" className="w-20" />
          </i>
        </div>
        <div className="mt-12">
          {item.variant?.discountedPrice ? (
            <div className="flex items-center gap-5">
              <span className="text-14 font-medium leading-loose text-accent-red">
                {CurrencyHelpers.formatForCurrency(item.variant.discountedPrice, locale)}
              </span>
              <span className="text-12 font-normal leading-loose text-gray-500 line-through">
                {CurrencyHelpers.formatForCurrency(item.variant?.price ?? 0, locale)}
              </span>
            </div>
          ) : (
            <span className="text-14 font-medium leading-loose">
              {CurrencyHelpers.formatForCurrency(item.variant?.price ?? 0, locale)}
            </span>
          )}
        </div>
        <div className="mt-16 leading-normal">
          <Button variant="primary" onClick={onMoveToCart} disabled={!item.variant?.isOnStock} className="py-8 text-14">
            {formatWishlistMessage({ id: 'wishlist.add.to.cart', defaultMessage: 'Add to cart' })}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WishlistItem;
