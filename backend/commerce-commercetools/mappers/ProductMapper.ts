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
  Price as CommercetoolsPrice,
  ProductDiscount,
  ProductType as CommercetoolsProductType,
  ProductVariant as CommercetoolsProductVariant,
  ProductSearchResult as CommercetoolsProductSearchResult,
  TypedMoney,
  ProductSearchFacetResult,
  ProductSearchRequest,
  ProductSearchFacetExpression,
  ProductSearchFacetRangesExpression,
  ProductSearchFacetCountExpression,
  ProductSearchFacetDistinctExpression,
  ProductSearchFacetResultBucket,
  ProductSearchFacetResultCount,
  ProductSearchMatchingVariants as CommercetoolsProductSearchMatchingVariants,
} from '@commercetools/platform-sdk';
import { Product } from '@Types/product/Product';
import { DiscountValue, Variant } from '@Types/product/Variant';
import { Attributes } from '@Types/product/Attributes';
import { Category } from '@Types/product/Category';
import { Money } from '@Types/product/Money';
import { FilterField, FilterFieldTypes, FilterFieldValue } from '@Types/product/FilterField';
import { Facet, FacetTypes } from '@Types/result/Facet';
import { TermFacet } from '@Types/result/TermFacet';
import { RangeFacet } from '@Types/result/RangeFacet';
import { Term } from '@Types/result/Term';
import { ProductQuery } from '@Types/query/ProductQuery';
import { TermFacet as QueryTermFacet } from '@Types/query/TermFacet';
import { RangeFacet as QueryRangeFacet } from '@Types/query/RangeFacet';
import { FacetDefinition } from '@Types/product/FacetDefinition';
import { Locale } from '../Locale';
import { ProductRouter } from '../utils/routers/ProductRouter';

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

    for (let i = 0; i < commercetoolsProduct.productProjection.variants.length; i++) {
      variants.push(
        this.commercetoolsProductVariantToVariant(
          commercetoolsProduct.productProjection.variants[i],
          locale,
          commercetoolsProduct.matchingVariants,
        ),
      );
    }

    return variants;
  }

  static commercetoolsProductVariantToVariant(
    commercetoolsVariant: CommercetoolsProductVariant,
    locale: Locale,
    matchingVariants?: CommercetoolsProductSearchMatchingVariants,
  ): Variant {
    const attributes = this.commercetoolsAttributesToAttributes(commercetoolsVariant.attributes, locale);
    const { price, discountedPrice, discounts } = this.extractPriceAndDiscounts(commercetoolsVariant, locale);

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
      discounts: discounts,
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
      _url:
        commercetoolsCategory.ancestors.length > 0
          ? `/${commercetoolsCategory.ancestors
              ?.map((ancestor) => {
                return ancestor.obj?.slug?.[locale.language] ?? ancestor.id;
              })
              .join('/')}/${commercetoolsCategory.slug?.[locale.language] ?? commercetoolsCategory.id}`
          : `/${commercetoolsCategory.slug?.[locale.language] ?? commercetoolsCategory.id}`,
    };
  }

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
    commercetoolsProductDiscountValue: ProductDiscount,
    locale: Locale,
  ): DiscountValue[] {
    const productDiscountValue: DiscountValue = {
      type: commercetoolsProductDiscountValue.value.type,
      description: commercetoolsProductDiscountValue.description?.[locale.language],
    };

    if (commercetoolsProductDiscountValue.value.type == 'relative') {
      Object.assign(productDiscountValue, {
        permyriad: commercetoolsProductDiscountValue.value.permyriad,
      });
    }

    if (commercetoolsProductDiscountValue.value.type == 'absolute') {
      const discountValues = commercetoolsProductDiscountValue.value.money.map((money) => {
        return this.commercetoolsMoneyToMoney(money);
      });

      Object.assign(productDiscountValue, {
        value: discountValues,
      });
    }

    return [productDiscountValue];
  }

  static extractPriceAndDiscounts(commercetoolsVariant: CommercetoolsProductVariant, locale: Locale) {
    let price: Money | undefined;
    let discountedPrice: Money | undefined;
    let discounts: DiscountValue[] | undefined;

    if (commercetoolsVariant?.scopedPrice) {
      price = this.commercetoolsMoneyToMoney(commercetoolsVariant.scopedPrice?.value);
      if (commercetoolsVariant.scopedPrice?.discounted?.value) {
        discountedPrice = this.commercetoolsMoneyToMoney(commercetoolsVariant.scopedPrice?.discounted?.value);
      }

      if (commercetoolsVariant.scopedPrice?.discounted?.discount?.obj) {
        discounts = this.commercetoolsProductDiscountValueToProductDiscountValue(
          commercetoolsVariant.scopedPrice?.discounted?.discount?.obj,
          locale,
        );
      }

      return { price, discountedPrice, discounts };
    }

    if (commercetoolsVariant?.price) {
      price = this.commercetoolsMoneyToMoney(commercetoolsVariant.price?.value);
      if (commercetoolsVariant.price?.discounted?.value) {
        discountedPrice = this.commercetoolsMoneyToMoney(commercetoolsVariant.price?.discounted?.value);
      }

      if (commercetoolsVariant.price?.discounted?.discount?.obj) {
        discounts = this.commercetoolsProductDiscountValueToProductDiscountValue(
          commercetoolsVariant.price?.discounted?.discount?.obj,
          locale,
        );
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

      price = this.commercetoolsMoneyToMoney(commercetoolsPrice?.value);

      if (commercetoolsPrice?.discounted?.value) {
        discountedPrice = this.commercetoolsMoneyToMoney(commercetoolsPrice?.discounted?.value);
      }

      if (commercetoolsPrice?.discounted?.discount?.obj) {
        discounts = this.commercetoolsProductDiscountValueToProductDiscountValue(
          commercetoolsPrice?.discounted?.discount?.obj,
          locale,
        );
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
