import { ReactElement } from 'react';
import { Order } from 'shared/types/cart';
import { Account } from 'types/entity/account';
import { Cart, Discount } from 'types/entity/cart';
import { PaymentMethod } from '../order-payment-section/types';

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
  login?: (email: string, password: string, rememberMe?: boolean) => Promise<Account>;
  requestConfirmationEmail?: (email: string, password: string) => Promise<{ error?: boolean; message?: string }>;
  requestPasswordReset?: (email: string) => Promise<{ error?: boolean; message?: string }>;
};
