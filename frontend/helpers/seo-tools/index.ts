import { PageResponse } from '@commercetools/frontend-sdk';
import { Product, Category } from 'shared/types/product';

interface ProductListData {
  items: Product[];
  query?: { categories?: string[] };
}

// takes the provided categories and returns the first one that matches the categoryId
const findCurrentCategory = (response: PageResponse, categories: Category[]): Category | null => {
  const data = response.data.dataSources.__master as ProductListData;
  const categoryId = data?.query?.categories?.[0];

  if (!categoryId || !categories.length) return null;

  return categories.find((cat) => cat.categoryId === categoryId) ?? null;
};

const extractKeywords = (text: string): string[] => {
  return text.split(/\s+/).filter((word) => word.length > 2);
};

const getCategoryKeywords = (category: Category): string[] => {
  if (!category.name) return [];
  return [category.name, ...extractKeywords(category.name)];
};

const getProductKeywords = (product: Product): string[] => {
  if (product.metaKeywords) {
    return product.metaKeywords
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);
  }
  return product.categories?.map((cat) => cat.name).filter((name): name is string => Boolean(name)) ?? [];
};

export const getSeoInfoFromPageResponse = (response: PageResponse, categories: Category[]) => {
  const pageConfig = response.pageFolder?.configuration ?? {};
  const pageType = response.pageFolder?.pageFolderType;

  let seoTitle: string | undefined;
  let seoDescription: string | undefined;
  let keywords: string[] = [];

  if (pageType === 'frontastic/category') {
    const category = findCurrentCategory(response, categories);
    if (category) {
      seoTitle = category.metaTitle ?? category.name;
      seoDescription = category.metaDescription;
      keywords = getCategoryKeywords(category);
    }
  }

  if (pageType === 'frontastic/product-detail-page') {
    const data = response.data.dataSources.__master as any;
    const product = data?.product as Product | undefined;
    if (product) {
      seoTitle = product.metaTitle ?? product.name;
      seoDescription = product.metaDescription ?? product.description;
      keywords = getProductKeywords(product);
    }
  }

  const allKeywords = [...keywords, ...(pageConfig.seoKeywords ?? [])].filter(Boolean).map((k) => k.trim());

  return {
    seoTitle: seoTitle ?? pageConfig.seoTitle ?? '',
    seoDescription: seoDescription ?? pageConfig.seoDescription ?? '',
    seoKeywords: [...new Set(allKeywords)].join(','),
  };
};
