import { ProductQuery } from 'shared/types/query';

type GetProductQuery = {
  id: string;
  sku: string;
};

type ProductQueryQuery = {
  limit?: number;
  cursor?: string;
  categories?: string[];
  productIds?: string[];
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
