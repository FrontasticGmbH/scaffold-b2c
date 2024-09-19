import { PaymentMethod } from 'components/commercetools-ui/organisms/checkout/provider/payment/types';
import { Cart, Discount, LineItem as CartLineItem } from 'types/entity/cart';
import { Category } from 'types/entity/category';

export interface CartProps {
  cart?: Cart;
  isEmpty?: boolean;
  onApplyDiscountCode?: (code: string) => Promise<void>;
  onRemoveDiscountCode?: (discount: Discount) => Promise<void>;
  hasOutOfStockItems?: boolean;
  totalItems?: number;
  paymentMethods: Array<PaymentMethod>;
  categories: Category[];
  emptyStateDescription?: string;
  onRemoveItem(itemId: string): Promise<void>;
  onUpdateItem(itemId: string, quantity: number): Promise<void>;
  OnMoveToWishlist(lineItem: CartLineItem): Promise<void>;
}
