import { Account } from 'types/entity/account';
import { Cart, Discount, LineItem as CartLineItem } from 'types/entity/cart';
import { Category } from 'types/entity/category';
import { PaymentMethod } from '../order-payment-section/types';

export interface CartProps {
  cart?: Cart;
  isEmpty?: boolean;
  hasOutOfStockItems?: boolean;
  totalItems?: number;
  paymentMethods: Array<PaymentMethod>;
  categories: Category[];
  emptyStateDescription?: string;
  onRemoveItem(itemId: string): Promise<void>;
  onApplyDiscountCode?: (code: string) => Promise<void>;
  OnMoveToWishlist(lineItem: CartLineItem): Promise<void>;
  onUpdateItem(itemId: string, quantity: number): Promise<void>;
  onRemoveDiscountCode?: (discount: Discount) => Promise<void>;
  login?: (email: string, password: string, rememberMe?: boolean) => Promise<Account>;
  requestConfirmationEmail?: (email: string, password: string) => Promise<{ error?: boolean; message?: string }>;
  requestPasswordReset?: (email: string) => Promise<{ error?: boolean; message?: string }>;
}
