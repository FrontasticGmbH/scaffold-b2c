import React from 'react';
import { useHits } from 'react-instantsearch';
import { useTranslations } from 'use-intl';

interface Props {
  query: string;
}

const SearchHeader: React.FC<Props> = ({ query }) => {
  const translate = useTranslations();

  const { results } = useHits();

  if (!query) return <></>;

  return (
    <div>
      <h1 className="font-body text-18 md:text-26 lg:text-28">
        {/* eslint-disable-next-line react/jsx-no-literals */}
        {translate('product.search-results-for')} <span className="font-medium">“{query}”</span>
      </h1>
      <h4 className="mt-24 font-body text-14 md:text-16">
        {translate('product.found-products', {
          count: results?.nbHits ?? 0,
        })}
      </h4>
    </div>
  );
};

export default SearchHeader;
