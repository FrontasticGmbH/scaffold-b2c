import { useMemo } from 'react';
import { useFormat } from 'helpers/hooks/useFormat';
import { useCart } from 'frontastic';
import CartItem from './cart-item';

const CartItemsList = () => {
  const { data } = useCart();
  const { formatMessage: formatProductMessage } = useFormat({ name: 'product' });

  const lineItems = useMemo(() => {
    return (data?.lineItems ?? []).filter((lineItem) => lineItem.variant?.isOnStock);
  }, [data?.lineItems]);

  const soldOutItems = useMemo(() => {
    return (data?.lineItems ?? []).filter((lineItem) => !lineItem.variant?.isOnStock);
  }, [data?.lineItems]);

  return (
    <div className="mt-12 divide-y divide-neutral-400 border-t border-neutral-400 lg:mt-34 lg:border-none">
      {lineItems.map((lineItem) => (
        <div key={lineItem.lineItemId}>
          <CartItem item={lineItem} classNames={{ moveToWishlist: 'text-14' }} />
        </div>
      ))}

      {soldOutItems.length > 0 && (
        <div className="border-t border-neutral-400 pt-36">
          <h3 className="text-16 md:text-18 lg:text-22">
            {formatProductMessage({ id: 'sold.out', defaultMessage: 'Sold out' })}
          </h3>
          <div className="mt-52">
            {soldOutItems.map((lineItem) => (
              <div key={lineItem.lineItemId}>
                <CartItem item={lineItem} classNames={{ moveToWishlist: 'text-14' }} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartItemsList;
