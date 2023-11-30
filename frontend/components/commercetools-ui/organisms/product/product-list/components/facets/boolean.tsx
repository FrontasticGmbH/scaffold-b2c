import React, { useMemo } from 'react';
import Checkbox from 'components/commercetools-ui/atoms/checkbox';
import { FacetProps } from './types';
import { useProductList } from '../../context';
import { BooleanFacet } from '../../types';

const BooleanFacet: React.FC<React.PropsWithChildren<FacetProps>> = ({ attribute }) => {
  const { facetsConfiguration, refine } = useProductList();

  const facet = useMemo(() => facetsConfiguration[attribute] as BooleanFacet, [facetsConfiguration, attribute]);

  return (
    <div>
      <div className="flex flex-col gap-47 py-22 lg:min-w-[340px]">
        {facet.terms
          .filter((term) => term.key === 'T')
          .map((term) => (
            <div key={term.key} className="flex items-center justify-between gap-8">
              <div>{term.label}</div>
              <div className="flex items-center gap-12">
                <Checkbox
                  checked={term.selected}
                  onChange={() => refine(attribute, term.key)}
                  label={term.count ? term.count.toString() : ''}
                  labelPosition="on-left"
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default BooleanFacet;
