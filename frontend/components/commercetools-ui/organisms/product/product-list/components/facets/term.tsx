import React, { useMemo } from 'react';
import Checkbox from 'components/commercetools-ui/atoms/checkbox';
import { FacetProps } from './types';
import { useProductList } from '../../context';
import { TermFacet } from '../../types';

const TermFacet: React.FC<FacetProps> = ({ attribute }) => {
  const { facetsConfiguration, refine } = useProductList();

  const facet = useMemo(() => facetsConfiguration[attribute] as TermFacet, [facetsConfiguration, attribute]);

  return (
    <div className="flex flex-col gap-47 py-22 lg:min-w-[340px]">
      {facet.terms.map((term) => (
        <div key={term.identifier} className="flex items-center justify-between gap-8">
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
  );
};

export default TermFacet;
