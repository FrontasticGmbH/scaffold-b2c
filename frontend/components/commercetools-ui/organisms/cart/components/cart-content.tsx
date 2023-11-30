import { FC } from 'react';
import { useFormat } from 'helpers/hooks/useFormat';
import { useCart } from 'frontastic';
import CartItemsList from './cart-items-list';
import EmptyCart from './empty-cart';
import { CartContentProps } from '../types';

const CartContent: FC<CartContentProps> = ({ className, ...props }) => {
  const { formatMessage: formatCartMessage } = useFormat({ name: 'cart' });

  const { isEmpty, totalItems } = useCart();

  return (
    <div className={className}>
      <div className="flex items-center justify-between">
        <h3 className="text-16 md:text-18 lg:text-22">
          {formatCartMessage({ id: 'cart', defaultMessage: 'Cart' })}
          {!isEmpty && ': '}
          {!isEmpty && (
            <span className="text-secondary-black">
              ({totalItems} {formatCartMessage({ id: 'items', defaultMessage: 'Items' })})
            </span>
          )}
        </h3>
      </div>

      {!isEmpty ? <CartItemsList /> : <EmptyCart {...props} />}
    </div>
  );
};

export default CartContent;
