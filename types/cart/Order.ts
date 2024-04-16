import { Cart } from './Cart';

export interface ReturnLineItem {
  returnLineItemId?: string;
  lineItemId: string;
  count: number;
  comment?: string;
  createdAt?: Date;
}

export interface ReturnInfo {
  lineItems: ReturnLineItem[];
  returnDate?: Date;
  returnTrackingId?: string;
}

export type OrderState = 'Cancelled' | 'Complete' | 'Confirmed' | 'Open';

export enum ShipmentState {
  BACKORDER = 'Backorder',
  DELAYED = 'Delayed',
  DELIVERED = 'Delivered',
  PARTIAL = 'Partial',
  PENDING = 'Pending',
  READY = 'Ready',
  SHIPPED = 'Shipped',
}

export interface Order extends Cart {
  orderId?: string;
  orderVersion?: string;
  orderNumber?: string;
  orderState?: string;
  createdAt?: Date;
  returnInfo?: ReturnInfo[];
  purchaseOrderNumber?: string;
  shipmentState?: ShipmentState;
}
