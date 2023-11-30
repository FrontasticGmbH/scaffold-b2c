import { useCallback, useEffect, useRef, useState } from 'react';

const useScrollDirection = (scrollDownOffset: number, scrollUpOffset: number) => {
  const [scrollDirection, setScrollDirection] = useState<'down' | 'up'>();
  const lastScrollYRef = useRef(0);

  const updateScrollDirection = useCallback(() => {
    const lastScrollY = lastScrollYRef.current;
    const scrollY = window.pageYOffset;
    const direction = scrollY > lastScrollY ? 'down' : 'up';

    if (
      direction !== scrollDirection &&
      (scrollY - lastScrollY > scrollDownOffset || scrollY - lastScrollY < scrollUpOffset)
    ) {
      setScrollDirection(direction);
    }
    lastScrollYRef.current = scrollY > 0 ? scrollY : 0;
  }, [scrollDirection, scrollDownOffset, scrollUpOffset]);

  useEffect(() => {
    window.addEventListener('scroll', updateScrollDirection);
    return () => {
      window.removeEventListener('scroll', updateScrollDirection);
    };
  }, [updateScrollDirection]);

  return scrollDirection;
};

export default useScrollDirection;
