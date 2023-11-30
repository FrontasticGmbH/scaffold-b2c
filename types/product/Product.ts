import { Variant } from './Variant';
import { Category } from './Category';

export interface Product {
  productId?: string;
  changed?: Date;
  version?: string;
  name?: string;
  slug?: string;
  description?: string;
  categories?: Category[];
  variants: Variant[];
  _url?: string;
}
