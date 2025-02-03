import { Currency } from '@commercetools/frontend-sdk/lib/types/Currency';

export interface Country {
  name: string;
  code: string;
  states: Array<{ name: string; code: string }>;
  locales: Array<{ name: string; locale: string }>;
  currencies: Currency[];
}
