import { useCallback } from 'react';
import { Category } from 'shared/types/product';
import { ProductQuery } from 'shared/types/query/ProductQuery';
import { ProductPaginatedResult } from 'shared/types/result/PaginatedResult';
import useSWR from 'swr';
import { sdk } from 'sdk';
import { Product } from 'types/entity/product';

const useProduct = ({ query, limit }: Partial<ProductQuery> = {}) => {
  const { data: productsData } = useSWR(['/action/product/query', query, limit], () =>
    sdk.composableCommerce.product.query({ query, limit }),
  );

  const products = (productsData?.isError ? [] : (productsData?.data?.items as Product[])) ?? [];

  const { data: categoriesData } = useSWR('/action/product/queryCategories', () =>
    sdk.callAction<ProductPaginatedResult>({
      actionName: 'product/queryCategories',
      query: { format: 'tree' },
    }),
  );

  const categories = (categoriesData?.isError ? [] : (categoriesData?.data?.items as Category[])) ?? [];

  const queryProducts = useCallback(async (productQuery: ProductQuery) => {
    const extensions = sdk.composableCommerce;

    const res = await extensions.product.query(productQuery);

    return res;
  }, []);

  return { products, categories, query: queryProducts };
};

export default useProduct;
