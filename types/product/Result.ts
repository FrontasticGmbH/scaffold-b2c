import {Product} from './Product';
import {Category} from './Category';

/**
 * @deprecated | Use ProductPaginatedResult & PaginatedResult<T>
 */
export interface Result {
  total?: number;
  previousCursor?: string;
  nextCursor?: string;
  count: number;
  items: Product[] | Category[];
  facets?: any[];
  query?: any;
}
