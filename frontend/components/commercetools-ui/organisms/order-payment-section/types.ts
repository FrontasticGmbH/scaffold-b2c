import { Order } from 'shared/types/cart';
import { Money } from 'shared/types/product/Money';
import { FrontasticImage } from 'components/commercetools-ui/atoms/image';
import { UseCartReturn } from 'frontastic/hooks/useCart/types';

export type CostsProps = {
  className?: string;
  totalAmountClassName?: string;
  subCostsContainerClassName?: string;
  subCostClassName?: string;
  dataReference?: 'cart' | 'order';
  order?: Order;
  costs?: { subtotal: Money; shipping: Money; tax: Money; total: Money };
};

export type CostsLabel = keyof UseCartReturn['transaction'];

export type CostRef = { key: CostsLabel; label: string; value: Money };

export type CostsValueRef = {
  [key in 'cart' | 'order']: {
    [key in CostsLabel]: Money;
  };
};

export type PaymentMethod = {
  name: string;
  image: Pick<FrontasticImage, 'media'>;
};

export type PaymentMethodsProps = {
  paymentMethods: Array<PaymentMethod>;
};
