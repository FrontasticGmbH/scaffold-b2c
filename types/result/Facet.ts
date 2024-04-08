export enum FacetTypes {
  BOOLEAN = 'boolean',
  TERM = 'term',
  RANGE = 'range',
}

export interface Facet {
  type: FacetTypes.BOOLEAN | FacetTypes.TERM | FacetTypes.RANGE;
  identifier: string;
  label: string;
  key: string; // 'key' is used to identify the facet in the frontend regardless the language.
  count?: number;
  selected?: boolean;
}
