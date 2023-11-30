import React from 'react';
import { useHits } from 'react-instantsearch-hooks';
import { useFormat } from 'helpers/hooks/useFormat';

interface Props {
  query: string;
}

const SearchHeader: React.FC<Props> = ({ query }) => {
  const { formatMessage: formatProductMessage } = useFormat({ name: 'product' });

  const { results } = useHits();

  if (!query) return <></>;

  return (
    <div>
      <h1 className="font-body text-18 md:text-26 lg:text-28">
        {formatProductMessage({
          id: 'search.results.for',
          defaultMessage: 'Search results for',
        })}{' '}
        <span className="font-medium">“{query}”</span>
      </h1>
      <h4 className="mt-24 font-body text-14 md:text-16">
        {formatProductMessage({
          id: 'found.products',
          defaultMessage: 'We found {count} products',
          values: { count: results?.nbHits ?? 0 },
        })}
      </h4>
    </div>
  );
};

export default SearchHeader;
