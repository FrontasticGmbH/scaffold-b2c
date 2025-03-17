import { useMemo } from 'react';
import { useTranslations } from 'use-intl';
import CartItem from './cart-item';
import { CartProps } from '../types';

type Props = Pick<CartProps, 'cart' | 'onRemoveItem' | 'onUpdateItem' | 'OnMoveToWishlist'>;

const CartItemsList = ({ cart, onRemoveItem, onUpdateItem, OnMoveToWishlist }: Props) => {
  const translate = useTranslations();

  const lineItems = useMemo(() => {
    return (cart?.lineItems ?? []).filter((lineItem) => lineItem.variant?.isOnStock);
  }, [cart?.lineItems]);

  const soldOutItems = useMemo(() => {
    return (cart?.lineItems ?? []).filter((lineItem) => !lineItem.variant?.isOnStock);
  }, [cart?.lineItems]);

  return (
    <div className="mt-12 divide-y divide-neutral-400 border-t border-neutral-400 lg:mt-34 lg:border-none">
      {lineItems.map((lineItem) => (
        <div key={lineItem.lineItemId}>
          <CartItem
            item={lineItem}
            classNames={{ moveToWishlist: 'text-14' }}
            onRemoveItem={() => onRemoveItem(lineItem.lineItemId as string)}
            onUpdateItem={(quantity) => onUpdateItem(lineItem.lineItemId as string, quantity)}
            OnMoveToWishlist={() => OnMoveToWishlist(lineItem)}
          />
        </div>
      ))}

      {soldOutItems.length > 0 && (
        <div className="border-t border-neutral-400 pt-36">
          <h3 className="text-16 md:text-18 lg:text-22">{translate('product.sold-out')}</h3>
          <div className="mt-52">
            {soldOutItems.map((lineItem) => (
              <div key={lineItem.lineItemId}>
                <CartItem
                  item={lineItem}
                  classNames={{ moveToWishlist: 'text-14' }}
                  onRemoveItem={() => onRemoveItem(lineItem.lineItemId as string)}
                  onUpdateItem={(quantity) => onUpdateItem(lineItem.lineItemId as string, quantity)}
                  OnMoveToWishlist={() => OnMoveToWishlist(lineItem)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartItemsList;
