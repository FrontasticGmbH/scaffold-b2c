import React, { FC, ReactNode } from 'react';
import useClassNames from 'helpers/hooks/useClassNames';

export type WrapperBackground = 'white' | 'neutral-200';

export type WrapperProps = {
  children: ReactNode;
  background?: WrapperBackground;
  className?: string;
  clearDefaultStyles?: boolean;
};

const Wrapper: FC<WrapperProps> = ({ children, background = 'white', className, clearDefaultStyles }) => {
  const wrapperClassName = useClassNames(
    clearDefaultStyles ? [className] : [className, 'px-16 md:px-24 lg:px-20 xl:px-48'],
  );

  return (
    <div className={background === 'white' ? 'bg-white' : 'bg-neutral-200'}>
      <div className={wrapperClassName}>{children}</div>
    </div>
  );
};

export default Wrapper;
