import React from 'react';
import { InfoBannerProps } from './types';
import useClassNames from './hooks/useClassNames';
import { classnames } from 'helpers/utils/classnames';

const InfoBanner = ({ children, className, variant = 'primary' }: React.PropsWithChildren<InfoBannerProps>) => {
  const { bannerClassName, sidebarClassName } = useClassNames({ variant });

  return (
    <div className={classnames(bannerClassName, className)}>
      <span className={sidebarClassName} />
      <div className="p-16 text-14 text-gray-600">{children}</div>
    </div>
  );
};

export default InfoBanner;
