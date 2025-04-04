import React, { useMemo } from 'react';
import { useHits } from 'react-instantsearch';
import { useTranslations } from 'use-intl';
import Link from 'components/commercetools-ui/atoms/link';
import Breadcrumb from 'components/commercetools-ui/molecules/breadcrumb';
import usePath from 'helpers/hooks/usePath';
import { Category } from 'types/entity/category';

interface Props {
  categoryId?: string;
  categories: Category[];
}

const Breadcrumbs: React.FC<Props> = ({ categoryId, categories }) => {
  const translate = useTranslations();

  const { results } = useHits();

  const { pathWithoutQuery } = usePath();

  const ancestorCategories = useMemo(() => {
    const categoryIdChunks = pathWithoutQuery.slice(1).split('/').filter(Boolean).slice(0, -1);

    return categoryIdChunks.map(
      (id) => (categories.find((category) => [category.categoryId, category.slug].includes(id)) ?? {}) as Category,
    );
  }, [pathWithoutQuery, categories]);

  const currentCategory = useMemo(() => {
    return (categories.find((category) => category.categoryId === categoryId) ?? {}) as Category;
  }, [categories, categoryId]);

  const parentCategory = useMemo(() => {
    return categories.find((c) => c.categoryId === currentCategory.parentId);
  }, [categories, currentCategory]);

  const descendants = useMemo(() => {
    return ((categories.find((category) => category.categoryId === categoryId) as Category)?.descendants ??
      []) as Category[];
  }, [categories, categoryId]);

  const siblingCategories = useMemo(() => {
    return parentCategory?.descendants ?? [];
  }, [parentCategory]);

  if (!categoryId) return <></>;

  return (
    <div className="flex flex-col items-center">
      <Breadcrumb Separator="/">
        {ancestorCategories.map((category) => (
          <Link key={category.categoryId} link={category._url} className="text-12">
            {category.name}
          </Link>
        ))}

        {currentCategory && (
          <Link key={currentCategory.categoryId} link={currentCategory._url} className="text-12">
            {currentCategory.name}
          </Link>
        )}
      </Breadcrumb>
      <h1 className="mt-20 text-22 leading-[35px] md:text-26 lg:text-28">{currentCategory.name}</h1>
      <h6 className="text-14 text-gray-600">
        {results?.nbHits ?? 0} {translate('product.items')}
      </h6>
      {descendants.length > 0 && (
        <Breadcrumb className="mx-auto mt-32 py-6 lg:py-8" listClassName="gap-x-8">
          <Link
            link={currentCategory._url}
            className="rounded-md border border-gray-700 bg-gray-700 px-16 py-8 text-12 leading-[16px] text-white lg:text-16"
          >
            {translate('product.items-all')}
          </Link>
          {descendants.map((category) => (
            <Link
              key={category.categoryId}
              link={category._url}
              className="rounded-md border border-gray-700 bg-transparent px-16 py-8 text-12 leading-[16px] text-primary transition hover:bg-gray-700 hover:text-white lg:text-16"
            >
              {category.name}
            </Link>
          ))}
        </Breadcrumb>
      )}

      {descendants.length === 0 && siblingCategories.length > 0 && (
        <Breadcrumb className="mx-auto mt-32 py-6 lg:py-8" listClassName="gap-x-8">
          <Link
            link={parentCategory?._url}
            className="rounded-md border border-gray-700 bg-transparent px-16 py-8 text-12 leading-[16px] text-primary transition hover:bg-gray-700 hover:text-white lg:text-16"
          >
            {translate('product.items-all')}
          </Link>
          {siblingCategories.map((category) => (
            <Link
              key={category.categoryId}
              link={category._url}
              className={`rounded-md border border-gray-700 px-16 py-8 text-12 leading-[16px] transition lg:text-16 ${
                category.categoryId === currentCategory.categoryId
                  ? 'bg-gray-700 text-white'
                  : 'bg-transparent text-primary hover:bg-gray-700 hover:text-white'
              }`}
            >
              {category.name}
            </Link>
          ))}
        </Breadcrumb>
      )}
    </div>
  );
};

export default Breadcrumbs;
