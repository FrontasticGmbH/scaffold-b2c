//import { PaymentMethod } from 'shared/types/cart/Payment';
import { Category } from 'shared/types/product';
import { PaymentMethod } from 'components/commercetools-ui/organisms/checkout/provider/payment/types';

export interface CartProps {
  paymentMethods: Array<PaymentMethod>;
  categories: Category[];
  emptyStateDescription?: string;
}

export type EmptyCartProps = Omit<CartProps, 'paymentMethods'>;

export type CartContentProps = EmptyCartProps & {
  className?: string;
};
