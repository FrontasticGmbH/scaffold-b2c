import React, { useMemo } from 'react';
import Link from 'components/commercetools-ui/atoms/link';
import Breadcrumb from 'components/commercetools-ui/molecules/breadcrumb';
import { useFormat } from 'helpers/hooks/useFormat';
import usePath from 'helpers/hooks/usePath';
import { Category } from 'types/entity/category';

interface Props {
  categoryId?: string;
  categories: Category[];
}

const Breadcrumbs: React.FC<Props> = ({ categoryId, categories }) => {
  const { formatMessage: formatProductMessage } = useFormat({ name: 'product' });

  const { path } = usePath();

  const ancestorCategories = useMemo(() => {
    if (!path) return [];

    const categoryIdChunks = path.split('?')[0].slice(1).split('/').filter(Boolean).slice(0, -1);

    return categoryIdChunks.map(
      (id) => (categories.find((category) => [category.categoryId, category.slug].includes(id)) ?? {}) as Category,
    );
  }, [path, categories]);

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
      {descendants.length > 0 && (
        <Breadcrumb className="mx-auto mt-32 py-6 lg:py-8" listClassName="gap-x-8">
          <Link
            link={currentCategory._url}
            className="rounded-md border border-gray-700 bg-gray-700 px-16 py-8 text-12 leading-[16px] text-white lg:text-16"
          >
            {formatProductMessage({ id: 'items.all', defaultMessage: 'All items' })}
          </Link>
          {descendants.map((category) => (
            <Link
              key={category.categoryId}
              link={category._url}
              className="rounded-md border border-gray-700 bg-transparent px-16 py-8 text-12 leading-[16px] text-primary-black transition hover:bg-gray-700 hover:text-white lg:text-16"
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
            className="rounded-md border border-gray-700 bg-transparent px-16 py-8 text-12 leading-[16px] text-primary-black transition hover:bg-gray-700 hover:text-white lg:text-16"
          >
            {formatProductMessage({ id: 'items.all', defaultMessage: 'All items' })}
          </Link>
          {siblingCategories.map((category) => (
            <Link
              key={category.categoryId}
              link={category._url}
              className={`rounded-md border border-gray-700 px-16 py-8 text-12 leading-[16px] transition lg:text-16 ${
                category.categoryId === currentCategory.categoryId
                  ? 'bg-gray-700 text-white'
                  : 'bg-transparent text-primary-black hover:bg-gray-700 hover:text-white'
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
