import { useCallback } from 'react';
import { Product } from 'shared/types/product/Product';
import { searchClient } from 'algolia/searchClient';
import { useLocalizedIndex } from 'providers/algolia/localized-index';

const useGetHitByProduct = () => {
  const { indexName: productsIndex } = useLocalizedIndex({ type: 'products' });

  const getHitByProduct = useCallback(
    async (product: Product) => {
      const index = searchClient.initIndex(productsIndex);

      const results = await index.search('', { filters: `productId:${product.productId}` });

      const hit = results.hits[0];

      return hit;
    },
    [productsIndex],
  );

  return getHitByProduct;
};

export default useGetHitByProduct;
