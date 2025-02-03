import { useCallback } from 'react';
import { SLIDER_PRODUCT_CLICKED } from 'helpers/constants/events';
import { Product } from 'types/entity/product';

const useTrack = () => {
  const trackClick = useCallback(async (product: Product, position: number) => {
    gtag('event', SLIDER_PRODUCT_CLICKED, { ...product, position });
  }, []);

  return { trackClick };
};

export default useTrack;
