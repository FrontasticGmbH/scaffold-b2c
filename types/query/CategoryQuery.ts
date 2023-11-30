import { PaginatedQuery } from './PaginatedQuery';

export interface CategoryQuery extends PaginatedQuery {
  slug?: string;
  parentId?: string;
  format?: string;
}
