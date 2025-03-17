import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Transition } from '@headlessui/react';
import { MagnifyingGlassIcon as SearchIcon, XMarkIcon as CloseIcon } from '@heroicons/react/24/solid';
import { useTranslations } from 'use-intl';
import useScrollBlock from 'helpers/hooks/useScrollBlock';
import { useRouter } from 'i18n/routing';
import { Category } from 'types/entity/category';
import { Product } from 'types/entity/product';
import SearchItem from './search-item';
import Overlay from '../overlay';

interface Props {
  categories: Category[];
  items: Product[];
  onQueryUpdate?: (query: string) => void;
}

const Search: React.FC<Props> = ({ categories, items, onQueryUpdate }) => {
  const router = useRouter();

  const translate = useTranslations();

  const form = useRef<HTMLFormElement>(null);
  const input = useRef<HTMLInputElement>(null);

  const [value, setValue] = useState('');

  const [focused, setFocused] = useState(false);

  const onFocus = useCallback(() => setFocused(true), []);
  const onBlur = useCallback(() => setFocused(false), []);

  const { blockScroll } = useScrollBlock();

  useEffect(() => {
    blockScroll(focused);
  }, [blockScroll, focused]);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      onQueryUpdate?.(e.target.value);
    },
    [onQueryUpdate],
  );

  const cleanUp = useCallback(() => {
    onQueryUpdate?.('');
    setValue('');
  }, [onQueryUpdate]);

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (!value) return;

      router.push(`/search?query=${value}`);
      input.current?.blur();
    },
    [value, router],
  );

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
              title={translate('common.type-search-term')}
              aria-label={translate('common.type-search-term')}
              className="box-content grow border-none p-0 px-12 py-10 transition placeholder:text-14 placeholder:text-gray-600 focus:outline-none"
              value={value}
              onChange={onChange}
              onFocus={onFocus}
              onBlur={onBlur}
              placeholder={`${translate('common.search-placeholder')}...`}
            />
            <button
              data-testid="submit-button"
              type="submit"
              title={translate('common.click-to-search')}
              aria-label={translate('common.click-to-search')}
              className={`shrink-0 border-l border-neutral-400 px-16 py-10 transition ${
                focused ? 'bg-primary' : 'bg-white'
              }`}
            >
              <SearchIcon className={`size-24 stroke-0 ${focused ? 'fill-white' : 'fill-gray-600'}`} />
            </button>
            {value && (
              <button
                data-testid="reset-button"
                type="reset"
                className="absolute right-70 top-1/2 block -translate-y-1/2"
                onClick={cleanUp}
                onMouseDown={(e) => e.preventDefault()}
              >
                <CloseIcon className="w-24 fill-primary" />
              </button>
            )}
          </form>
        </div>

        <Transition
          as="div"
          show={focused}
          className="absolute bottom-0 left-0 max-h-[60vh] w-full translate-y-full overflow-auto bg-white px-20 py-28 xl:max-h-[unset] xl:translate-y-[calc(100%-56px)] xl:rounded-md xl:pt-84"
          enter="transition duration-75"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div data-testid="search-panel" className="grid grid-cols-1 gap-30 md:grid-cols-2">
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
