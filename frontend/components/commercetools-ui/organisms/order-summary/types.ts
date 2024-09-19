import { ReactElement } from 'react';
import { Order } from 'shared/types/cart';
import { PaymentMethod } from 'components/commercetools-ui/organisms/checkout/provider/payment/types';
import { Cart, Discount } from 'types/entity/cart';

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
  cart?: Cart;
  isEmpty?: boolean;
  discounts: Discount[];
  onApplyDiscountCode?: (code: string) => Promise<void>;
  onRemoveDiscountCode?: (discount: Discount) => Promise<void>;
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
