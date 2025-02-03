import { PageResponse } from '@commercetools/frontend-sdk/lib/types/api/page';
import { Category } from 'shared/types/product';
import { Params, SearchParams } from 'types/next';

export interface RendererProps {
  data: PageResponse;
  params: Params;
  searchParams: SearchParams;
  gridClassName?: string;
  wrapperClassName?: string;
  currentHighlight?: string;
  categories: Category[];
  flattenedCategories: Category[];
}
