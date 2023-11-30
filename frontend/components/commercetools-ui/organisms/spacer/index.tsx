import React, { useCallback } from 'react';
import useMediaQuery from 'helpers/hooks/useMediaQuery';
import * as screensizes from 'helpers/utils/screensizes';

export interface Props {
  backgroundColor: 'white' | 'neutral-200';
  customMobile: number;
  customTablet: number;
  customDesktop: number;
}

const Spacer: React.FC<Props> = ({ customMobile, customTablet, customDesktop, backgroundColor = 'white' }) => {
  const [isTablet] = useMediaQuery(screensizes.tablet);
  const [isDesktop] = useMediaQuery(screensizes.desktop);

  const getSpacing = useCallback(() => {
    if (isDesktop) return customDesktop;
    if (isTablet) return customTablet;
    return customMobile;
  }, [isTablet, isDesktop, customMobile, customTablet, customDesktop]);

  /* eslint-disable-next-line tailwindcss/no-custom-classname */
  return <div className={`bg-${backgroundColor}`} style={{ height: `${getSpacing() || 0}px` }}></div>;
};

export default Spacer;
