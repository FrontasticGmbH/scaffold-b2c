import { Cart } from './Cart';

export enum ShipmentState {
  BACKORDER = 'Backorder',
  DELAYED = 'Delayed',
  DELIVERED = 'Delivered',
  PARTIAL = 'Partial',
  PENDING = 'Pending',
  READY = 'Ready',
  SHIPPED = 'Shipped',
}

export enum OrderState {
  Cancelled = 'Cancelled',
  Complete = 'Complete',
  Confirmed = 'Confirmed',
  Open = 'Open',
}

export interface Order extends Cart {
  orderId?: string;
  orderNumber?: string;
  orderVersion?: string;
  orderState?: string;
  createdAt?: Date;
  shipmentState?: ShipmentState;
}
