import { Category } from 'shared/types/product';
import { Category as EntityCategory } from 'types/entity/category';

export const mapCategotry = (category: Category, { locale = 'en' }: { locale?: string } = {}): EntityCategory => {
  const localeMapping = { en: 'en-US', de: 'de-DE' };

  return {
    ...category,
    _urls: Object.fromEntries(Object.entries(category._url ?? {}).map(([key, value]) => [key.split('-')[0], value])),
    _url: (category._url ?? {})[localeMapping[locale as keyof typeof localeMapping]],
    descendants: (category.descendants ?? []).map((subCategory) => mapCategotry(subCategory, { locale })),
  };
};
