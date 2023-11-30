export enum FilterTypes {
  BOOLEAN = 'boolean',
  TERM = 'term',
  RANGE = 'range',
}

export interface Filter {
  type: FilterTypes.BOOLEAN | FilterTypes.RANGE | FilterTypes.TERM;
  identifier: string;
}
