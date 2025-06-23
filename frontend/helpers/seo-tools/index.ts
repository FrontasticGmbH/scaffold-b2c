import { PageResponse } from '@commercetools/frontend-sdk';
import { Product } from 'shared/types/product';
import { ProductPaginatedResult } from 'shared/types/result';
import { Params } from 'types/next';

export const getSeoInfoFromPageResponse = (response: PageResponse, params: Params) => {
  let seoTitle: string | undefined;
  let seoDescription: string | undefined;
  const seoKeywords: (string | undefined)[] = [];

  /* Category Page (PLP) */
  switch (response.pageFolder.pageFolderType) {
    case 'frontastic/category':
      const categoryName = (params.slug.at(-1) ?? '')
        .split('_')
        .map((word) => word.slice(0, 1).toUpperCase() + word.slice(1))
        .join(' ');

      seoTitle = categoryName;

      seoKeywords.push(categoryName);
      break;
    case 'frontastic/product-detail-page':
      const productData = (response.data.dataSources.__master as unknown as { product: Product }).product;
      seoTitle = productData.metaTitle || productData.name;
      seoDescription = productData.metaDescription || productData.description;

      if (productData.metaKeywords) {
        productData.metaKeywords.split(',').forEach((keyword) => seoKeywords.push(keyword));
      } else {
        productData.categories?.forEach((category) => seoKeywords.push(category.name));
      }
      break;
  }

  const {
    seoTitle: pageSeoTitle,
    seoDescription: pageSeoDescription,
    seoKeywords: pageSeoKeywords,
  } = response.pageFolder?.configuration ?? {};

  return {
    seoTitle: (seoTitle || pageSeoTitle) as string,
    seoDescription: (seoDescription || pageSeoDescription) as string,
    seoKeywords: [...seoKeywords, ...(pageSeoKeywords as string[])]
      .map((keyword) => (keyword ?? '').trim())
      .filter(Boolean)
      .join(','),
  };
};
