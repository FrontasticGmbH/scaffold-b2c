import React, { useCallback, useEffect } from 'react';

const useResizeObserver = (
  ref: React.RefObject<HTMLElement | null>,
  callback: (entry?: ResizeObserverEntry) => void,
  cleanup?: () => void,
) => {
  const resizeCallback = useCallback(
    (entries: ResizeObserverEntry[]) => {
      callback(entries[0]);
    },
    [callback],
  );

  useEffect(() => {
    callback();
    const observer = new ResizeObserver(resizeCallback);

    if (ref.current) observer.observe(ref.current);

    return () => {
      observer.disconnect();
      cleanup?.();
    };
  }, [ref, callback, resizeCallback, cleanup]);
};

export default useResizeObserver;
