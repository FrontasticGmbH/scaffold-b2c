import React, { FC } from 'react';
import useCloseFlyouts from 'helpers/hooks/useCloseFlyouts';
import { useFormat } from 'helpers/hooks/useFormat';
import { useCart } from 'frontastic';
import { CartSlideoutProps } from './type';
import CartItem from '../cart/components/cart-item';
import { EmptyState } from '../empty-state';
import OrderPaymentSection from '../order-payment-section';
import CheckoutButton from '../order-summary/components/checkout-button';

const CartSlideout: FC<CartSlideoutProps> = ({
  emptyStateImage,
  emptyStateTitle,
  emptyStateSubtitle,
  emptyStateCategories,
  handleCategoryClick,
}) => {
  const { formatMessage: formatCartMessage } = useFormat({ name: 'cart' });

  const { data, isEmpty } = useCart();
  const closeFlyouts = useCloseFlyouts();

  return (
    <>
      {isEmpty ? (
        <EmptyState
          className="grow"
          categories={emptyStateCategories}
          image={emptyStateImage}
          title={emptyStateTitle}
          subtitle={emptyStateSubtitle}
          handleCategoryClick={handleCategoryClick}
        />
      ) : (
        <div className="h-[65vh] grow divide-y divide-neutral-400 overflow-auto px-12 md:px-22">
          {data?.lineItems?.map((lineItem) => (
            <CartItem key={lineItem.lineItemId} item={lineItem} />
          ))}
        </div>
      )}
      <OrderPaymentSection
        classNames={{
          applyDiscountButton: 'px-12 py-24 md:px-22',
          infoContainer: 'px-12 p-16 md:px-22',
          totalAmount: 'pb-20',
          subCost: 'text-14',
        }}
        button={
          <CheckoutButton
            text={formatCartMessage({ id: 'cart.go', defaultMessage: 'Go to cart' })}
            link="/cart"
            onClick={closeFlyouts}
          />
        }
      />
    </>
  );
};

export default CartSlideout;
