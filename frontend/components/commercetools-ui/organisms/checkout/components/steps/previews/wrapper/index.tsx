import React from 'react';

interface Props {
  className?: string;
}

const Preview = ({ children, className }: React.PropsWithChildren<Props>) => {
  return (
    /*eslint-disable-next-line tailwindcss/no-custom-classname */
    <div
      className={`border-x border-b border-neutral-400 px-20 py-16 md:py-24 lg:border-[1px_0_0_0] lg:px-36 ${className}`}
    >
      {children}
    </div>
  );
};

export default Preview;
