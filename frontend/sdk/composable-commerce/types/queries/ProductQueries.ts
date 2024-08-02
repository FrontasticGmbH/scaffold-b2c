import { ProductQuery } from 'shared/types/query';

type GetProductQuery = {
  id?: string;
  key?: string;
  ref?: string;
  sku?: string;
};

type ProductQueryQuery = {
  limit?: number;
  cursor?: string;
  categories?: string[];
  productIds?: string[];
  productKeys?: string[];
  productRefs?: string[];
  productType?: string;
  skus?: string[];
  query?: string;
};

type QueryProductCategoriesQuery = {
  limit?: number;
  cursor?: string;
  slug?: string;
};

export { type GetProductQuery, type ProductQueryQuery, type QueryProductCategoriesQuery };
