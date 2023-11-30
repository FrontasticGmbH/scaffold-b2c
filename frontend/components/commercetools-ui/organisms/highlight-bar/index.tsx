import React from 'react';

const HighlightBar = ({ children }: React.PropsWithChildren) => {
  return (
    <>
      {/* eslint-disable-next-line */}
      <div className="mt-5 flex flex-col divide-y divide-solid divide-gray-200 border-solid py-0 shadow-[0_-1px_10px_#f7f7f7] lg:mt-0 lg:flex-row lg:divide-x lg:divide-y-0 lg:py-5 lg:shadow-none">
        {children}
      </div>
    </>
  );
};

export default HighlightBar;
