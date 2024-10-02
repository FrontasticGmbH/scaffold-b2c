import React from 'react';
import { useSortBy, UseSortByProps } from 'react-instantsearch';

const SortFacet: React.FC<UseSortByProps> = (props) => {
  const { currentRefinement, options, refine } = useSortBy(props);

  return (
    <div>
      {options.map(({ label, value }) => (
        <div
          key={value}
          onClick={() => refine(value)}
          className={`cursor-pointer p-14 transition hover:bg-neutral-200 ${
            value === currentRefinement ? 'bg-neutral-200' : 'bg-transparent'
          }`}
        >
          {label}
        </div>
      ))}
    </div>
  );
};

export default SortFacet;
