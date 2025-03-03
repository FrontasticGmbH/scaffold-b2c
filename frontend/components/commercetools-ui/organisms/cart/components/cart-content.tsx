import { useFormat } from 'helpers/hooks/useFormat';
import CartItemsList from './cart-items-list';
import EmptyCart from './empty-cart';
import { CartProps } from '../types';

type Props = Omit<CartProps, 'paymentMethods'> & {
  className?: string;
};

const CartContent = ({
  className,
  isEmpty,
  totalItems,
  cart,
  onRemoveItem,
  onUpdateItem,
  OnMoveToWishlist,
  ...props
}: Props) => {
  const { formatMessage: formatCartMessage } = useFormat({ name: 'cart' });

  return (
    <div className={className}>
      {!isEmpty ? (
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-16 md:text-18 lg:text-22">
              {formatCartMessage({ id: 'cart', defaultMessage: 'Cart' })}
              {!isEmpty && ': '}
              {!isEmpty && (
                <span className="text-gray-600">
                  ({totalItems} {formatCartMessage({ id: 'items', defaultMessage: 'Items' })})
                </span>
              )}
            </h3>
          </div>
          <CartItemsList
            cart={cart}
            onRemoveItem={onRemoveItem}
            onUpdateItem={onUpdateItem}
            OnMoveToWishlist={OnMoveToWishlist}
          />
        </div>
      ) : (
        <EmptyCart {...props} />
      )}
    </div>
  );
};

export default CartContent;
