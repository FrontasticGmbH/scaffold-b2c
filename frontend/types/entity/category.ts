export interface Category {
  categoryId?: string;
  categoryKey?: string;
  categoryRef?: string;
  name?: string;
  depth?: number;
  _url?: string;
  _urls: Record<string, string>;
  slug?: string;
  parentId?: string;
  parentKey?: string;
  parentRef?: string;
  descendants?: Category[];
}
