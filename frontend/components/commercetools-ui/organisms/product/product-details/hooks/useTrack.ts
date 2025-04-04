'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { trackEvent } from 'helpers/analytics';
import {
  PDP_PRODUCT_ADDED_TO_CART,
  QUICK_VIEW_PRODUCT_ADDED_TO_CART,
  PDP_VIEWED,
  PDP_VIEWED_AFTER_SEARCH,
  QUICK_VIEW_PRODUCT_ADDED_TO_CART_AFTER_SEARCH,
  PDP_PRODUCT_ADDED_TO_CART_AFTER_SEARCH,
} from 'helpers/constants/events';
import { Product } from 'types/entity/product';

interface Options {
  product: Product;
  inModalVersion?: boolean;
}

const useTrack = ({ product, inModalVersion }: Options) => {
  const searchParams = useSearchParams();

  const isAfterSearch = searchParams.get('sr');

  const lastProductId = useRef<string>(undefined);

  const trackView = useCallback(async () => {
    if (product && product.productId !== lastProductId.current) {
      trackEvent(isAfterSearch ? PDP_VIEWED_AFTER_SEARCH : PDP_VIEWED, { product });

      lastProductId.current = product.productId;
    }
  }, [product, isAfterSearch]);

  useEffect(() => {
    trackView();
  }, [trackView]);

  const trackAddToCart = useCallback(async () => {
    if (inModalVersion) {
      const eventName = isAfterSearch
        ? QUICK_VIEW_PRODUCT_ADDED_TO_CART_AFTER_SEARCH
        : QUICK_VIEW_PRODUCT_ADDED_TO_CART;

      trackEvent(eventName, product);
    } else {
      const eventName = isAfterSearch ? PDP_PRODUCT_ADDED_TO_CART_AFTER_SEARCH : PDP_PRODUCT_ADDED_TO_CART;
      trackEvent(eventName, product);
    }
  }, [product, isAfterSearch, inModalVersion]);

  return { trackAddToCart };
};

export default useTrack;
