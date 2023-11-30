import { Result } from 'shared/types/product/Result';
import { ProductQuery } from 'shared/types/query/ProductQuery';
import { Category } from 'shared/types/product/Category';
import { SDKResponse } from '@commercetools/frontend-sdk';

export interface Filter {
  type: 'boolean' | 'term' | 'range';
  identifier: string;
}

export interface UseProductReturn {
  categories?: Category[];
  query: (productQuery: ProductQuery) => Promise<SDKResponse<Result>>;
}
