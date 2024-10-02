import React, { createContext, useCallback, useContext, useState } from 'react';
import { CurrentRefinementsConnectorParamsRefinement } from 'instantsearch.js/es/connectors/current-refinements/connectCurrentRefinements';
import { useClearRefinements, useCurrentRefinements } from 'react-instantsearch';
import { ShippingMethod } from 'types/entity/cart';
import { Category } from 'types/entity/category';
import { Variant } from 'types/entity/product';
import { Wishlist, LineItem as WishlistLineItem } from 'types/entity/wishlist';
import { refinementRemovedEventName, refinementsClearedEventName } from './constants';
import { ProductListContextShape, RefinementRemovedEvent } from './types';
import { FacetConfiguration, PriceConfiguration } from '../types';

export const ProductListContext = createContext<ProductListContextShape>({
  categories: [],
  shippingMethods: [],
  pricesConfiguration: {},
  facetsConfiguration: {},
  numericRanges: {},
  updateNumericRange() {},
  removeRefinement() {},
  removeAllRefinements() {},
});

interface ProductListProviderProps {
  searchQuery?: string;
  categories: Category[];
  shippingMethods?: ShippingMethod[];
  pricesConfiguration: Record<string, PriceConfiguration>;
  facetsConfiguration: Record<string, FacetConfiguration>;
  wishlist?: Wishlist;
  addToWishlist?: (lineItem: WishlistLineItem, count: number) => Promise<void>;
  removeFromWishlist?: (item: WishlistLineItem) => Promise<void>;
  onAddToCart?: (variant: Variant, quantity: number) => Promise<void>;
}

const ProductListProvider = ({
  children,
  searchQuery,
  categories,
  shippingMethods,
  pricesConfiguration,
  facetsConfiguration,
  wishlist,
  addToWishlist,
  removeFromWishlist,
  onAddToCart,
}: React.PropsWithChildren<ProductListProviderProps>) => {
  const [numericRanges, setNumericRanges] = useState<Record<string, [number, number]>>({});

  const { items, refine } = useCurrentRefinements();
  const { refine: clearAllRefinements } = useClearRefinements();

  const updateNumericRange = useCallback((attribute: string, range: [number, number]) => {
    setNumericRanges((numericRanges) => ({ ...numericRanges, [attribute]: range }));
  }, []);

  const removeNumericRefinement = useCallback(
    (refinement: CurrentRefinementsConnectorParamsRefinement) => {
      items.forEach((item) => {
        item.refinements.forEach((r) => {
          if (r.attribute === refinement.attribute) refine(r);
        });
      });
    },
    [items, refine],
  );

  const removeRefinement = useCallback(
    (refinement: CurrentRefinementsConnectorParamsRefinement) => {
      if (refinement.type === 'numeric') removeNumericRefinement(refinement);
      else refine(refinement);

      window.dispatchEvent(
        new CustomEvent<RefinementRemovedEvent>(refinementRemovedEventName, {
          detail: { attribute: refinement.attribute },
        }),
      );
    },
    [refine, removeNumericRefinement],
  );

  const removeAllRefinements = useCallback(() => {
    clearAllRefinements();

    window.dispatchEvent(new CustomEvent(refinementsClearedEventName));
  }, [clearAllRefinements]);

  return (
    <ProductListContext.Provider
      value={{
        searchQuery,
        categories,
        shippingMethods,
        facetsConfiguration,
        pricesConfiguration,
        numericRanges,
        wishlist,
        updateNumericRange,
        removeRefinement,
        removeAllRefinements,
        onAddToCart,
        addToWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </ProductListContext.Provider>
  );
};

export default ProductListProvider;

export const useProductList = () => useContext(ProductListContext);
