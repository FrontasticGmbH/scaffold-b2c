import { PaginatedQuery } from './PaginatedQuery';

export enum CategoryQueryFormat {
  FLAT = 'flat',
  TREE = 'tree'
}
export interface CategoryQuery extends PaginatedQuery {
  slug?: string;
  parentId?: string;
  format?: CategoryQueryFormat;
}
