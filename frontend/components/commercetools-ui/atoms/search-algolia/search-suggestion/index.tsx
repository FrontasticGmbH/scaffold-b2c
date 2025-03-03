import React, { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon as SearchIcon } from '@heroicons/react/24/outline';
import { Hit } from 'instantsearch.js';
import { Highlight } from 'react-instantsearch';
import { useLocalizedIndex } from 'providers/algolia/localized-index';
import { Category } from 'types/entity/category';
import Link from '../../link';

export interface Props {
  hit: Hit<
    {
      query: string;
    } & {
      [key: string]: {
        exact_nb_hits: number;
        facets: {
          exact_matches: {
            [key: string]: [
              {
                value: string;
                count: number;
              },
            ];
          };
        };
      };
    }
  >;
  categories: Category[];
  onClick?: () => void;
}

const SearchSuggestion: React.FC<Props> = ({ hit, categories, onClick }) => {
  const router = useRouter();

  const { indexName: productsIndex } = useLocalizedIndex({ type: 'products' });

  const categoryOptions = useMemo(() => {
    if (!hit[productsIndex]) return [];

    return hit[productsIndex].facets.exact_matches['categories.id']
      .map(({ value }) => categories.find((category) => category.categoryId === value) as Category)
      .filter(Boolean);
  }, [hit, categories, productsIndex]);

  const handleQuerySuggestionClick = useCallback(() => {
    onClick?.();

    router.push(`/search?query=${hit.query}`);
  }, [router, hit, onClick]);

  const handleCategoryOptionClick = useCallback(
    ({ _url }: Partial<Category>) => {
      onClick?.();

      router.push(`${_url}?query=${hit.query}`);
    },
    [router, hit, onClick],
  );

  return (
    <div className="flex items-start gap-28">
      <SearchIcon className="size-24 stroke-gray-600" />
      <div className="flex flex-col gap-24">
        <Link link={`/search?query=${hit.query}`} onMouseUp={handleQuerySuggestionClick}>
          <Highlight
            hit={hit}
            attribute="query"
            nonHighlightedTagName="b"
            highlightedTagName="span"
            classNames={{ nonHighlighted: 'font-semibold' }}
          />
        </Link>
        {categoryOptions.map(({ categoryId, name, _url }) => (
          <Link
            key={categoryId}
            link={`${_url}?query=${hit.query}`}
            onMouseUp={() => handleCategoryOptionClick({ _url })}
          >
            <i className="text-gray-600">In {name}</i>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SearchSuggestion;
