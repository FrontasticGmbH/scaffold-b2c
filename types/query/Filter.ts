export enum FilterTypes {
  BOOLEAN = 'boolean',
  ENUM = 'enum',
  RANGE = 'range',
  TERM = 'term',
}

export interface Filter {
  type: FilterTypes.BOOLEAN | FilterTypes.ENUM | FilterTypes.RANGE | FilterTypes.TERM;
  identifier: string;
}
