import React, { useMemo } from 'react';
import { useFormat } from 'helpers/hooks/useFormat';
import { useProductList } from '../../context';

const SortFacet: React.FC = () => {
  const { formatMessage: formatProductMessage } = useFormat({ name: 'product' });

  const { replaceSort, activeSort } = useProductList();

  const options = useMemo<Array<{ label: string; attribute: string; value: 'asc' | 'desc' }>>(() => {
    return [
      {
        label: formatProductMessage({ id: 'price', defaultMessage: 'Price' }),
        attribute: 'price',
        value: 'asc',
      },
      {
        label: formatProductMessage({ id: 'best-selling', defaultMessage: 'Best-Selling' }),
        attribute: 'reviewRatingStatistics.highestRating',
        value: 'desc',
      },
      {
        label: formatProductMessage({ id: 'newest', defaultMessage: 'Newest' }),
        attribute: 'lastModifiedAt',
        value: 'desc',
      },
    ];
  }, [formatProductMessage]);

  return (
    <div>
      {options.map(({ label, attribute, value }) => (
        <div
          key={attribute}
          className={`cursor-pointer p-14 transition hover:bg-neutral-200 ${
            attribute === activeSort?.attribute ? 'bg-neutral-200' : 'bg-transparent'
          }`}
          onClick={() => replaceSort({ attribute, value })}
        >
          {label}
        </div>
      ))}
    </div>
  );
};

export default SortFacet;
