import { OrderState } from 'shared/types/cart';

type SortAttribute = {
  [key: string]: 'asc' | 'desc';
};

type QueryOrdersQuery = {
  limit?: number;
  cursor?: string;
  orderIds?: string[];
  orderNumbers?: string[];
  orderStates?: OrderState[];
  sortAttributes?: SortAttribute[];
  query?: string;
};

type GetOrderQuery = {
  orderId: string;
};

export { type QueryOrdersQuery, type GetOrderQuery };
