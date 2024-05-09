import React, { useMemo } from 'react';
import { FacetProps } from './types';
import { useProductList } from '../../context';
import { ColorFacet } from '../../types';
import { textToColor } from 'helpers/textToColor/textToColor';

const ColorFacet: React.FC<FacetProps> = ({ attribute }) => {
  const { facetsConfiguration, refine } = useProductList();

  const facet = useMemo(() => facetsConfiguration[attribute] as ColorFacet, [facetsConfiguration, attribute]);

  return (
    <div className="grid grid-cols-3 items-center justify-start gap-x-54 gap-y-36 lg:min-w-[340px]">
      {facet.terms.map(({ identifier, key, label, selected, count }) => (
        <div
          key={identifier}
          className="flex cursor-pointer flex-col items-center text-center"
          onClick={() => refine(attribute, key)}
        >
          <div
            className={`h-40 w-40 rounded-full outline outline-1 outline-offset-1 ${
              selected ? 'outline-gray-500' : 'outline-transparent'
            }`}
            style={{ backgroundColor: textToColor(key) }}
          />
          <span className="mt-4 block max-w-full truncate text-14" title={label}>
            {label}
          </span>
          <span className="mt-2 block text-14 text-secondary-black">{count}</span>
        </div>
      ))}
    </div>
  );
};

export default ColorFacet;
