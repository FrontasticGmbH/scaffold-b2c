import { useCallback } from 'react';
import { Category } from 'shared/types/product';
import { ProductQuery } from 'shared/types/query/ProductQuery';
import useSWR from 'swr';
import { sdk } from 'sdk';
import { Result } from 'shared/types/product/Result';
//import { revalidateOptions } from 'frontastic';
import { UseProductReturn } from './types';

const useProduct = (): UseProductReturn => {
  const { data } = useSWR('/action/product/queryCategories', () =>
    sdk.callAction<Result>({ actionName: 'product/queryCategories', query: { format: 'tree' } }),
  );

  const categories = (data?.isError ? [] : (data?.data?.items as Category[])) ?? [];

  const query = useCallback(async (productQuery: ProductQuery) => {
    /* To Do: Use SDK instead of current workaround */

    const extensions = sdk.composableCommerce;

    const res = await extensions.product.query({ limit: productQuery.limit, query: productQuery.query });

    return res;

    // const params = new URLSearchParams();

    // if (productQuery.query) params.set('query', productQuery.query);
    // if (productQuery.limit) params.set('limit', productQuery.limit);

    // const res = await fetchApiHub(`/action/product/query?${params.toString()}`, SDK.locale);

    // return { data: res, isError: false } as SDKResponse<Result>;
  }, []);

  return { categories, query };
};

export default useProduct;
