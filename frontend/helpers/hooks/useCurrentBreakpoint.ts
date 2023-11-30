import { useEffect, useState } from 'react';
import { breakpoints, CurrentBreakpoint } from 'helpers/utils/breakpoints';

const useCurrentBreakpoint = () => {
  const [width, setWidth] = useState(0);
  const [currentBreakpoint, setCurrentBreakpoint] = useState<CurrentBreakpoint>();

  const updateWidth = () => setWidth(window.innerWidth);

  useEffect(() => {
    updateWidth();
    window.addEventListener('resize', updateWidth);

    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useEffect(() => {
    const breakpoint = breakpoints.find(({ breakpoint }) => width >= breakpoint);
    setCurrentBreakpoint(breakpoint?.value);
  }, [width]);

  return currentBreakpoint;
};

export default useCurrentBreakpoint;
