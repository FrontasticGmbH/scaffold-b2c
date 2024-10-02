import React from 'react';
import { useRefinementList } from 'react-instantsearch';
import Checkbox from 'components/commercetools-ui/atoms/checkbox';
import { useFormat } from 'helpers/hooks/useFormat';
import { FacetProps } from './types';

const BooleanFacet: React.FC<FacetProps> = ({ attribute, label }) => {
  const { formatMessage: formatProductMessage } = useFormat({ name: 'product' });

  const { items, refine } = useRefinementList({ attribute });

  return (
    <div>
      <div className="flex flex-col gap-47 py-22 lg:min-w-340">
        {items
          .filter((term) => term.value === 'true')
          .map((term) => (
            <div key={term.label} className="flex items-center justify-between gap-8">
              <div>
                {term.value === 'true' ? label : formatProductMessage({ id: 'regular', defaultMessage: 'Regular' })}
              </div>
              <div className="flex items-center gap-12">
                <Checkbox
                  checked={term.isRefined}
                  onChange={() => refine(term.value)}
                  label={term.count?.toString()}
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
