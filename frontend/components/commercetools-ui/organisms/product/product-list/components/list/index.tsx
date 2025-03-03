import React, { useMemo } from 'react';
import { PLP_PRODUCT_CLICKED } from 'helpers/constants/events';
import { useFormat } from 'helpers/hooks/useFormat';
import { Cart } from 'types/entity/cart';
import { Product } from 'types/entity/product';
import { useProductList } from '../../context';
import PlpProductTileWrapper from '../plp-product-tile-wrapper';

interface Props {
  products: Product[];
  cart?: Cart;
}

const List: React.FC<Props> = ({ products, cart }) => {
  const { formatMessage: formatProductMessage } = useFormat({ name: 'product' });

  const { searchQuery, loadMore, totalItems } = useProductList();

  const loadedAll = useMemo(() => products.length === totalItems, [products, totalItems]);

  return (
    <div>
      <div className="grid grid-cols-2 gap-16 pt-32 md:grid-cols-3 lg:grid-cols-4 lg:gap-24">
        {products.map((product) => (
          <PlpProductTileWrapper
            key={product.productId}
            product={product}
            cart={cart}
            isSearchResult={!!searchQuery}
            onClick={() => {
              gtag('event', PLP_PRODUCT_CLICKED, product);
            }}
          />
        ))}
      </div>
      <button
        className="mx-auto mt-90 block rounded-md bg-primary px-48 py-12 text-16 font-medium text-white transition hover:bg-gray-500 disabled:bg-neutral-400 disabled:opacity-0"
        disabled={loadedAll}
        onClick={loadMore}
      >
        {formatProductMessage({ id: 'load.more', defaultMessage: 'Load More' })}
      </button>
    </div>
  );
};

export default List;
