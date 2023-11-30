import { useCallback, useEffect, useState } from 'react';
import useWindowLoaded from './useWindowLoaded';

const usePreloadImages = (sources: string[], suffix?: string) => {
  const [preloaded, setPreloaded] = useState(false);

  const windowLoaded = useWindowLoaded();

  const preloadImages = useCallback(() => {
    setPreloaded(false);

    for (const source of sources) {
      if (suffix) {
        const dotIndex = source.lastIndexOf('.');
        new Image().src = source.substring(0, dotIndex) + '-' + suffix + source.substring(dotIndex, source.length);
      } else {
        new Image().src = source;
      }
    }

    setPreloaded(true);
  }, [sources, suffix]);

  useEffect(() => {
    if (windowLoaded) preloadImages();
  }, [windowLoaded, preloadImages]);

  return { preloaded };
};

export default usePreloadImages;
