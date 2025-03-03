import { useCallback, useEffect, useRef } from 'react';

export function useFocusOutside(onTrigger: () => void) {
  const ref = useRef<HTMLDivElement>(null);

  const handleTrigger = useCallback(() => {
    if (!ref.current?.contains(document.activeElement)) onTrigger();
  }, [onTrigger]);

  useEffect(() => {
    document.addEventListener('focus', handleTrigger, true);
    return () => document.removeEventListener('focus', handleTrigger, true);
  }, [handleTrigger]);

  return { ref };
}
