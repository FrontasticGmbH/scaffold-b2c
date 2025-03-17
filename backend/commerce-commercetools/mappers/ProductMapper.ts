import {
  _Money as CommercetoolsMoney,
  Attribute as CommercetoolsAttribute,
  AttributeDefinition as CommercetoolsAttributeDefinition,
  AttributeEnumType,
  AttributeLocalizedEnumType,
  AttributeLocalizedEnumValue,
  AttributePlainEnumValue,
  AttributeSetType,
  Category as CommercetoolsCategory,
  CategoryReference,
  DiscountedPrice as CommercetoolsDiscountedPrice,
  Price as CommercetoolsPrice,
  ProductSearchFacetCountExpression,
  ProductSearchFacetDistinctExpression,
  ProductSearchFacetExpression,
  ProductSearchFacetRangesExpression,
  ProductSearchFacetResult,
  ProductSearchFacetResultBucket,
  ProductSearchFacetResultCount,
  ProductSearchMatchingVariants as CommercetoolsProductSearchMatchingVariants,
  ProductSearchRequest,
  ProductSearchResult as CommercetoolsProductSearchResult,
  ProductType as CommercetoolsProductType,
  ProductVariant as CommercetoolsProductVariant,
  TypedMoney,
  ProductDiscount as CommercetoolsProductDiscount,
  ProductDiscountValue as CommercetoolsProductDiscountValue,
} from '@commercetools/platform-sdk';
import { Product } from '@Types/product/Product';
import { Variant } from '@Types/product/Variant';
import { Attributes } from '@Types/product/Attributes';
import { Category } from '@Types/product/Category';
import { Money } from '@Types/product/Money';
import { FilterField, FilterFieldTypes, FilterFieldValue } from '@Types/product/FilterField';
import { Facet, FacetTypes } from '@Types/result/Facet';
import { TermFacet } from '@Types/result/TermFacet';
import { RangeFacet } from '@Types/result/RangeFacet';
import { Term } from '@Types/result/Term';
import { ProductQuery, LocalizedString } from '@Types/query/ProductQuery';
import { TermFacet as QueryTermFacet } from '@Types/query/TermFacet';
import { RangeFacet as QueryRangeFacet } from '@Types/query/RangeFacet';
import { FacetDefinition } from '@Types/product/FacetDefinition';
import { ProductDiscount, ProductDiscountedPrice, ProductDiscountValue } from '@Types/cart';
import { Locale } from '../Locale';
import { ProductRouter } from '../utils/routers/ProductRouter';
import LocalizedValue from '@Commerce-commercetools/utils/LocalizedValue';

const TypeMap = new Map<string, string>([
  ['boolean', FilterFieldTypes.BOOLEAN],
  ['enum', FilterFieldTypes.ENUM],
  ['text', FilterFieldTypes.TEXT],
  ['number', FilterFieldTypes.NUMBER],
  ['lenum', FilterFieldTypes.ENUM],
  ['ltext', FilterFieldTypes.TEXT],
  ['reference', FilterFieldTypes.TEXT],
  ['money', FilterFieldTypes.MONEY],
]);

export class ProductMapper {
  static commercetoolsProductSearchResultToProduct(
    commercetoolsProduct: CommercetoolsProductSearchResult,
    productIdField: string,
    categoryIdField: string,
    locale: Locale,
    defaultLocale: string,
  ): Product {
    const product: Product = {
      productId: commercetoolsProduct?.productProjection?.id,
      productKey: commercetoolsProduct?.productProjection?.key,
      productRef: commercetoolsProduct?.productProjection?.[productIdField],
      version: commercetoolsProduct?.productProjection.version?.toString(),
      name: commercetoolsProduct?.productProjection.name?.[locale.language],
      slug: commercetoolsProduct?.productProjection.slug?.[locale.language],
      description: commercetoolsProduct?.productProjection.description?.[locale.language],
      categories: this.commercetoolsCategoryReferencesToCategories(
        commercetoolsProduct.productProjection.categories,
        categoryIdField,
        locale,
      ),
      variants: this.commercetoolsProductProjectionToVariants(commercetoolsProduct, locale),
      metaTitle:
        LocalizedValue.getLocalizedValue(locale, defaultLocale, commercetoolsProduct?.productProjection?.metaTitle) ||
        undefined,
      metaDescription:
        LocalizedValue.getLocalizedValue(
          locale,
          defaultLocale,
          commercetoolsProduct?.productProjection?.metaDescription,
        ) || undefined,
      metaKeywords:
        LocalizedValue.getLocalizedValue(
          locale,
          defaultLocale,
          commercetoolsProduct?.productProjection?.metaKeywords,
        ) || undefined,
    };

    product._url = ProductRouter.generateUrlFor(product);

    return product;
  }

  static commercetoolsProductProjectionToVariants(
    commercetoolsProduct: CommercetoolsProductSearchResult,
    locale: Locale,
  ): Variant[] {
    const variants: Variant[] = [];

    if (commercetoolsProduct?.productProjection.masterVariant) {
      variants.push(
        this.commercetoolsProductVariantToVariant(
          commercetoolsProduct.productProjection.masterVariant,
          locale,
          commercetoolsProduct.matchingVariants,
        ),
      );
    }

    variants.push(
      ...commercetoolsProduct.productProjection.variants.map((variant) =>
        this.commercetoolsProductVariantToVariant(variant, locale, commercetoolsProduct.matchingVariants),
      ),
    );

    return variants;
  }

  static commercetoolsProductVariantToVariant(
    commercetoolsVariant: CommercetoolsProductVariant,
    locale: Locale,
    matchingVariants?: CommercetoolsProductSearchMatchingVariants,
  ): Variant {
    const attributes = this.commercetoolsAttributesToAttributes(commercetoolsVariant.attributes, locale);
    const { price, discountedPrice } = this.extractPriceAndDiscounts(commercetoolsVariant, locale);

    return {
      id: commercetoolsVariant.id?.toString(),
      sku: commercetoolsVariant.sku?.toString(),
      images: [
        ...commercetoolsVariant.assets.map((asset) => asset.sources?.[0].uri),
        ...commercetoolsVariant.images.map((image) => image.url),
      ],
      groupId: attributes?.baseId || undefined,
      attributes: attributes,
      price: price,
      discountedPrice: discountedPrice,
      isMatchingVariant:
        matchingVariants?.allMatched ||
        matchingVariants?.matchedVariants.some((variant) => variant.id === commercetoolsVariant.id),
      isOnStock: commercetoolsVariant.availability?.isOnStock || undefined,
      restockableInDays: commercetoolsVariant.availability?.restockableInDays || undefined,
      availableQuantity: commercetoolsVariant.availability?.availableQuantity || undefined,
    } as Variant;
  }

  static commercetoolsAttributesToAttributes(
    commercetoolsAttributes: CommercetoolsAttribute[],
    locale: Locale,
  ): Attributes {
    const attributes: Attributes = {};

    commercetoolsAttributes?.forEach((commercetoolsAttribute) => {
      attributes[commercetoolsAttribute.name] = ProductMapper.extractAttributeValue(
        commercetoolsAttribute.value,
        locale,
      );
    });

    return attributes;
  }

  static commercetoolsCategoryReferencesToCategories(
    commercetoolsCategoryReferences: CategoryReference[],
    categoryIdField: string,
    locale: Locale,
  ): Category[] {
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
  }

  static commercetoolsCategoryToCategory(
    commercetoolsCategory: CommercetoolsCategory,
    categoryIdField: string,
    locale: Locale,
    defaultLocale?: string,
  ): Category {
    return {
      categoryId: commercetoolsCategory?.id,
      categoryKey: commercetoolsCategory?.key,
      categoryRef: commercetoolsCategory?.[categoryIdField as keyof CommercetoolsCategory] as string | undefined,
      parentId: commercetoolsCategory.parent?.id,
      parentKey: commercetoolsCategory.parent?.obj?.key,
      parentRef: commercetoolsCategory.parent?.obj?.[categoryIdField as keyof CommercetoolsCategory] as
        | string
        | undefined,
      name: commercetoolsCategory.name?.[locale.language] ?? undefined,
      slug: commercetoolsCategory.slug?.[locale.language] ?? undefined,
      depth: commercetoolsCategory.ancestors.length,
      _url: this.generateLocalizedUrl(commercetoolsCategory),
      metaTitle: LocalizedValue.getLocalizedValue(locale, defaultLocale, commercetoolsCategory?.metaTitle) || undefined,
      metaDescription:
        LocalizedValue.getLocalizedValue(locale, defaultLocale, commercetoolsCategory?.metaDescription) || undefined,
      metaKeywords:
        LocalizedValue.getLocalizedValue(locale, defaultLocale, commercetoolsCategory?.metaKeywords) || undefined,
    };
  }

  static generateLocalizedUrl = (commercetoolsCategory: CommercetoolsCategory): LocalizedString => {
    const localizedUrl: LocalizedString = {};

    if (commercetoolsCategory.slug) {
      Object.keys(commercetoolsCategory.slug).forEach((localeKey) => {
        localizedUrl[localeKey] =
          commercetoolsCategory.ancestors.length > 0
            ? `/${commercetoolsCategory.ancestors
                .map((ancestor) => ancestor.obj?.slug?.[localeKey] ?? ancestor.id)
                .join('/')}/${commercetoolsCategory.slug[localeKey] ?? commercetoolsCategory.id}`
            : `/${commercetoolsCategory.slug[localeKey] ?? commercetoolsCategory.id}`;
      });
    }

    return localizedUrl;
  };

  static commercetoolsCategoriesToTreeCategory(
    commercetoolsCategories: CommercetoolsCategory[],
    categoryIdField: string,
    locale: Locale,
  ): Category[] {
    const nodes: { [key: string]: Category } = {};

    for (const commercetoolsCategory of commercetoolsCategories) {
      nodes[commercetoolsCategory.id] = this.commercetoolsCategoryToCategory(
        commercetoolsCategory,
        categoryIdField,
        locale,
      );
    }

    // Move descentans to their parent category if exists
    for (const commercetoolsCategory of commercetoolsCategories) {
      if (!commercetoolsCategory.parent?.id || !(commercetoolsCategory.parent.id in nodes)) continue;

      // Ensure the descendants array is initialized
      if (!nodes[commercetoolsCategory.parent.id].descendants) {
        nodes[commercetoolsCategory.parent.id].descendants = [];
      }

      nodes[commercetoolsCategory.parent.id].descendants.push(nodes[commercetoolsCategory.id]);
    }

    // Return only the root categories
    return Object.values(nodes).filter((node) => !node.parentId || (node.parentId && !(node.parentId in nodes)));
  }

  static extractAttributeValue(commercetoolsAttributeValue: unknown, locale: Locale): unknown {
    if (commercetoolsAttributeValue['key'] !== undefined && commercetoolsAttributeValue['label'] !== undefined) {
      return {
        key: commercetoolsAttributeValue['key'],
        label: ProductMapper.extractAttributeValue(commercetoolsAttributeValue['label'], locale),
      };
    }

    if (commercetoolsAttributeValue['typeId'] === 'product' && commercetoolsAttributeValue['id'] !== undefined) {
      return commercetoolsAttributeValue['id'];
    }

    if (commercetoolsAttributeValue instanceof Array) {
      return commercetoolsAttributeValue.map((value) => ProductMapper.extractAttributeValue(value, locale));
    }

    return commercetoolsAttributeValue[locale.language] || commercetoolsAttributeValue;
  }

  static commercetoolsProductDiscountValueToProductDiscountValue(
    commercetoolsProductDiscountValue: CommercetoolsProductDiscountValue,
    locale: Locale,
  ): ProductDiscountValue | undefined {
    switch (commercetoolsProductDiscountValue.type) {
      case 'absolute':
        return {
          type: 'absolute',
          value: LocalizedValue.getLocalizedCurrencyValue(locale, commercetoolsProductDiscountValue.money),
        };

      case 'relative':
        return {
          type: 'relative',
          value: commercetoolsProductDiscountValue.permyriad,
        };
      default:
        return undefined;
    }
  }

  static extractPriceAndDiscounts(commercetoolsVariant: CommercetoolsProductVariant, locale: Locale) {
    let price: Money | undefined;
    let discountedPrice: ProductDiscountedPrice | undefined;

    if (commercetoolsVariant?.scopedPrice) {
      price = this.commercetoolsMoneyToMoney(commercetoolsVariant.scopedPrice?.value);
      discountedPrice =
        commercetoolsVariant.scopedPrice?.discounted !== undefined
          ? ProductMapper.commercetoolsDiscountedPriceToDiscountedPrice(
              commercetoolsVariant.scopedPrice?.discounted,
              locale,
            )
          : undefined;

      return { price, discountedPrice };
    }

    if (commercetoolsVariant?.price) {
      price = this.commercetoolsMoneyToMoney(commercetoolsVariant.price?.value);
      discountedPrice =
        commercetoolsVariant.price?.discounted !== undefined
          ? ProductMapper.commercetoolsDiscountedPriceToDiscountedPrice(commercetoolsVariant.price?.discounted, locale)
          : undefined;

      return { price, discountedPrice };
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

      price = this.commercetoolsMoneyToMoney(commercetoolsPrice?.value);
      discountedPrice =
        commercetoolsPrice?.discounted !== undefined
          ? ProductMapper.commercetoolsDiscountedPriceToDiscountedPrice(commercetoolsPrice?.discounted, locale)
          : undefined;

      return { price, discountedPrice };
    }

    return { price, discountedPrice };
  }

  static commercetoolsDiscountedPriceToDiscountedPrice(
    commercetoolsDiscountedPrice: CommercetoolsDiscountedPrice,
    locale: Locale,
  ): ProductDiscountedPrice {
    return {
      value: this.commercetoolsMoneyToMoney(commercetoolsDiscountedPrice?.value),
      discount:
        commercetoolsDiscountedPrice?.discount?.obj !== undefined
          ? this.commercetoolsProductDiscountToProductDiscount(commercetoolsDiscountedPrice?.discount?.obj, locale)
          : undefined,
    };
  }

  static commercetoolsProductDiscountToProductDiscount(
    commercetoolsProductDiscount: CommercetoolsProductDiscount,
    locale: Locale,
  ): ProductDiscount {
    return {
      discountValue: this.commercetoolsProductDiscountValueToProductDiscountValue(
        commercetoolsProductDiscount.value,
        locale,
      ),
      description: commercetoolsProductDiscount?.description?.[locale.language],
      name: commercetoolsProductDiscount?.name?.[locale.language],
    };
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
      let attributeValueLabel: string;

      switch (commercetoolsAttributeTypeName) {
        case 'enum': {
          const enumValue = value as AttributePlainEnumValue;
          attributeValueLabel = typeof enumValue.label === 'string' ? enumValue.label : value.key;
          break;
        }
        case 'lenum': {
          const lenumValue = value as AttributeLocalizedEnumValue;
          const label = lenumValue.label?.[locale.language];
          attributeValueLabel = typeof label === 'string' ? label : value.key;
          break;
        }
        default:
          attributeValueLabel = value.key;
      }

      filterFieldValues.push({
        value: attributeValueLabel,
        name: attributeValueLabel,
      });
    }

    return {
      field: `variants.attributes.${commercetoolsAttributeDefinition.name}`,
      type: TypeMap.has(commercetoolsAttributeTypeName)
        ? TypeMap.get(commercetoolsAttributeTypeName)
        : commercetoolsAttributeTypeName,
      label: commercetoolsAttributeDefinition.label?.[locale.language] ?? commercetoolsAttributeDefinition.name,
      values: filterFieldValues.length > 0 ? filterFieldValues : undefined,
      translatable: false,
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
          attributeType: attribute.type?.hasOwnProperty('elementType')
            ? (attribute.type as AttributeSetType)?.elementType.name
            : attribute.type.name,
          attributeId: `variants.attributes.${attribute.name}`,
          attributeLabel:
            attribute.label[locale.language] !== undefined && attribute.label[locale.language].length > 0
              ? attribute.label[locale.language]
              : attribute.name,
        };

        // Store facets by attributeId to avoid duplicated attributes
        if (facetDefinition.attributeId) facetDefinitionsIndex[facetDefinition.attributeId] = facetDefinition;
      });
    });

    for (const [attributeId, facetDefinition] of Object.entries(facetDefinitionsIndex)) {
      facetDefinitions.push(facetDefinition);
    }

    return facetDefinitions;
  }

  static commercetoolsFacetResultsToFacets(
    commercetoolsFacetResults: ProductSearchFacetResult[],
    commercetoolsProductSearchRequest: ProductSearchRequest,
    facetDefinitions: FacetDefinition[],
    productQuery: ProductQuery,
  ): Facet[] {
    return commercetoolsFacetResults
      .map((commercetoolsFacetResult) => {
        const commercetoolsFacetExpression = this.findCommercetoolsFacetExpression(
          commercetoolsProductSearchRequest.facets,
          commercetoolsFacetResult.name,
        );

        if (commercetoolsFacetExpression) {
          // By default, the label is the facet name
          let facetLabel = commercetoolsFacetResult.name;

          // Find the label for the facet
          facetDefinitions.filter((facet) => {
            if (facet.attributeId === commercetoolsFacetResult.name) {
              facetLabel = facet.attributeLabel;
            }
          });

          const facetQuery = this.findFacetQuery(productQuery, commercetoolsFacetResult.name);

          if ('ranges' in commercetoolsFacetExpression) {
            return this.commercetoolsFacetResultBucketToRangeFacet(
              commercetoolsFacetResult as ProductSearchFacetResultBucket,
              facetLabel,
              facetQuery as QueryRangeFacet | undefined,
            );
          }
          if ('count' in commercetoolsFacetExpression) {
            return this.commercetoolsFacetResultCountToFacet(
              commercetoolsFacetResult as ProductSearchFacetResultCount,
              facetDefinitions,
              facetLabel,
              facetQuery as QueryTermFacet | undefined,
            );
          }
          if ('distinct' in commercetoolsFacetExpression) {
            return this.commercetoolsFacetResultBucketToTermFacet(
              commercetoolsFacetResult as ProductSearchFacetResultBucket,
              commercetoolsFacetExpression as ProductSearchFacetDistinctExpression,
              facetLabel,
              facetQuery as QueryTermFacet | undefined,
            );
          }
        }
        return null;
      })
      .filter((facet) => facet);
  }

  static findCommercetoolsFacetExpression(
    commercetoolsFacetExpression: ProductSearchFacetExpression[],
    facetName: string,
  ):
    | ProductSearchFacetRangesExpression
    | ProductSearchFacetCountExpression
    | ProductSearchFacetDistinctExpression
    | undefined {
    return commercetoolsFacetExpression.find(
      (facet) =>
        (facet as ProductSearchFacetRangesExpression).ranges?.name === facetName ||
        (facet as ProductSearchFacetCountExpression).count?.name === facetName ||
        (facet as ProductSearchFacetDistinctExpression).distinct?.name === facetName,
    ) as
      | ProductSearchFacetRangesExpression
      | ProductSearchFacetCountExpression
      | ProductSearchFacetDistinctExpression
      | undefined;
  }

  static commercetoolsFacetResultBucketToRangeFacet(
    commercetoolsFacetResultBucket: ProductSearchFacetResultBucket,
    facetLabel: string,
    facetQuery: QueryRangeFacet | undefined,
  ): RangeFacet {
    const min = parseInt(
      commercetoolsFacetResultBucket.buckets[0].key.substring(
        0,
        commercetoolsFacetResultBucket.buckets[0].key.indexOf('-'),
      ),
    );
    const max = parseInt(
      commercetoolsFacetResultBucket.buckets[0].key.substring(
        commercetoolsFacetResultBucket.buckets[0].key.indexOf('-') + 1,
      ),
    );

    return {
      type: FacetTypes.RANGE,
      identifier: commercetoolsFacetResultBucket.name,
      label: facetLabel,
      key: commercetoolsFacetResultBucket.name,
      min: isNaN(min) ? 0 : min,
      max: isNaN(max) ? Number.MAX_SAFE_INTEGER : max,
      selected: facetQuery !== undefined,
      minSelected: facetQuery ? facetQuery.min : undefined,
      maxSelected: facetQuery ? facetQuery.max : undefined,
    };
  }

  static commercetoolsFacetResultCountToFacet(
    commercetoolsFacetResultCount: ProductSearchFacetResultCount,
    facetDefinitions: FacetDefinition[],
    facetLabel: string,
    facetQuery: QueryTermFacet | undefined,
  ): Facet {
    const definition = facetDefinitions.find(
      (facetDefinition) => facetDefinition.attributeId === commercetoolsFacetResultCount.name,
    );
    return {
      type: definition.attributeType === FacetTypes.BOOLEAN ? FacetTypes.BOOLEAN : FacetTypes.TERM,
      identifier: commercetoolsFacetResultCount.name,
      label: facetLabel,
      key: commercetoolsFacetResultCount.name,
      count: commercetoolsFacetResultCount.value,
      selected: facetQuery !== undefined,
    };
  }

  static commercetoolsFacetResultBucketToTermFacet(
    commercetoolsFacetResultBucket: ProductSearchFacetResultBucket,
    commercetoolsFacetDistinctExpression: ProductSearchFacetDistinctExpression,
    facetLabel: string,
    facetQuery: QueryTermFacet | undefined,
  ): TermFacet {
    return {
      type:
        commercetoolsFacetDistinctExpression.distinct.fieldType === 'boolean' ? FacetTypes.BOOLEAN : FacetTypes.TERM,
      identifier: commercetoolsFacetResultBucket.name,
      label: facetLabel,
      key: commercetoolsFacetResultBucket.name,
      selected: facetQuery !== undefined,
      terms: commercetoolsFacetResultBucket.buckets.map((facetResultTerm) => {
        const term: Term = {
          identifier: facetResultTerm.key.toString(),
          label: facetResultTerm.key.toString(),
          count: facetResultTerm.count,
          key: facetResultTerm.key.toString(),
          selected: facetQuery !== undefined && facetQuery.terms?.includes(facetResultTerm.key.toString()),
        };
        return term;
      }),
    };
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
