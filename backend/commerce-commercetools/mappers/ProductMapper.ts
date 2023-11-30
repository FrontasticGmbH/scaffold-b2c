import {
  _Money as CommercetoolsMoney,
  Attribute as CommercetoolsAttribute,
  AttributeDefinition as CommercetoolsAttributeDefinition,
  AttributeEnumType,
  AttributeLocalizedEnumType,
  AttributeSetType,
  Category as CommercetoolsCategory,
  CategoryReference,
  FacetResults as CommercetoolsFacetResults,
  Price as CommercetoolsPrice,
  ProductProjection as CommercetoolsProductProjection,
  ProductType as CommercetoolsProductType,
  ProductVariant as CommercetoolsProductVariant,
  RangeFacetResult as CommercetoolsRangeFacetResult,
  TermFacetResult as CommercetoolsTermFacetResult,
  TypedMoney,
} from '@commercetools/platform-sdk';
import { Product } from '@Types/product/Product';
import { Variant } from '@Types/product/Variant';
import { Attributes } from '@Types/product/Attributes';
import { Category } from '@Types/product/Category';
import { ProductRouter } from '../utils/ProductRouter';
import { Locale } from '../Locale';
import { Money } from '@Types/product/Money';
import { FilterField, FilterFieldTypes, FilterFieldValue } from '@Types/product/FilterField';
import { Facet, FacetTypes } from '@Types/result/Facet';
import { TermFacet } from '@Types/result/TermFacet';
import { RangeFacet as ResultRangeFacet } from '@Types//result/RangeFacet';
import { Term } from '@Types/result/Term';
import { ProductQuery } from '@Types/query/ProductQuery';
import { TermFacet as QueryTermFacet } from '@Types/query/TermFacet';
import { RangeFacet as QueryRangeFacet } from '@Types/query/RangeFacet';
import { Facet as QueryFacet } from '@Types/query/Facet';
import { FacetDefinition } from '@Types/product/FacetDefinition';
import { FilterTypes } from '@Types/query/Filter';
import LocalizedValue from '../utils/LocalizedValue';

const TypeMap = new Map<string, string>([
  ['boolean', FilterFieldTypes.BOOLEAN],
  ['enum', FilterFieldTypes.ENUM],
  ['text', FilterFieldTypes.TEXT],
  ['number', FilterFieldTypes.NUMBER],
  ['lenum', FilterFieldTypes.ENUM],
  ['ltext', FilterFieldTypes.TEXT],
  ['money', FilterFieldTypes.MONEY],
]);

export class ProductMapper {
  static commercetoolsProductProjectionToProduct: (
    commercetoolsProduct: CommercetoolsProductProjection,
    productIdField: string,
    categoryIdField: string,
    locale: Locale,
    defaultLocale: string,
  ) => Product = (
    commercetoolsProduct: CommercetoolsProductProjection,
    productIdField: string,
    categoryIdField: string,
    locale: Locale,
    defaultLocale: string,
  ) => {
    const product: Product = {
      productId: commercetoolsProduct?.[productIdField],
      version: commercetoolsProduct?.version?.toString(),
      name: LocalizedValue.getLocalizedValue(locale, defaultLocale, commercetoolsProduct?.name),
      slug: LocalizedValue.getLocalizedValue(locale, defaultLocale, commercetoolsProduct?.slug),
      description: LocalizedValue.getLocalizedValue(locale, defaultLocale, commercetoolsProduct?.description),
      categories: ProductMapper.commercetoolsCategoryReferencesToCategories(
        commercetoolsProduct.categories,
        categoryIdField,
        locale,
      ),
      variants: ProductMapper.commercetoolsProductProjectionToVariants(commercetoolsProduct, locale),
    };

    product._url = ProductRouter.generateUrlFor(product);

    return product;
  };

  static commercetoolsProductProjectionToVariants: (
    commercetoolsProduct: CommercetoolsProductProjection,
    locale: Locale,
  ) => Variant[] = (commercetoolsProduct: CommercetoolsProductProjection, locale: Locale) => {
    const variants: Variant[] = [];

    if (commercetoolsProduct?.masterVariant) {
      variants.push(ProductMapper.commercetoolsProductVariantToVariant(commercetoolsProduct.masterVariant, locale));
    }

    for (let i = 0; i < commercetoolsProduct.variants.length; i++) {
      variants.push(ProductMapper.commercetoolsProductVariantToVariant(commercetoolsProduct.variants[i], locale));
    }

    return variants;
  };

  static commercetoolsProductVariantToVariant: (
    commercetoolsVariant: CommercetoolsProductVariant,
    locale: Locale,
  ) => Variant = (commercetoolsVariant: CommercetoolsProductVariant, locale: Locale) => {
    const attributes = commercetoolsVariant.attributes
      ? ProductMapper.commercetoolsAttributesToAttributes(commercetoolsVariant.attributes, locale)
      : [];
    const { price, discountedPrice, discounts } = ProductMapper.extractPriceAndDiscounts(commercetoolsVariant, locale);

    return {
      id: commercetoolsVariant.id?.toString(),
      sku: commercetoolsVariant.sku?.toString(),
      images: [
        ...(commercetoolsVariant?.assets?.map((asset) => asset.sources?.[0].uri) ?? []),
        ...(commercetoolsVariant?.images?.map((image) => image.url) ?? []),
      ],
      groupId: attributes?.baseId || undefined,
      attributes: attributes,
      price: price,
      discountedPrice: discountedPrice,
      discounts: discounts,
      isOnStock: commercetoolsVariant.availability?.isOnStock,
      restockableInDays: commercetoolsVariant.availability?.restockableInDays,
      availableQuantity: commercetoolsVariant.availability?.availableQuantity,
    } as Variant;
  };

  static commercetoolsAttributesToAttributes: (
    commercetoolsAttributes: CommercetoolsAttribute[],
    locale: Locale,
  ) => Attributes = (commercetoolsAttributes: CommercetoolsAttribute[], locale: Locale) => {
    const attributes: Attributes = {};

    commercetoolsAttributes?.forEach((commercetoolsAttribute) => {
      attributes[commercetoolsAttribute.name] = ProductMapper.extractAttributeValue(
        commercetoolsAttribute.value,
        locale,
      );
    });

    return attributes;
  };

  static commercetoolsCategoryReferencesToCategories: (
    commercetoolsCategoryReferences: CategoryReference[],
    categoryIdField: string,
    locale: Locale,
  ) => Category[] = (commercetoolsCategoryReferences: CategoryReference[], categoryIdField: string, locale: Locale) => {
    const categories: Category[] = [];

    commercetoolsCategoryReferences.forEach((commercetoolsCategory) => {
      let category: Category = {
        categoryId: commercetoolsCategory.id,
      };

      if (commercetoolsCategory.obj) {
        category = ProductMapper.commercetoolsCategoryToCategory(commercetoolsCategory.obj, categoryIdField, locale);
      }

      categories.push(category);
    });

    return categories;
  };

  static commercetoolsCategoryToCategory: (
    commercetoolsCategory: CommercetoolsCategory,
    categoryIdField: string,
    locale: Locale,
  ) => Category = (commercetoolsCategory: CommercetoolsCategory, categoryIdField: string, locale: Locale) => {
    return {
      categoryId: commercetoolsCategory?.[categoryIdField],
      parentId: commercetoolsCategory.parent?.id,
      name: commercetoolsCategory.name?.[locale.language] ?? undefined,
      slug: commercetoolsCategory.slug?.[locale.language] ?? undefined,
      depth: commercetoolsCategory.ancestors.length,
      subCategories: (commercetoolsCategory as any).subCategories?.map((subCategory: CommercetoolsCategory) =>
        ProductMapper.commercetoolsCategoryToCategory(subCategory, categoryIdField, locale),
      ),
      _url:
        commercetoolsCategory.ancestors.length > 0
          ? `/${commercetoolsCategory.ancestors
              ?.map((ancestor) => {
                return ancestor.obj?.slug?.[locale.language] ?? ancestor.id;
              })
              .join('/')}/${commercetoolsCategory.slug?.[locale.language] ?? commercetoolsCategory.id}`
          : `/${commercetoolsCategory.slug?.[locale.language] ?? commercetoolsCategory.id}`,
    };
  };

  static commercetoolsCategoriesToTreeCategory(
    commercetoolsCategories: CommercetoolsCategory[],
    categoryIdField: string,
    locale: Locale,
  ) {
    const nodes = {};

    for (const category of commercetoolsCategories) {
      (category as CommercetoolsCategory & { subCategories: CommercetoolsCategory[] }).subCategories = [];
      nodes[category.id] = category;
    }

    for (const category of commercetoolsCategories) {
      if (!category.parent?.id) continue;

      nodes[category.parent.id].subCategories.push(category);
    }

    return commercetoolsCategories
      .filter((category) => category.ancestors.length === 0)
      .map((category) => this.commercetoolsCategoryToCategory(category, categoryIdField, locale));
  }

  static extractAttributeValue(commercetoolsAttributeValue: unknown, locale: Locale): unknown {
    if (commercetoolsAttributeValue['key'] !== undefined && commercetoolsAttributeValue['label'] !== undefined) {
      return {
        key: commercetoolsAttributeValue['key'],
        label: ProductMapper.extractAttributeValue(commercetoolsAttributeValue['label'], locale),
      };
    }

    if (commercetoolsAttributeValue instanceof Array) {
      return commercetoolsAttributeValue.map((value) => ProductMapper.extractAttributeValue(value, locale));
    }

    return commercetoolsAttributeValue[locale.language] || commercetoolsAttributeValue;
  }

  static extractPriceAndDiscounts(commercetoolsVariant: CommercetoolsProductVariant, locale: Locale) {
    let price: Money | undefined;
    let discountedPrice: Money | undefined;
    let discounts: string[] | undefined;

    if (commercetoolsVariant?.scopedPrice) {
      price = ProductMapper.commercetoolsMoneyToMoney(commercetoolsVariant.scopedPrice?.value);
      if (commercetoolsVariant.scopedPrice?.discounted?.value) {
        discountedPrice = ProductMapper.commercetoolsMoneyToMoney(commercetoolsVariant.scopedPrice?.discounted?.value);
      }

      if (commercetoolsVariant.scopedPrice?.discounted?.discount?.obj?.description?.[locale.language]) {
        discounts = [commercetoolsVariant.scopedPrice?.discounted?.discount?.obj?.description[locale.language]];
      }

      return { price, discountedPrice, discounts };
    }

    if (commercetoolsVariant?.price) {
      price = ProductMapper.commercetoolsMoneyToMoney(commercetoolsVariant.price?.value);
      if (commercetoolsVariant.price?.discounted?.value) {
        discountedPrice = ProductMapper.commercetoolsMoneyToMoney(commercetoolsVariant.price?.discounted?.value);
      }

      if (commercetoolsVariant.price?.discounted?.discount?.obj?.description?.[locale.language]) {
        discounts = [commercetoolsVariant.price?.discounted?.discount?.obj?.description[locale.language]];
      }

      return { price, discountedPrice, discounts };
    }

    if (commercetoolsVariant?.prices) {
      //Filter price by country and currency and if we don't find one, then filter only by currency
      let commercetoolsPrice: CommercetoolsPrice = commercetoolsVariant?.prices.find((price: CommercetoolsPrice) => {
        return (
          !price.hasOwnProperty('channel') &&
          !price.hasOwnProperty('customerGroup') &&
          price.country === locale.country &&
          price.value.currencyCode === locale.currency
        );
      });

      if (!commercetoolsPrice) {
        commercetoolsPrice = commercetoolsVariant?.prices.find((price: CommercetoolsPrice) => {
          return (
            !price.hasOwnProperty('channel') &&
            !price.hasOwnProperty('customerGroup') &&
            !price.hasOwnProperty('country') &&
            price.value.currencyCode === locale.currency
          );
        });
      }

      price = ProductMapper.commercetoolsMoneyToMoney(commercetoolsPrice?.value);

      if (commercetoolsPrice?.discounted?.value) {
        discountedPrice = ProductMapper.commercetoolsMoneyToMoney(commercetoolsPrice?.discounted?.value);
      }

      if (commercetoolsPrice?.discounted?.discount?.obj?.description?.[locale.language]) {
        discounts = [commercetoolsPrice?.discounted?.discount?.obj?.description[locale.language]];
      }

      return { price, discountedPrice, discounts };
    }

    return { price, discountedPrice, discounts };
  }

  static commercetoolsMoneyToMoney(commercetoolsMoney: CommercetoolsMoney | TypedMoney): Money | undefined {
    if (commercetoolsMoney === undefined) {
      return undefined;
    }

    return {
      fractionDigits:
        commercetoolsMoney.hasOwnProperty('fractionDigits') &&
        (commercetoolsMoney as TypedMoney).fractionDigits !== undefined
          ? (commercetoolsMoney as TypedMoney).fractionDigits
          : 2,
      centAmount: commercetoolsMoney.centAmount,
      currencyCode: commercetoolsMoney.currencyCode,
    };
  }

  static commercetoolsProductTypesToFilterFields(
    commercetoolsProductTypes: CommercetoolsProductType[],
    locale: Locale,
  ): FilterField[] {
    const filterFields: FilterField[] = [];

    commercetoolsProductTypes?.forEach((productType) => {
      productType.attributes?.forEach((attribute) => {
        if (!attribute.isSearchable) {
          return;
        }

        filterFields.push(ProductMapper.commercetoolsAttributeDefinitionToFilterField(attribute, locale));
      });
    });

    return filterFields;
  }

  static commercetoolsAttributeDefinitionToFilterField(
    commercetoolsAttributeDefinition: CommercetoolsAttributeDefinition,
    locale: Locale,
  ): FilterField {
    let commercetoolsAttributeTypeName = commercetoolsAttributeDefinition.type.name;

    let commercetoolsAttributeValues = commercetoolsAttributeDefinition.type?.hasOwnProperty('values')
      ? (commercetoolsAttributeDefinition.type as AttributeEnumType | AttributeLocalizedEnumType).values
      : [];

    if (commercetoolsAttributeTypeName === 'set') {
      const elementType = (commercetoolsAttributeDefinition.type as AttributeSetType).elementType;

      commercetoolsAttributeTypeName = elementType.name;
      commercetoolsAttributeValues = elementType?.hasOwnProperty('values')
        ? (elementType as AttributeEnumType | AttributeLocalizedEnumType).values
        : [];
    }

    const filterFieldValues: FilterFieldValue[] = [];

    for (const value of commercetoolsAttributeValues) {
      filterFieldValues.push({
        value: value.key,
        name: commercetoolsAttributeTypeName === 'enum' ? value.label : value.label?.[locale.language] ?? undefined,
      });
    }

    return {
      field: `variants.attributes.${commercetoolsAttributeDefinition.name}`,
      type: TypeMap.has(commercetoolsAttributeTypeName)
        ? TypeMap.get(commercetoolsAttributeTypeName)
        : commercetoolsAttributeTypeName,
      label: commercetoolsAttributeDefinition.label?.[locale.language] ?? commercetoolsAttributeDefinition.name,
      values: filterFieldValues.length > 0 ? filterFieldValues : undefined,
    };
  }

  static commercetoolsProductTypesToFacetDefinitions(
    commercetoolsProductTypes: CommercetoolsProductType[],
    locale: Locale,
  ): FacetDefinition[] {
    const facetDefinitionsIndex: { [key: string]: FacetDefinition } = {};
    const facetDefinitions: FacetDefinition[] = [];

    commercetoolsProductTypes?.forEach((productType) => {
      productType.attributes?.forEach((attribute) => {
        if (!attribute.isSearchable) {
          return;
        }

        const facetDefinition: FacetDefinition = {
          attributeType: attribute.type.name,
          attributeId: `variants.attributes.${attribute.name}`,
          attributeLabel:
            attribute.label[locale.language] !== undefined && attribute.label[locale.language].length > 0
              ? attribute.label[locale.language]
              : attribute.name,
        };

        if (facetDefinition.attributeId) facetDefinitionsIndex[facetDefinition.attributeId] = facetDefinition;
      });
    });

    for (const [attributeId, facetDefinition] of Object.entries(facetDefinitionsIndex)) {
      facetDefinitions.push(facetDefinition);
    }

    return facetDefinitions;
  }

  static facetDefinitionsToCommercetoolsQueryArgFacets(facetDefinitions: FacetDefinition[], locale: Locale): string[] {
    const queryArgFacets: string[] = [];

    facetDefinitions?.forEach((facetDefinition) => {
      let facet: string;

      switch (facetDefinition.attributeType) {
        case 'money':
          facet = `${facetDefinition.attributeId}.centAmount:range (0 to *)`;
          break;

        case 'enum':
          facet = `${facetDefinition.attributeId}.label`;
          break;

        case 'lenum':
          facet = `${facetDefinition.attributeId}.label.${locale.language}`;
          break;

        case 'ltext':
          facet = `${facetDefinition.attributeId}.${locale.language}`;
          break;

        case 'number':
        case 'boolean':
        case 'text':
        case 'reference':
        default:
          facet = facetDefinition.attributeId;
          break;
      }

      // Alias to identifier used by us
      queryArgFacets.push(`${facet} as ${facetDefinition.attributeId}`);
    });

    return queryArgFacets;
  }

  static facetDefinitionsToFilterFacets(
    queryFacets: QueryFacet[],
    facetDefinitions: FacetDefinition[],
    locale: Locale,
  ): string[] {
    const filterFacets: string[] = [];
    const typeLookup: { [key: string]: string } = {};

    if (facetDefinitions.length === 0) {
      return filterFacets;
    }

    facetDefinitions.forEach((facetDefinition) => {
      if (facetDefinition.attributeId) typeLookup[facetDefinition.attributeId] = facetDefinition.attributeType || '';
    });

    queryFacets.forEach((queryFacet) => {
      if (!typeLookup?.hasOwnProperty(queryFacet.identifier)) {
        return;
      }

      switch (typeLookup[queryFacet.identifier]) {
        case 'money':
          filterFacets.push(
            `${queryFacet.identifier}.centAmount:range (${(queryFacet as QueryRangeFacet).min} to ${
              (queryFacet as QueryRangeFacet).max
            })`,
          );
          break;
        case 'enum':
          filterFacets.push(`${queryFacet.identifier}.label:"${(queryFacet as QueryTermFacet).terms?.join('","')}"`);
          break;
        case 'lenum':
          filterFacets.push(
            `${queryFacet.identifier}.label.${locale.language}:"${(queryFacet as QueryTermFacet).terms?.join('","')}"`,
          );
          break;
        case 'ltext':
          filterFacets.push(
            `${queryFacet.identifier}.${locale.language}:"${(queryFacet as QueryTermFacet).terms?.join('","')}"`,
          );
          break;
        case 'number':
        case 'boolean':
        case 'text':
        case 'reference':
        default:
          if (queryFacet.type === FilterTypes.TERM) {
            filterFacets.push(`${queryFacet.identifier}:"${(queryFacet as QueryTermFacet).terms?.join('","')}"`);
            break;
          }

          if (queryFacet.type === FilterTypes.BOOLEAN) {
            filterFacets.push(
              `${queryFacet.identifier}:"${(queryFacet as QueryTermFacet).terms[0] === 'T' ? 'true' : 'false'}"`,
            );
            break;
          }

          filterFacets.push(
            `${queryFacet.identifier}:range (${(queryFacet as QueryRangeFacet).min} to ${
              (queryFacet as QueryRangeFacet).max
            })`,
          );

          break;
      }
    });

    return filterFacets;
  }

  static commercetoolsFacetResultsToFacets(
    facetDefinitions: FacetDefinition[],
    commercetoolsFacetResults: CommercetoolsFacetResults,
    productQuery: ProductQuery,
    locale: Locale,
  ): Facet[] {
    const facets: Facet[] = [];
    let facetLabel: string;

    for (const [facetKey, facetResult] of Object.entries(commercetoolsFacetResults)) {
      const facetQuery = this.findFacetQuery(productQuery, facetKey);

      facetDefinitions.filter((facet) => {
        if (facet.attributeId === facetKey) {
          facetLabel = facet.attributeLabel;
        }
      });

      switch (facetResult.type) {
        case 'range':
          facets.push(
            ProductMapper.commercetoolsRangeFacetResultToRangeFacet(
              facetLabel,
              facetKey,
              facetResult as CommercetoolsRangeFacetResult,
              facetQuery as QueryRangeFacet | undefined,
            ),
          );
          break;

        case 'terms':
          if (facetResult.dataType === 'number') {
            facets.push(
              ProductMapper.commercetoolsTermNumberFacetResultToRangeFacet(
                facetLabel,
                facetKey,
                facetResult as CommercetoolsTermFacetResult,
                facetQuery as QueryRangeFacet | undefined,
              ),
            );
            break;
          }

          facets.push(
            ProductMapper.commercetoolsTermFacetResultToTermFacet(
              facetLabel,
              facetKey,
              facetResult as CommercetoolsTermFacetResult,
              facetQuery as QueryTermFacet | undefined,
            ),
          );
          break;
        case 'filter': // Currently, we are not mapping FilteredFacetResult
        default:
          break;
      }
    }

    return facets;
  }

  static commercetoolsRangeFacetResultToRangeFacet(
    facetLabel: string,
    facetKey: string,
    facetResult: CommercetoolsRangeFacetResult,
    facetQuery: QueryRangeFacet | undefined,
  ) {
    const rangeFacet: ResultRangeFacet = {
      type: FacetTypes.RANGE,
      identifier: facetKey,
      label: facetLabel,
      key: facetKey,
      min: facetResult.ranges[0].min,
      max: facetResult.ranges[0].max,
      selected: facetQuery !== undefined,
      minSelected: facetQuery ? facetQuery.min : undefined,
      maxSelected: facetQuery ? facetQuery.max : undefined,
    };

    return rangeFacet;
  }

  static commercetoolsTermFacetResultToTermFacet(
    facetLabel: string,
    facetKey: string,
    facetResult: CommercetoolsTermFacetResult,
    facetQuery: QueryTermFacet | undefined,
  ) {
    const termFacet: TermFacet = {
      type: facetResult.dataType === 'boolean' ? FacetTypes.BOOLEAN : FacetTypes.TERM,
      identifier: facetKey,
      label: facetLabel,
      key: facetKey,
      selected: facetQuery !== undefined,
      terms: facetResult.terms.map((facetResultTerm) => {
        const term: Term = {
          identifier: facetResultTerm.term.toString(),
          label: facetResultTerm.term.toString(),
          count: facetResultTerm.count,
          key: facetResultTerm.term.toString(),
          selected: facetQuery !== undefined && facetQuery.terms?.includes(facetResultTerm.term.toString()),
        };
        return term;
      }),
    };
    return termFacet;
  }

  static commercetoolsTermNumberFacetResultToRangeFacet(
    facetLabel: string,
    facetKey: string,
    facetResult: CommercetoolsTermFacetResult,
    facetQuery: QueryRangeFacet | undefined,
  ) {
    const rangeFacet: ResultRangeFacet = {
      type: FacetTypes.RANGE,
      identifier: facetKey,
      label: facetLabel,
      key: facetKey,
      count: facetResult.total,
      min: Math.min(...facetResult.terms.map((facetResultTerm) => facetResultTerm.term)) ?? Number.MIN_SAFE_INTEGER,
      max: Math.max(...facetResult.terms.map((facetResultTerm) => facetResultTerm.term)) ?? Number.MAX_SAFE_INTEGER,
    };

    if (facetQuery) {
      rangeFacet.selected = true;
      rangeFacet.minSelected = facetQuery.min;
      rangeFacet.maxSelected = facetQuery.max;
    }
    return rangeFacet;
  }

  static calculatePreviousCursor(offset: number, count: number) {
    return offset - count >= 0 ? `offset:${offset - count}` : undefined;
  }

  static calculateNextCursor(offset: number, count: number, total: number) {
    return offset + count < total ? `offset:${offset + count}` : undefined;
  }

  private static findFacetQuery(productQuery: ProductQuery, facetKey: string) {
    if (productQuery.facets !== undefined) {
      for (const facet of productQuery.facets) {
        if (facet.identifier === facetKey) {
          return facet;
        }
      }
    }

    return undefined;
  }
}
