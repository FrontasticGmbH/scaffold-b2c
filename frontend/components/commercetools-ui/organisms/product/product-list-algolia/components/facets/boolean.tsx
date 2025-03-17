import React from 'react';
import { useRefinementList } from 'react-instantsearch';
import { useTranslations } from 'use-intl';
import Checkbox from 'components/commercetools-ui/atoms/checkbox';
import { FacetProps } from './types';

const BooleanFacet: React.FC<FacetProps> = ({ attribute, label }) => {
  const translate = useTranslations();

  const { items, refine } = useRefinementList({ attribute });

  return (
    <div>
      <div className="flex flex-col gap-47 py-22 lg:min-w-340">
        {items
          .filter((term) => term.value === 'true')
          .map((term) => (
            <div key={term.label} className="flex items-center justify-between gap-8">
              <div>{term.value === 'true' ? label : translate('product.regular')}</div>
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
