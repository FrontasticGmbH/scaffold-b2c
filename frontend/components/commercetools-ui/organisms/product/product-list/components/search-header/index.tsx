import React from 'react';
import { useTranslations } from 'use-intl';
import { useProductList } from '../../context';

interface Props {
  query: string;
}

const SearchHeader: React.FC<Props> = ({ query }) => {
  const translate = useTranslations();

  const { totalItems } = useProductList();

  if (!query) return <></>;

  return (
    <div>
      <h1 className="font-body text-18 md:text-26 lg:text-28">
        {/* eslint-disable-next-line react/jsx-no-literals */}
        {translate('product.search-results-for')} <span className="font-medium">“{query}”</span>
      </h1>
      <h4 className="mt-24 font-body text-14 md:text-16">
        {translate('product.found-products', {
          count: totalItems,
        })}
      </h4>
    </div>
  );
};

export default SearchHeader;
