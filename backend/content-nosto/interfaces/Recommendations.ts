import { NostoProduct } from './NostoProduct';

export interface Recommendations {
  divId: string;
  resultId: string;
  primary: NostoProduct[];
}
