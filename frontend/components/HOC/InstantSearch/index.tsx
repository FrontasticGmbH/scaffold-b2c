import React from 'react';
import {
  InstantSearch as ReactInstantSearch,
  InstantSearchProps as ReactInstantSearchProps,
} from 'react-instantsearch-hooks';
import { searchClient } from 'algolia/searchClient';
import InsightsMiddleware from './middlewares/InsightsMiddleware';

const InstantSearch: React.FC<Partial<ReactInstantSearchProps>> = ({ indexName, children, ...props }) => (
  <ReactInstantSearch searchClient={searchClient} indexName={indexName as string} {...props}>
    <InsightsMiddleware />
    {children}
  </ReactInstantSearch>
);

export default InstantSearch;
