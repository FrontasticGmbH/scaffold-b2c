import React from 'react';
import { useRefinementList } from 'react-instantsearch';
import { textToColor } from 'helpers/textToColor/textToColor';
import { FacetProps } from './types';

const ColorFacet: React.FC<FacetProps> = ({ attribute }) => {
  const { items, refine } = useRefinementList({ attribute });

  return (
    <div className="grid grid-cols-3 items-center justify-start gap-x-54 gap-y-36 lg:min-w-340">
      {items.map(({ value, isRefined, count }) => {
        const color = textToColor(value);
        return (
          <div
            key={value}
            className="flex cursor-pointer flex-col items-center text-center"
            onClick={() => refine(value)}
          >
            <div
              className={`size-40 rounded-full outline outline-1 outline-offset-1 ${
                isRefined ? 'outline-gray-500' : 'outline-transparent'
              }`}
              style={{ backgroundColor: color.code }}
            />
            <span className="mt-4 block max-w-full truncate text-14" title={color.label}>
              {color.label}
            </span>
            <span className="mt-2 block text-14 text-secondary-black">{count}</span>
          </div>
        );
      })}
    </div>
  );
};

export default ColorFacet;
