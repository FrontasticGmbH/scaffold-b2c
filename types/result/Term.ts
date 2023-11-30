export interface Term {
  identifier: string;
  label?: string;
  key?: string; // 'key' is used to identify the term in the frontend regardless the language.
  count?: number;
  selected?: boolean;
}
