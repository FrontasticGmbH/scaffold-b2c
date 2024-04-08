import { TaxPortion } from './TaxPortion';
import { Money } from '../product/Money';

export interface Tax {
  netAmount?: Money;
  grossAmount?: Money;
  taxAmount?: Money;
  name?: string;
  taxPortions?: TaxPortion[];
}
