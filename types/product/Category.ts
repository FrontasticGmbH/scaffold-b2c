import { LocalizedString } from '../query';

export interface Category {
  categoryId?: string;
  categoryKey?: string;
  categoryRef?: string;
  name?: string;
  depth?: number;
  slug?: string;
  parentId?: string;
  parentKey?: string;
  parentRef?: string;
  descendants?: Category[];
  _url?: LocalizedString;
}
