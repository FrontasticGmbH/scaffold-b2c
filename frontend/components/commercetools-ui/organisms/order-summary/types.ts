import { ReactElement } from 'react';
import { Order } from 'shared/types/cart';
import { PaymentMethod } from 'components/commercetools-ui/organisms/checkout/provider/payment/types';

export type CheckoutButtonProps = {
  className?: string;
  link: string;
  disabled?: boolean;
  text: string;
  onClick?: () => void;
};

export interface ClassNames {
  button?: string;
  applyDiscountButton?: string;
  itemsList?: string;
  infoContainer?: string;
  totalAmount?: string;
  subCost?: string;
  subCostsContainer?: string;
}

export type OrderSummaryProps = {
  title?: string;
  className?: string;
  classNames?: ClassNames;
  order?: Order;
  includeItemsList?: boolean;
  includeLoginSuggestion?: boolean;
  includeSummaryAccordion?: boolean;
  paymentMethods?: Array<PaymentMethod>;
  dataReference?: 'order' | 'cart';
  button?: ReactElement;
};
