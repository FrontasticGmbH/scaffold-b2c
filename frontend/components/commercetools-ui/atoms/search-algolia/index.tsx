import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Transition } from '@headlessui/react';
import { Hits, Configure, SearchBox } from 'react-instantsearch-hooks-web';
import { Category } from 'shared/types/product/Category';
import InstantSearch from 'components/HOC/InstantSearch';
import GoogleAnalyticsMiddleware from 'components/HOC/InstantSearch/middlewares/GoogleAnalyticsMiddleware';
import { mapProduct } from 'helpers/algolia/map-product';
import { useFormat } from 'helpers/hooks/useFormat';
import useMediaQuery from 'helpers/hooks/useMediaQuery';
import useScrollBlock from 'helpers/hooks/useScrollBlock';
import { mediumDesktop } from 'helpers/utils/screensizes';
import LocalizedIndex from 'providers/algolia/localized-index';
import SearchItem from './search-item';
import SearchSuggestion, { Props as SearchSuggestionProps } from './search-suggestion';
import Overlay from '../overlay';

interface Props {
  categories: Category[];
}

const Search: React.FC<Props> = ({ categories }) => {
  const { locale } = useParams();

  const form = useRef<HTMLFormElement>(null);

  const [focused, setFocused] = useState(false);

  const onFocus = useCallback(() => setFocused(true), []);
  const onBlur = useCallback(() => setFocused(false), []);

  const { formatMessage } = useFormat({ name: 'common' });

  const { blockScroll } = useScrollBlock();

  const [isDesktop] = useMediaQuery(mediumDesktop);

  const router = useRouter();

  const [query, setQuery] = useState('');

  useEffect(() => {
    blockScroll(focused);
  }, [blockScroll, focused]);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value), []);

  const cleanUp = useCallback(() => {
    setQuery('');
  }, []);

  const onSubmit = useCallback(() => {
    if (!query) return;

    router.push(`/search?query=${query}`);
    cleanUp();
  }, [query, router, cleanUp]);

  return (
    <InstantSearch>
      <GoogleAnalyticsMiddleware />
      <Configure enablePersonalization={!query} />

      {focused && <Overlay />}

      <div className="relative z-[300] xl:px-20">
        <SearchBox
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={`${formatMessage({ id: 'search.placeholder', defaultMessage: 'Type to search' })}...`}
          classNames={{
            root: `relative z-50 bg-white lg:rounded-sm border-neutral-400 lg:border ${
              focused ? 'border-b' : 'border'
            }`,
            form: 'relative flex items-stretch w-full quick-search',
            input:
              'placeholder:text-14 placeholder:text-secondary-black box-content border-none grow focus:outline-none transition p-0 px-12 py-10',
            submit: `border-l transition border-neutral-400 px-16 py-10 shrink-0 ${
              focused ? 'bg-primary-black' : 'bg-white'
            }`,
            submitIcon: `w-18 h-18 stroke-0 ${focused ? 'fill-white' : 'fill-secondary-black'}`,
            reset: 'absolute right-[70px] top-1/2 -translate-y-1/2',
            resetIcon: 'w-10 w-10 fill-primary-black',
            loadingIndicator: 'hidden',
          }}
          onInput={onChange}
          onSubmit={onSubmit}
          formRef={form}
        />

        <Transition
          show={focused}
          className="absolute bottom-0 left-0 max-h-[60vh] w-full translate-y-full overflow-auto bg-white px-20 py-28 xl:max-h-[unset] xl:translate-y-[calc(100%-56px)] xl:rounded-md xl:pt-84"
          enter="transition duration-75"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="flex">
            <LocalizedIndex type="query-suggestions">
              <Configure hitsPerPage={isDesktop ? 3 : 4} />
              <Hits
                hitComponent={({ hit }) => (
                  <SearchSuggestion
                    hit={hit as SearchSuggestionProps['hit']}
                    categories={categories}
                    onClick={cleanUp}
                  />
                )}
                classNames={{
                  root: 'flex-1',
                  list: 'flex flex-col gap-30',
                }}
              />
            </LocalizedIndex>
            {isDesktop && (
              <LocalizedIndex type="products">
                <Configure hitsPerPage={3} />
                <Hits
                  hitComponent={({ hit }) => (
                    <SearchItem
                      hit={{ ...hit, ...mapProduct(hit, locale) }}
                      categories={categories}
                      onClick={cleanUp}
                    />
                  )}
                  classNames={{
                    root: 'flex-1 border-l border-neutral-400 box-border pl-30',
                    list: 'flex flex-col gap-30',
                  }}
                />
              </LocalizedIndex>
            )}
          </div>
        </Transition>
      </div>
    </InstantSearch>
  );
};

export default Search;
