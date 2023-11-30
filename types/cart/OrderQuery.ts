import { OrderState } from './Order';
import { PaginatedQuery } from '../query';

export enum SortOrder {
  ASCENDING = 'ascending',
  DESCENDING = 'descending',
}

export interface SortAttributes {
  [key: string]: any;
}

export interface OrderQuery extends PaginatedQuery {
  accountId: string;
  orderIds?: string[];
  orderNumbers?: string[];
  orderState?: OrderState[];
  sortAttributes?: SortAttributes;
  businessUnitKey?: string;
  query?: string;
}
