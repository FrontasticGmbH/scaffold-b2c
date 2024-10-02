import React from 'react';
import { useRefinementList } from 'react-instantsearch';
import Checkbox from 'components/commercetools-ui/atoms/checkbox';
import { FacetProps } from './types';
import useRefinementHelpers from '../../hooks/useRefinementHelpers';

const TermFacet: React.FC<FacetProps> = ({ attribute }) => {
  const { refine, items } = useRefinementList({ attribute });

  const { resolveLabel } = useRefinementHelpers();

  return (
    <div>
      <div className="flex flex-col gap-47 py-22 lg:min-w-340">
        {items.map((term) => (
          <div key={term.value} className="flex items-center justify-between gap-8">
            <div>{resolveLabel(attribute, term.label)}</div>
            <div className="flex items-center gap-12">
              <Checkbox
                checked={term.isRefined}
                onChange={() => refine(term.value)}
                label={term.count.toString()}
                labelPosition="on-left"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TermFacet;
