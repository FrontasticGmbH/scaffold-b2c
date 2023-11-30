import { TasticConfiguration } from '@frontastic/extension-types';
import { Category } from 'shared/types/product';
import { Params, SearchParams } from 'types/next';

export interface TasticProps<T = object> {
  data: T & TasticConfiguration;
  params: Params;
  searchParams: SearchParams;
  categories: Category[];
  [key: string]: unknown;
}

export interface TasticRegistry {
  [key: string]: (props: TasticProps) => JSX.Element | Promise<JSX.Element>;
}
