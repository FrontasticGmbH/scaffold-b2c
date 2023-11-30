import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Transition } from '@headlessui/react';
import { MagnifyingGlassIcon as SearchIcon, XMarkIcon as CloseIcon } from '@heroicons/react/24/solid';
import debounce from 'lodash.debounce';
import { Category } from 'shared/types/product/Category';
import { Product } from 'shared/types/product/Product';
import { useFormat } from 'helpers/hooks/useFormat';
import useScrollBlock from 'helpers/hooks/useScrollBlock';
import { useProduct } from 'frontastic';
import SearchItem from './search-item';
import Overlay from '../overlay';

interface Props {
  categories: Category[];
}

const Search: React.FC<Props> = ({ categories }) => {
  const form = useRef<HTMLFormElement>(null);
  const input = useRef<HTMLInputElement>(null);

  const { query: queryProducts } = useProduct();

  const [items, setItems] = useState<Product[]>([]);

  const [focused, setFocused] = useState(false);

  const onFocus = useCallback(() => setFocused(true), []);
  const onBlur = useCallback(() => setFocused(false), []);

  const { formatMessage } = useFormat({ name: 'common' });

  const { blockScroll } = useScrollBlock();

  const router = useRouter();

  const [value, setValue] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    blockScroll(focused);
  }, [blockScroll, focused]);

  const fetchResults = useCallback(async () => {
    const results = await queryProducts({ query, limit: 6 });

    if (results.isError) return;

    setItems((results.data.items as Product[]) ?? []);
  }, [query, queryProducts]);

  //eslint-disable-next-line react-hooks/exhaustive-deps
  const updateQuery = useCallback(
    debounce((value: string) => setQuery(value), 150),
    [],
  );

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      updateQuery(e.target.value);
    },
    [updateQuery],
  );

  const cleanUp = useCallback(() => {
    updateQuery('');
    setValue('');
  }, [updateQuery]);

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (!value) return;

      router.push(`/search?query=${value}`);
      input.current?.blur();
    },
    [value, router],
  );

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  return (
    <>
      {focused && <Overlay />}

      <div className="relative z-[350] xl:px-20">
        <div
          className={`relative z-50 border-neutral-400 bg-white lg:rounded-sm lg:border ${
            focused ? 'border-b' : 'border'
          }`}
        >
          <form className="quick-search relative flex w-full items-stretch" ref={form} onSubmit={onSubmit}>
            <input
              ref={input}
              className="box-content grow border-none p-0 px-12 py-10 transition placeholder:text-14 placeholder:text-secondary-black focus:outline-none"
              value={value}
              onChange={onChange}
              onFocus={onFocus}
              onBlur={onBlur}
              placeholder={`${formatMessage({ id: 'search.placeholder', defaultMessage: 'Type to search' })}...`}
            />
            <button
              type="submit"
              title={formatMessage({ id: 'search', defaultMessage: 'Search' })}
              className={`shrink-0 border-l border-neutral-400 px-16 py-10 transition ${
                focused ? 'bg-primary-black' : 'bg-white'
              }`}
            >
              <SearchIcon className={`h-24 w-24 stroke-0 ${focused ? 'fill-white' : 'fill-secondary-black'}`} />
            </button>
            {value && (
              <button
                type="reset"
                className="absolute right-[70px] top-1/2 block -translate-y-1/2"
                onClick={cleanUp}
                onMouseDown={(e) => e.preventDefault()}
              >
                <CloseIcon className="w-24 fill-primary-black" />
              </button>
            )}
          </form>
        </div>

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
          <div className="grid grid-cols-1 gap-30 md:grid-cols-2">
            {items.slice(0, 6).map((item) => (
              <SearchItem key={item.productId} hit={item} categories={categories} />
            ))}
          </div>
        </Transition>
      </div>
    </>
  );
};

export default Search;
