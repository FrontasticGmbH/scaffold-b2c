import { useCallback } from 'react';
import { Category } from 'shared/types/product';
import { ProductQuery } from 'shared/types/query/ProductQuery';
import { ProductPaginatedResult } from 'shared/types/result/PaginatedResult';
import useSWR from 'swr';
import { sdk } from 'sdk';
import { UseProductReturn } from './types';

const useProduct = (): UseProductReturn => {
  const { data } = useSWR('/action/product/queryCategories', () =>
    sdk.callAction<ProductPaginatedResult>({
      actionName: 'product/queryCategories',
      query: { format: 'tree' },
      skipQueue: true,
    }),
  );

  const categories = (data?.isError ? [] : (data?.data?.items as Category[])) ?? [];

  const query = useCallback(async (productQuery: ProductQuery) => {
    const extensions = sdk.composableCommerce;

    const res = await extensions.product.query(productQuery, { skipQueue: true });

    return res;
  }, []);

  return { categories, query };
};

export default useProduct;
