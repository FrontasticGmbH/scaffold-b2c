import { PagePreviewResponse } from '@commercetools/frontend-sdk/lib/types/api/page';
import { Category } from 'shared/types/product';
import { Params, SearchParams } from 'types/next';

export interface PreviewRendererProps {
  data: PagePreviewResponse;
  params: Params;
  searchParams: SearchParams;
  categories: Category[];
}
