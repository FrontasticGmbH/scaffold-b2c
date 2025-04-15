import { TasticConfiguration } from '@frontastic/extension-types';
import { Category } from 'shared/types/product';
import { Params, SearchParams } from 'types/next';

import type { JSX } from 'react';

export interface TasticProps<T = object> {
  data: T & TasticConfiguration;
  params: Params;
  searchParams: SearchParams;
  categories: Category[];
  flattenedCategories: Category[];
  [key: string]: unknown;
}

export interface TasticRegistry {
  [key: string]: (props: TasticProps) => JSX.Element | Promise<JSX.Element>;
}
