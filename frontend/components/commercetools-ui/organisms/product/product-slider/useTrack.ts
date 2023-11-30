import { useCallback } from 'react';
import { Product } from 'shared/types/product/Product';
import { SLIDER_PRODUCT_CLICKED } from 'helpers/constants/events';

const useTrack = () => {
  const trackClick = useCallback(async (product: Product, position: number) => {
    gtag('event', SLIDER_PRODUCT_CLICKED, { ...product, position });
  }, []);

  return { trackClick };
};

export default useTrack;
