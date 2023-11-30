import { useCallback, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { Product } from 'shared/types/product/Product';
import { PRODUCT_VIEWED } from 'helpers/constants/events';

interface Options {
  product: Product;
  algoliaObjectId?: string;
}

const useTrack = ({ product }: Options) => {
  const { ref, inView } = useInView({ threshold: 0.8, triggerOnce: true });

  const trackedView = useRef(false);

  const trackView = useCallback(async () => {
    if (inView && !trackedView.current) {
      gtag('event', PRODUCT_VIEWED, product);

      trackedView.current = true;
    }
  }, [inView, product]);

  useEffect(() => {
    trackView();
  }, [trackView]);

  return { ref, trackView };
};

export default useTrack;
