import React from 'react';
import { useParams } from 'next/navigation';
import { Index } from 'react-instantsearch-hooks';
import {
  productsIndex_DE,
  productsIndex_US,
  productsQuerySuggestionsIndex_DE,
  productsQuerySuggestionsIndex_US,
} from 'helpers/constants/algolia';

interface Props {
  type: 'products' | 'query-suggestions';
}

export const useLocalizedIndex = ({ type }: Props) => {
  const { locale } = useParams();

  const indexes = {
    products: {
      en: productsIndex_US,
      de: productsIndex_DE,
    },
    'query-suggestions': {
      en: productsQuerySuggestionsIndex_US,
      de: productsQuerySuggestionsIndex_DE,
    },
  };

  const indexName = indexes[type][locale as 'en' | 'de'];

  return { indexName };
};

const LocalizedIndex = ({ children, type }: React.PropsWithChildren<Props>) => {
  const { indexName } = useLocalizedIndex({ type });

  return <Index indexName={indexName}>{children}</Index>;
};

export default LocalizedIndex;
