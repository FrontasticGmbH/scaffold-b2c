import { useMemo, type JSX } from 'react';
import BooleanFacet from '../components/facets/boolean';
import ColorFacet from '../components/facets/color';
import RangeFacet from '../components/facets/range';
import TermFacet from '../components/facets/term';
import { FacetProps } from '../components/facets/types';
import { FacetConfiguration } from '../types';

interface Options {
  configuration?: Record<string, FacetConfiguration>;
  ordering?: string[];
  render?: (result: { attribute: string; Component: JSX.Element }) => JSX.Element;
}

const useDynamicFacets = ({ configuration, ordering, render }: Options = {}) => {
  const facetMapping = useMemo<Record<FacetConfiguration['type'], React.ComponentType<FacetProps>>>(
    () => ({
      range: RangeFacet,
      color: ColorFacet,
      term: TermFacet,
      boolean: BooleanFacet,
    }),
    [],
  );

  const dynamicFacets = useMemo(() => {
    if (!configuration) return <></>;

    const facets = Object.keys(configuration).map((attribute) => {
      const facet = configuration[attribute];

      if ((facet.type === 'term' || facet.type === 'color' || facet.type === 'boolean') && facet.terms.length === 0)
        return { attribute, Component: <></> };

      const Component = facetMapping[facet.type];
      const FinalComponent = <Component key={attribute} label={facet.label} attribute={attribute} />;

      return {
        attribute,
        Component: render?.({ attribute, Component: FinalComponent }) ?? FinalComponent,
      };
    });

    if (ordering) facets.sort((a, b) => ordering.indexOf(a.attribute) - ordering.indexOf(b.attribute));

    return facets.map((facet) => facet.Component);
  }, [facetMapping, configuration, ordering, render]);

  return dynamicFacets;
};

export default useDynamicFacets;
