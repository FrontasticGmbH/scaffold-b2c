import { Tastic } from '@frontastic/extension-types';
import { Category } from 'shared/types/product';
import { Params, SearchParams } from 'types/next';
import { DataSources } from 'frontastic/lib/types';

export type TasticWrapperProps = {
  dataSources: DataSources | null;
  data: Tastic;
  params: Params;
  searchParams: SearchParams;
  isHighlighted?: boolean;
  categories: Category[];
  flattenedCategories: Category[];
};
