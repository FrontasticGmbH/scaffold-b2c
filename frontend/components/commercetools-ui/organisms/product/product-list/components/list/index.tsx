import React, { useMemo } from 'react';
import { Product } from 'shared/types/product/Product';
import ProductTile from 'components/commercetools-ui/organisms/product/product-tile';
import { PLP_PRODUCT_CLICKED } from 'helpers/constants/events';
import { useFormat } from 'helpers/hooks/useFormat';
import { useProductList } from '../../context';

interface Props {
  products: Product[];
}

const List: React.FC<Props> = ({ products }) => {
  const { formatMessage: formatProductMessage } = useFormat({ name: 'product' });

  const { searchQuery, loadMore, totalItems } = useProductList();

  const loadedAll = useMemo(() => products.length === totalItems, [products, totalItems]);

  return (
    <div>
      <div className="grid grid-cols-2 gap-16 pt-32 md:grid-cols-3 lg:grid-cols-4 lg:gap-24">
        {products.map((product) => (
          <ProductTile
            key={product.productId}
            product={product}
            isSearchResult={!!searchQuery}
            onClick={() => {
              gtag('event', PLP_PRODUCT_CLICKED, product);
            }}
          />
        ))}
      </div>
      <button
        className="mx-auto mt-[90px] block rounded-md bg-primary-black px-48 py-12 text-16 font-medium text-white transition hover:bg-gray-500 disabled:bg-neutral-400 disabled:opacity-0"
        disabled={loadedAll}
        onClick={loadMore}
      >
        {formatProductMessage({ id: 'load.more', defaultMessage: 'Load More' })}
      </button>
    </div>
  );
};

export default List;
