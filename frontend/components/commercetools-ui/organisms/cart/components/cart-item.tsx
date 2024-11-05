import React, { useCallback, useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import { LineItem as CartLineItem } from 'shared/types/cart/LineItem';
import Image from 'components/commercetools-ui/atoms/image';
import OutOfStock from 'components/commercetools-ui/atoms/out-of-stock';
import QuantitySelector from 'components/commercetools-ui/atoms/quantity-selector';
import useClassNames from 'helpers/hooks/useClassNames';
import { useFormat } from 'helpers/hooks/useFormat';
import CartItemPrice from './cart-item-price';

interface ClassNames {
  moveToWishlist?: string;
}

interface Props {
  item: CartLineItem;
  classNames?: ClassNames;
  onRemoveItem(): Promise<void>;
  onUpdateItem(quantity: number): Promise<void>;
  OnMoveToWishlist(): Promise<void>;
}

const CartItem: React.FC<Props> = ({ item, onRemoveItem, onUpdateItem, OnMoveToWishlist, classNames = {} }) => {
  const { formatMessage: formatCartMessage } = useFormat({ name: 'cart' });

  const [processing, setProcessing] = useState(false);

  const deleteButtonClassName = useClassNames(['block', processing ? 'cursor-not-allowed' : 'cursor-pointer']);

  const wishlistButtonClassName = useClassNames([
    'text-secondary-black decoration-secondary-black decoration-solid hover:underline hover:underline-offset-2',
    classNames.moveToWishlist,
    processing ? 'cursor-not-allowed' : 'cursor-pointer',
  ]);

  const handleUpdateItem = useCallback(
    async (quantity: number) => {
      if (processing) return;

      setProcessing(true);

      await (quantity < 1 ? onRemoveItem() : onUpdateItem(quantity));

      setProcessing(false);
    },
    [onUpdateItem, onRemoveItem, processing],
  );

  const handleRemoveItem = useCallback(async () => {
    if (processing) return;

    setProcessing(true);
    await onRemoveItem();
    setProcessing(false);
  }, [onRemoveItem, processing]);

  const handleMoveToWishlist = useCallback(async () => {
    if (processing) return;

    setProcessing(true);
    await OnMoveToWishlist();
    setProcessing(false);
  }, [OnMoveToWishlist, processing]);

  return (
    <div className="flex max-w-full items-stretch justify-start gap-10 py-18 md:gap-15">
      <div className="w-125 shrink-0 bg-white p-12">
        <div className="relative size-full rounded-sm">
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
          <i onClick={handleRemoveItem} className={deleteButtonClassName}>
            <TrashIcon stroke="#494949" className="w-20" />
          </i>
        </div>
        {!item.variant?.isOnStock && (
          <div className="mt-8">
            <OutOfStock />
          </div>
        )}
        <div className="mt-8">
          <CartItemPrice item={item} />
        </div>
        <div className="mt-16">
          <QuantitySelector
            value={item.count}
            defaultValue={1}
            minValue={0}
            disabled={processing}
            onChange={handleUpdateItem}
          />
        </div>
        <div className="mt-16 text-12">
          <p className={wishlistButtonClassName} onClick={handleMoveToWishlist}>
            {formatCartMessage({ id: 'move.to.wishlist', defaultMessage: 'Move to wishlist' })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
