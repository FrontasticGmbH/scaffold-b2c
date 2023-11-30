export interface Facet {
  type: string;
  identifier: string;
  key: string;
  label: string;
  selected: boolean;
}

export interface Term extends Omit<Facet, 'type'> {
  count: number;
}

export interface RangeFacet extends Facet {
  type: 'range';
  min: number;
  max: number;
  minSelected?: number;
  maxSelected?: number;
}

export interface TermFacet extends Facet {
  type: 'term';
  terms: Term[];
}

export interface ColorFacet extends Omit<TermFacet, 'type'> {
  type: 'color';
}

export interface BooleanFacet extends Omit<TermFacet, 'type'> {
  type: 'boolean';
}

export type FacetConfiguration = RangeFacet | TermFacet | ColorFacet | BooleanFacet;

export interface PriceConfigurationRange {
  min: number;
  max: number;
  refinements?: number;
}

export interface PriceConfiguration {
  key: string;
  ranges: PriceConfigurationRange[];
}
