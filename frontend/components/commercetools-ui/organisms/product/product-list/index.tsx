import React, { useMemo } from 'react';
import Wrapper from 'components/HOC/wrapper';
import { Cart } from 'types/entity/cart';
import { Product } from 'types/entity/product';
import AccumalativeTrace from './components/accumalative-trace';
import Breadcrumbs from './components/breadcrumb';
import CurrentRefinements from './components/current-refinements';
import DesktopFacets from './components/desktop-facets';
import List from './components/list';
import MobileFacets from './components/mobile-facets';
import SearchHeader from './components/search-header';
import { useProductList } from './context';

export interface ProductListProps {
  products: Product[];
  cart?: Cart;
}

const ProductList: React.FC<ProductListProps> = ({ products, cart }) => {
  const { slug, searchQuery, categories } = useProductList();

  const category = useMemo(() => categories.find((category) => category.slug === slug), [categories, slug]);

  return (
    <div className="min-h-screen bg-neutral-200 py-48">
      {searchQuery ? (
        <Wrapper background="neutral-200">
          <SearchHeader query={searchQuery ?? ''} />
        </Wrapper>
      ) : (
        <Breadcrumbs categories={categories} categoryId={category?.categoryId} />
      )}

      <Wrapper className="relative" background="neutral-200">
        <MobileFacets />
        <DesktopFacets />

        <CurrentRefinements />

        <List products={products} cart={cart} />

        <AccumalativeTrace currentItems={products.length} />
      </Wrapper>
    </div>
  );
};

export default ProductList;
