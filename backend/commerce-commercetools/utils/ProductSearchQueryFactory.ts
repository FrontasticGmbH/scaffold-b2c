import { FacetDefinition } from '@Types/product';
import { Facet } from '@Types/query';
import { FilterTypes } from '@Types/query/Filter';
import { ProductQuery } from '@Types/query/ProductQuery';
import { RangeFilter } from '@Types/query/RangeFilter';
import { TermFilter } from '@Types/query/TermFilter';
import {
  SearchAnyValue,
  SearchExactExpression,
  ProductSearchFacetDistinctValue,
  ProductSearchFacetExpression,
  ProductSearchFacetRangesValue,
  SearchNumberRangeExpression,
  SearchNumberRangeValue,
  SearchOrExpression,
  SearchQuery,
  SearchQueryExpression,
  ProductSearchRequest,
  SearchWildCardExpression,
  _ProductSearchFacetExpression,
  ProductSearchFacetCountExpression,
  ProductSearchFacetDistinctExpression,
  ProductSearchFacetRangesExpression,
  _SearchQuery,
  SearchSorting,
} from '@commercetools/platform-sdk';
import { Locale } from '@Commerce-commercetools/interfaces/Locale';

const EXPANDS = [
  'categories[*].ancestors[*]',
  'categories[*].parent',
  'masterVariant.price.discounted.discount',
  'masterVariant.prices[*].discounted.discount',
  'variants[*].price.discounted.discount',
  'variants[*].prices[*].discounted.discount',
  'productType',
];
const LOCALIZED_FULLTEXT_QUERY_FIELDS = ['name', 'description', 'slug', 'searchKeywords'];
const KEYWORD_EXACT_QUERY_FIELDS = ['variants.sku'];

type Writeable<T> = { -readonly [P in keyof T]: Writeable<T[P]> };

type ProductSearchFactoryUtilMethod = (
  commercetoolsProductSearchRequest: ProductSearchRequest,
  productQuery: ProductQuery,
  locale: Locale,
) => ProductSearchRequest;

export class ProductSearchFactory {
  static createCommercetoolsProductSearchRequestFromProductQuery(
    productQuery: ProductQuery,
    facetDefinitions: FacetDefinition[],
    locale: Locale,
    productIdField: string,
  ): ProductSearchRequest {
    let commercetoolsProductSearchRequest = ProductSearchFactory.initializeProductSearchRequestObject(
      productQuery,
      locale,
    );

    commercetoolsProductSearchRequest = this.applyQueryString(commercetoolsProductSearchRequest, productQuery, locale);
    commercetoolsProductSearchRequest = this.applyQueryCategories(
      commercetoolsProductSearchRequest,
      productQuery,
      locale,
    );
    commercetoolsProductSearchRequest = this.applyQueryProducts(
      commercetoolsProductSearchRequest,
      productQuery,
      productIdField,
    );
    commercetoolsProductSearchRequest = this.applyQueryProductTypeId(commercetoolsProductSearchRequest, productQuery);
    commercetoolsProductSearchRequest = this.applyProductSelection(
      commercetoolsProductSearchRequest,
      productQuery,
      locale,
    );
    commercetoolsProductSearchRequest = this.applyQuerySKUs(commercetoolsProductSearchRequest, productQuery, locale);
    commercetoolsProductSearchRequest = this.applyFilters(
      commercetoolsProductSearchRequest,
      productQuery,
      facetDefinitions,
      locale,
    );
    commercetoolsProductSearchRequest = this.applyFacets(
      commercetoolsProductSearchRequest,
      productQuery,
      facetDefinitions,
      locale,
    );
    commercetoolsProductSearchRequest = this.applySortAttributes(
      commercetoolsProductSearchRequest,
      productQuery,
      facetDefinitions,
      locale,
    );
    commercetoolsProductSearchRequest = this.rearrangeProductSearchQuery(commercetoolsProductSearchRequest);
    commercetoolsProductSearchRequest = this.rearrangeProductSearchPostFilter(commercetoolsProductSearchRequest);
    commercetoolsProductSearchRequest = this.rearrangeProductSearchFacets(commercetoolsProductSearchRequest);
    commercetoolsProductSearchRequest = this.applyDefaultQueryIfEmpty(
      commercetoolsProductSearchRequest,
      productQuery,
      locale,
    );

    return commercetoolsProductSearchRequest;
  }

  private static initializeProductSearchRequestObject(
    productQuery: ProductQuery,
    locale: Locale,
  ): ProductSearchRequest {
    const commercetoolsProductSearchRequest: Writeable<ProductSearchRequest> = {
      query: {},
      productProjectionParameters: {
        priceCountry: locale.country,
        priceCurrency: locale.currency,
        expand: EXPANDS,
      },
      markMatchingVariants: true,
      postFilter: {},
    };

    commercetoolsProductSearchRequest.limit = +productQuery.limit || 24;
    commercetoolsProductSearchRequest.offset = this.getOffsetFromCursor(productQuery.cursor);

    if (productQuery.accountGroupId) {
      commercetoolsProductSearchRequest.productProjectionParameters.priceCustomerGroup = productQuery.accountGroupId;
    }

    return commercetoolsProductSearchRequest;
  }

  /**
   * Rearrange the query by removing extra "and" and "or" fields
   *
   * @param {ProductSearchRequest} commercetoolsProductSearchRequest - the original product search request
   * @return {ProductSearchRequest} the rearranged product search request
   */
  private static rearrangeProductSearchQuery(
    commercetoolsProductSearchRequest: ProductSearchRequest,
  ): ProductSearchRequest {
    const query = this.rearrangeSearchQuery(commercetoolsProductSearchRequest.query);

    return { ...commercetoolsProductSearchRequest, query };
  }

  /**
   * Rearrange the postFilter by removing extra "and" and "or" fields
   *
   * @param {ProductSearchRequest} commercetoolsProductSearchRequest - the original product search request
   * @return {ProductSearchRequest} the rearranged product search request
   */
  private static rearrangeProductSearchPostFilter(
    commercetoolsProductSearchRequest: ProductSearchRequest,
  ): ProductSearchRequest {
    const postFilter = this.rearrangeSearchQuery(commercetoolsProductSearchRequest.postFilter);

    return { ...commercetoolsProductSearchRequest, postFilter };
  }

  /**
   * Rearrange the facets filters by by removing extra "and" and "or" fields
   *
   * @param {ProductSearchRequest} commercetoolsProductSearchRequest - the original product search request
   * @return {ProductSearchRequest} the rearranged product search request
   */
  private static rearrangeProductSearchFacets(
    commercetoolsProductSearchRequest: ProductSearchRequest,
  ): ProductSearchRequest {
    const facets = commercetoolsProductSearchRequest.facets?.map((facet) => {
      switch (true) {
        case 'count' in facet:
          (facet as Writeable<ProductSearchFacetCountExpression>).count.filter = this.rearrangeSearchQuery(
            (facet as ProductSearchFacetCountExpression).count.filter,
          );
          break;
        case 'distinct' in facet:
          (facet as Writeable<ProductSearchFacetDistinctExpression>).distinct.filter = this.rearrangeSearchQuery(
            (facet as ProductSearchFacetDistinctExpression).distinct.filter,
          );
          break;
        case 'ranges' in facet:
          (facet as Writeable<ProductSearchFacetRangesExpression>).ranges.filter = this.rearrangeSearchQuery(
            (facet as ProductSearchFacetRangesExpression).ranges.filter,
          );
      }

      return facet;
    });

    return {
      ...commercetoolsProductSearchRequest,
      facets,
    };
  }

  /**
   * Rearrange the searchQuery by removing extra "and" and "or" fields
   */
  private static rearrangeSearchQuery(searchQuery: _SearchQuery | undefined): _SearchQuery | undefined {
    if (!searchQuery) {
      return undefined;
    }

    const intermediateValues: {
      orLength: number;
      andLength: number;
      orList: SearchQuery[];
      andList: SearchQuery[];
    } = {
      orLength: 0,
      andLength: 0,
      orList: [],
      andList: [],
    };

    if ('or' in searchQuery) {
      intermediateValues.orLength = searchQuery.or.length || 0;
      intermediateValues.orList = searchQuery.or;
    }

    if ('and' in searchQuery) {
      intermediateValues.andLength = searchQuery.and.length || 0;
      intermediateValues.andList = searchQuery.and;
    }

    // If neither "or" nor "and" fields exist or they have a length of 0, an empty searchQuery object is returned.
    if (intermediateValues.orLength === 0 && intermediateValues.andLength === 0) {
      return undefined;
    }

    // If only one "or" and one "and" field, and they have the same field name, the function returns the "or" field.
    if (intermediateValues.orLength === 1 && intermediateValues.andLength === 1) {
      const orField =
        'exact' in intermediateValues.orList[0]
          ? (intermediateValues.orList[0] as SearchExactExpression).exact?.field
          : undefined;
      const andField =
        'exact' in intermediateValues.andList[0]
          ? (intermediateValues.andList[0] as SearchExactExpression).exact?.field
          : 'range' in intermediateValues.andList[0]
            ? (intermediateValues.andList[0] as SearchNumberRangeExpression).range?.field
            : undefined;

      if (orField === andField) {
        return intermediateValues.andList[0] as _SearchQuery;
      }

      return {
        or: [intermediateValues.andList[0], intermediateValues.orList[0]] as SearchQuery,
      };
    }

    // If only one "or" field and multiple "and" fields, the function add the "or" fields to the "and" fields
    if (intermediateValues.orLength === 1 && intermediateValues.andLength > 0) {
      return {
        and: [...intermediateValues.andList, intermediateValues.orList[0]] as SearchQuery,
      };
    }

    // If only one "and" field and multiple "or" fields, the function add the "and" fields to the "or" fields
    if (intermediateValues.andLength === 1 && intermediateValues.orLength > 0) {
      return {
        or: [...intermediateValues.orList, intermediateValues.andList[0]] as SearchQuery,
      };
    }

    // If there is only one "or" field, the function returns it
    if (intermediateValues.andLength === 0) {
      if (intermediateValues.orLength === 1) {
        return intermediateValues.orList[0] as _SearchQuery;
      }
      return {
        or: intermediateValues.orList,
      };
    }

    // If there is only one "and" field, the function returns it
    if (intermediateValues.orLength === 0) {
      if (intermediateValues.andLength === 1) {
        return intermediateValues.andList[0] as _SearchQuery;
      }
      return {
        and: intermediateValues.andList,
      };
    }

    // If there are multiple "or" or "and" fields
    return searchQuery;
  }

  private static pushToProductSearchRequestQueryAndExpression: (
    commercetoolsProductSearchRequest: Writeable<ProductSearchRequest>,
    expression: SearchQuery | SearchQuery[],
  ) => ProductSearchRequest = (
    commercetoolsProductSearchRequest: ProductSearchRequest,
    expression: SearchQuery | SearchQuery[],
  ) => {
    if ('and' in commercetoolsProductSearchRequest.query) {
      if (Array.isArray(expression)) {
        commercetoolsProductSearchRequest.query.and.push(...expression);
      } else {
        commercetoolsProductSearchRequest.query.and.push(expression);
      }
    } else {
      if (Array.isArray(expression)) {
        (commercetoolsProductSearchRequest.query as Writeable<SearchQuery>) = {
          ...commercetoolsProductSearchRequest.query,
          and: [...expression],
        };
      } else {
        (commercetoolsProductSearchRequest.query as Writeable<SearchQuery>) = {
          ...commercetoolsProductSearchRequest.query,
          and: [expression],
        };
      }
    }
    return commercetoolsProductSearchRequest;
  };

  private static pushToProductSearchRequestQueryOrExpression: (
    commercetoolsProductSearchRequest: Writeable<ProductSearchRequest>,
    expression: SearchQuery | SearchQuery[],
  ) => ProductSearchRequest = (
    commercetoolsProductSearchRequest: ProductSearchRequest,
    expression: SearchQuery | SearchQuery[],
  ) => {
    if ('or' in commercetoolsProductSearchRequest.query) {
      if (Array.isArray(expression)) {
        commercetoolsProductSearchRequest.query.or.push(...expression);
      } else {
        commercetoolsProductSearchRequest.query.or.push(expression);
      }
    } else {
      if (Array.isArray(expression)) {
        (commercetoolsProductSearchRequest.query as Writeable<SearchQuery>) = {
          ...commercetoolsProductSearchRequest.query,
          or: [...expression],
        };
      } else {
        (commercetoolsProductSearchRequest.query as Writeable<SearchQuery>) = {
          ...commercetoolsProductSearchRequest.query,
          or: [expression],
        };
      }
    }
    return commercetoolsProductSearchRequest;
  };

  private static pushToProductSearchRequestPostFilterAndExpression: (
    commercetoolsProductSearchRequest: Writeable<ProductSearchRequest>,
    expression: SearchQuery | SearchQuery[],
  ) => ProductSearchRequest = (
    commercetoolsProductSearchRequest: ProductSearchRequest,
    expression: SearchQuery | SearchQuery[],
  ) => {
    if ('and' in commercetoolsProductSearchRequest.postFilter) {
      if (Array.isArray(expression)) {
        commercetoolsProductSearchRequest.postFilter.and.push(...expression);
      } else {
        commercetoolsProductSearchRequest.postFilter.and.push(expression);
      }
    } else {
      if (Array.isArray(expression)) {
        (commercetoolsProductSearchRequest.postFilter as Writeable<SearchQuery>) = {
          ...commercetoolsProductSearchRequest.postFilter,
          and: [...expression],
        };
      } else {
        (commercetoolsProductSearchRequest.postFilter as Writeable<SearchQuery>) = {
          ...commercetoolsProductSearchRequest.postFilter,
          and: [expression],
        };
      }
    }
    return commercetoolsProductSearchRequest;
  };

  private static pushToProductSearchFacetExpressionFilterAndExpression: (
    productSearchFacetExpression: Writeable<ProductSearchFacetExpression>,
    expression: SearchQuery | SearchQuery[],
  ) => ProductSearchFacetExpression = (
    productSearchFacetExpression: ProductSearchFacetExpression,
    expression: SearchQuery | SearchQuery[],
  ) => {
    switch (true) {
      case 'count' in productSearchFacetExpression:
        (productSearchFacetExpression as Writeable<ProductSearchFacetCountExpression>).count.filter =
          this.pushToSeachQueryAndExpresion(
            (productSearchFacetExpression as ProductSearchFacetCountExpression).count.filter,
            expression,
          );
        break;
      case 'distinct' in productSearchFacetExpression:
        (productSearchFacetExpression as Writeable<ProductSearchFacetDistinctExpression>).distinct.filter =
          this.pushToSeachQueryAndExpresion(
            (productSearchFacetExpression as ProductSearchFacetDistinctExpression).distinct.filter,
            expression,
          );
        break;
      case 'ranges' in productSearchFacetExpression:
        (productSearchFacetExpression as Writeable<ProductSearchFacetRangesExpression>).ranges.filter =
          this.pushToSeachQueryAndExpresion(
            (productSearchFacetExpression as ProductSearchFacetRangesExpression).ranges.filter,
            expression,
          );
        break;
    }

    return productSearchFacetExpression;
  };

  private static pushToSeachQueryAndExpresion: (
    filter: Writeable<_SearchQuery>,
    expression: SearchQuery | SearchQuery[],
  ) => _SearchQuery = (filter: _SearchQuery, expression: SearchQuery | SearchQuery[]) => {
    if (filter && 'and' in filter) {
      if (Array.isArray(expression)) {
        filter.and.push(...expression);
      } else {
        filter.and.push(expression);
      }
    } else {
      if (Array.isArray(expression)) {
        (filter as Writeable<SearchQuery>) = {
          ...filter,
          and: [...expression],
        };
      } else {
        (filter as Writeable<SearchQuery>) = {
          ...filter,
          and: [expression],
        };
      }
    }

    return filter;
  };

  private static applyQueryString: ProductSearchFactoryUtilMethod = (
    commercetoolsProductSearchRequest: ProductSearchRequest,
    productQuery: ProductQuery,
    locale: Locale,
  ) => {
    if (productQuery.query) {
      let queryValue: string = undefined;

      switch (true) {
        case typeof productQuery.query === 'string':
          queryValue = productQuery.query as string;
          break;
        case typeof productQuery.query === 'object':
          queryValue = (productQuery.query[locale.language] as string) ?? (productQuery.query[0] as string);
          break;
        default:
          break;
      }

      const productSearchOrExpression: SearchOrExpression = {
        or: [],
      };
      LOCALIZED_FULLTEXT_QUERY_FIELDS.forEach((field) => {
        const fullTextQuery: SearchWildCardExpression = {
          wildcard: {
            field,
            language: locale.language,
            value: `*${queryValue}*`,
            caseInsensitive: true,
          },
        };
        productSearchOrExpression.or.push(fullTextQuery);
      });

      // Allow exact search for other values passed in query
      KEYWORD_EXACT_QUERY_FIELDS.forEach((field) => {
        const exactFieldQuery: SearchExactExpression = {
          exact: {
            field,
            value: queryValue,
            caseInsensitive: true,
          },
        };
        productSearchOrExpression.or.push(exactFieldQuery);
      });

      commercetoolsProductSearchRequest = this.pushToProductSearchRequestQueryAndExpression(
        commercetoolsProductSearchRequest,
        productSearchOrExpression,
      );
    }

    return commercetoolsProductSearchRequest;
  };

  private static applyDefaultQueryIfEmpty: ProductSearchFactoryUtilMethod = (
    commercetoolsProductSearchRequest: ProductSearchRequest,
    productQuery: ProductQuery,
    locale: Locale,
  ) => {
    const isProductSearchQueryEmpty =
      !commercetoolsProductSearchRequest.query || Object.keys(commercetoolsProductSearchRequest.query).length === 0;

    if (!productQuery.query && isProductSearchQueryEmpty) {
      const productSearchWildCardExpression: SearchWildCardExpression = {
        wildcard: {
          field: 'name',
          language: locale.language,
          value: '*',
        },
      };
      commercetoolsProductSearchRequest = {
        ...commercetoolsProductSearchRequest,
        query: productSearchWildCardExpression,
      };
    }
    return commercetoolsProductSearchRequest;
  };

  private static applyQueryCategories: ProductSearchFactoryUtilMethod = (
    commercetoolsProductSearchRequest: ProductSearchRequest,
    productQuery: ProductQuery,
  ) => {
    if (productQuery.categories?.length) {
      const productSearchExactExpressions: SearchExactExpression[] = [];
      productQuery.categories.forEach((categoryId) => {
        productSearchExactExpressions.push({
          exact: {
            field: 'categoriesSubTree',
            value: categoryId,
          },
        });
      });
      commercetoolsProductSearchRequest = this.pushToProductSearchRequestQueryAndExpression(
        commercetoolsProductSearchRequest,
        productSearchExactExpressions,
      );
    }
    return commercetoolsProductSearchRequest;
  };

  private static applyProductSelection: ProductSearchFactoryUtilMethod = (
    commercetoolsProductSearchRequest: ProductSearchRequest,
    productQuery: ProductQuery,
  ) => {
    if (productQuery.productSelectionId) {
      const productSearchExactExpressions: SearchExactExpression[] = [];
      productSearchExactExpressions.push({
        exact: {
          field: 'productSelections',
          value: productQuery.productSelectionId,
        },
      });

      productSearchExactExpressions.push({
        exact: {
          field: 'variants.productSelections',
          value: productQuery.productSelectionId,
        },
      });

      commercetoolsProductSearchRequest = this.pushToProductSearchRequestQueryAndExpression(
        commercetoolsProductSearchRequest,
        productSearchExactExpressions,
      );
    }
    return commercetoolsProductSearchRequest;
  };

  private static applyQueryProducts(
    commercetoolsProductSearchRequest: ProductSearchRequest,
    productQuery: ProductQuery,
    productIdField: string,
  ): ProductSearchRequest {
    // Handle productRefs base on value set in productIdField
    if (productQuery.productRefs?.length) {
      switch (productIdField) {
        case 'id':
          productQuery.productIds.push(...productQuery.productRefs);
          break;
        case 'key':
        default:
          productQuery.productKeys.push(...productQuery.productRefs);
          break;
      }
    }

    if (productQuery.productIds?.length) {
      const productSearchExactExpressions: SearchExactExpression[] = [];

      productQuery.productIds.forEach((productId) => {
        productSearchExactExpressions.push({
          exact: {
            field: 'id',
            value: productId,
          },
        });
      });
      commercetoolsProductSearchRequest = this.pushToProductSearchRequestQueryOrExpression(
        commercetoolsProductSearchRequest,
        productSearchExactExpressions,
      );
    }

    if (productQuery.productKeys?.length) {
      const productSearchExactExpressions: SearchExactExpression[] = [];

      productQuery.productKeys.forEach((productId) => {
        productSearchExactExpressions.push({
          exact: {
            field: 'key',
            value: productId,
          },
        });
      });
      commercetoolsProductSearchRequest = this.pushToProductSearchRequestQueryOrExpression(
        commercetoolsProductSearchRequest,
        productSearchExactExpressions,
      );
    }

    return commercetoolsProductSearchRequest;
  }

  private static applyQueryProductTypeId(
    commercetoolsProductSearchRequest: ProductSearchRequest,
    productQuery: ProductQuery,
  ): ProductSearchRequest {
    if (productQuery.productTypeId) {
      commercetoolsProductSearchRequest = this.pushToProductSearchRequestQueryAndExpression(
        commercetoolsProductSearchRequest,
        {
          exact: {
            field: 'productType',
            value: productQuery.productTypeId,
          },
        },
      );
    }
    return commercetoolsProductSearchRequest;
  }

  private static applyQuerySKUs: ProductSearchFactoryUtilMethod = (
    commercetoolsProductSearchRequest: ProductSearchRequest,
    productQuery: ProductQuery,
  ) => {
    if (productQuery.skus?.length) {
      const productSearchExactExpressions: SearchExactExpression[] = [];
      productQuery.skus.forEach((sku) => {
        productSearchExactExpressions.push({
          exact: {
            field: 'variants.sku',
            value: sku,
          },
        });
      });
      commercetoolsProductSearchRequest = this.pushToProductSearchRequestQueryOrExpression(
        commercetoolsProductSearchRequest,
        productSearchExactExpressions,
      );
    }
    return commercetoolsProductSearchRequest;
  };

  private static applyFilters(
    commercetoolsProductSearchRequest: ProductSearchRequest,
    productQuery: ProductQuery,
    facetDefinitions: FacetDefinition[],
    locale: Locale,
  ): ProductSearchRequest {
    if (productQuery.filters?.length) {
      const productSearchExpressions: (SearchExactExpression | SearchNumberRangeExpression)[] = [];
      productQuery.filters.forEach((filter) => {
        const filterFiled = `variants.${filter.identifier}`;

        switch (filter.type) {
          case FilterTypes.TERM:
          case FilterTypes.ENUM:
            (filter as TermFilter).terms.forEach((term) => {
              const productSearchExactSearchExpression: SearchExactExpression = {
                exact: this.hydrateProductSearchExpressionValue(
                  {
                    field: filterFiled,
                    value: term,
                  },
                  facetDefinitions,
                  locale,
                ) as SearchAnyValue,
              };
              productSearchExpressions.push(productSearchExactSearchExpression);
            });
            break;

          case FilterTypes.BOOLEAN:
            const productSearchExactSearchExpression: SearchExactExpression = {
              exact: this.hydrateProductSearchExpressionValue(
                {
                  field: filterFiled,
                  value: (filter as TermFilter).terms[0]?.toString().toLowerCase() === 'true',
                },
                facetDefinitions,
                locale,
              ) as SearchAnyValue,
            };
            productSearchExpressions.push(productSearchExactSearchExpression);
            break;

          case FilterTypes.RANGE:
            const rangeQuery: Writeable<SearchNumberRangeExpression> = {
              range: this.hydrateProductSearchExpressionValue(
                {
                  field: filterFiled,
                },
                facetDefinitions,
                locale,
              ) as SearchNumberRangeValue,
            };
            if ((filter as RangeFilter).min) {
              rangeQuery.range.gte = (filter as RangeFilter).min;
            }
            if ((filter as RangeFilter).max) {
              rangeQuery.range.lte = (filter as RangeFilter).max;
            }
            productSearchExpressions.push(rangeQuery);
            break;
        }
      });
      commercetoolsProductSearchRequest = this.pushToProductSearchRequestQueryAndExpression(
        commercetoolsProductSearchRequest,
        productSearchExpressions,
      );
    }
    return commercetoolsProductSearchRequest;
  }

  private static applySortAttributes: (
    commercetoolsProductSearchRequest: Writeable<ProductSearchRequest>,
    productQuery: ProductQuery,
    facetDefinitions: FacetDefinition[],
    locale: Locale,
  ) => ProductSearchRequest = (
    commercetoolsProductSearchRequest: Writeable<ProductSearchRequest>,
    productQuery: ProductQuery,
    facetDefinitions: FacetDefinition[],
    locale: Locale,
  ) => {
    const searchSortings: SearchSorting[] = [];

    switch (true) {
      case productQuery.sortAttributes !== undefined:
        Object.entries(productQuery.sortAttributes).forEach(([sortAttributeKey, sortAttributeOrder]) => {
          let searchSorting: SearchSorting = {
            order: sortAttributeOrder,
            field: sortAttributeKey,
          };

          switch (true) {
            case sortAttributeKey === 'price':
              searchSorting = {
                ...searchSorting,
                field: 'variants.prices.centAmount',
              };
              break;
            case sortAttributeKey === 'description' || sortAttributeKey === 'name' || sortAttributeKey === 'slug':
              searchSorting = {
                ...searchSorting,
                language: locale.language,
              };
              break;
            default:
          }

          const facetDefinition = facetDefinitions.find(
            (facetDefinition) => facetDefinition.attributeId === sortAttributeKey,
          );

          if (facetDefinition) {
            searchSorting = {
              ...searchSorting,
              ...this.facetDefinitionToSearchSorting(facetDefinition, locale),
            };
          }

          searchSortings.push(searchSorting);
        });

        break;
      default:
        // By default, in CoCo, search results are sorted descending by their relevancy with respect to the provided
        // text (that is their “score”). Sorting by score and then by id will ensure consistent products order
        // across several search requests for products that have the same relevance score.
        const scoreSorting: SearchSorting = {
          order: 'desc',
          field: 'score',
        };

        const idSorting: SearchSorting = {
          order: 'desc',
          field: 'id',
        };
        searchSortings.push(scoreSorting, idSorting);
    }

    commercetoolsProductSearchRequest.sort = searchSortings;

    return commercetoolsProductSearchRequest;
  };

  private static applyFacets: (
    commercetoolsProductSearchRequest: ProductSearchRequest,
    productQuery: ProductQuery,
    facetDefinitions: FacetDefinition[],
    locale: Locale,
  ) => ProductSearchRequest = (
    commercetoolsProductSearchRequest: ProductSearchRequest,
    productQuery: ProductQuery,
    facetDefinitions: FacetDefinition[],
    locale: Locale,
  ) => {
    commercetoolsProductSearchRequest = this.applyFacetDefinitionsToFacets(
      commercetoolsProductSearchRequest,
      productQuery,
      facetDefinitions,
      locale,
    );
    return commercetoolsProductSearchRequest;
  };

  private static applyFacetDefinitionsToFacets: (
    commercetoolsProductSearchRequest: ProductSearchRequest,
    productQuery: ProductQuery,
    facetDefinitions: FacetDefinition[],
    locale: Locale,
  ) => ProductSearchRequest = (
    commercetoolsProductSearchRequest: Writeable<ProductSearchRequest>,
    productQuery: ProductQuery,
    facetDefinitions: FacetDefinition[],
    locale: Locale,
  ) => {
    const productSearchFacetExpressions = this.facetDefinitionsToProductSearchFacetExpressions(
      facetDefinitions,
      locale,
    );

    if (productSearchFacetExpressions.length) {
      if (productQuery.facets?.length) {
        productQuery.facets.forEach((queryFacet) => {
          let searchQuery: _SearchQuery;

          const productSearchFacetExpression = productSearchFacetExpressions.find(
            (productSearchFacetExpression) =>
              this.getProductSearchFacetIdentifier(productSearchFacetExpression) === queryFacet.identifier,
          );

          if (!productSearchFacetExpression) {
            return;
          }

          switch (queryFacet.type) {
            case FilterTypes.TERM:
              searchQuery = this.getSearchQueryFilterExpressionFromTermFacet(
                productSearchFacetExpression,
                queryFacet,
                locale,
              );
              break;
            case FilterTypes.BOOLEAN:
              searchQuery = this.getSearchQueryFilterExpressionFromBooleanFacet(
                productSearchFacetExpression,
                queryFacet,
                locale,
              );
              break;
            case FilterTypes.RANGE:
              searchQuery = this.getSearchQueryFilterExpressionFromRangeFacet(
                productSearchFacetExpression,
                queryFacet,
                locale,
              );
              break;
          }

          if (!searchQuery) {
            return;
          }

          // Apply filters to PostFilter
          commercetoolsProductSearchRequest = this.pushToProductSearchRequestPostFilterAndExpression(
            commercetoolsProductSearchRequest,
            searchQuery,
          );

          // Apply filters to productSearchFacetExpressions
          productSearchFacetExpressions.map((productSearchFacetExpression: ProductSearchFacetExpression) => {
            // Filters are only applied to the facets that are not the same as the current queryFacet
            if (this.getProductSearchFacetIdentifier(productSearchFacetExpression) !== queryFacet.identifier) {
              productSearchFacetExpression = this.pushToProductSearchFacetExpressionFilterAndExpression(
                productSearchFacetExpression,
                searchQuery,
              );
            }

            return productSearchFacetExpression;
          });
        });
      }

      commercetoolsProductSearchRequest.facets = productSearchFacetExpressions;
    }

    return commercetoolsProductSearchRequest;
  };

  private static hydrateQueryExpressionWithAttributeType = (
    facet: _ProductSearchFacetExpression,
    query: Writeable<SearchQueryExpression>,
    locale: Locale,
  ): SearchQueryExpression => {
    if ('distinct' in facet) {
      const fieldType = facet.distinct.fieldType;
      if (fieldType) {
        query = {
          ...query,
          fieldType,
        };
        query = this.hydrateQueryExpressionWithLanguage(query, fieldType, locale);
      }
    }
    if ('ranges' in facet) {
      const fieldType = facet.ranges.fieldType;
      if (fieldType) {
        query = {
          ...query,
          fieldType,
        };
        query = this.hydrateQueryExpressionWithLanguage(query, fieldType, locale);
      }
    }

    return query;
  };

  private static hydrateQueryExpressionWithLanguage = (
    query: Writeable<SearchQueryExpression>,
    fieldType: string,
    locale: Locale,
  ): SearchQueryExpression => {
    if (['ltext', 'lenum'].includes(fieldType)) {
      query = {
        ...query,
        language: locale.language,
      };
    }
    return query;
  };

  private static hydrateProductSearchExpressionValue = (
    productSearchExpressionsValue: SearchAnyValue | SearchNumberRangeValue,
    facetDefinitions: FacetDefinition[],
    locale: Locale,
  ): SearchAnyValue | SearchNumberRangeValue => {
    // Only hydrate if the field is an attribute
    if (productSearchExpressionsValue.field.includes('attributes')) {
      const facetDefinition = facetDefinitions.find(
        (facetDefinition) => facetDefinition.attributeId === productSearchExpressionsValue.field,
      );
      if (facetDefinition) {
        const facetValue = this.facetDefinitionToFacetValue(facetDefinition, locale);
        return {
          ...productSearchExpressionsValue,
          ...facetValue,
        };
      }
    }
    return productSearchExpressionsValue;
  };

  private static getFacetSearchExpressionFieldIdentifier = (facet: _ProductSearchFacetExpression): string => {
    if ('distinct' in facet) {
      return facet.distinct.field;
    }
    if ('ranges' in facet) {
      return facet.ranges.field;
    }
    if ('count' in facet) {
      return facet.count.name;
    }
    return '';
  };

  private static facetDefinitionsToProductSearchFacetExpressions = (
    facetDefinitions: FacetDefinition[],
    locale: Locale,
  ): ProductSearchFacetExpression[] => {
    const searchFacetExpressions: ProductSearchFacetExpression[] = [];

    facetDefinitions?.forEach((facetDefinition) => {
      let facet: ProductSearchFacetExpression;
      const facetValue = this.facetDefinitionToFacetValue(facetDefinition, locale);

      switch (facetDefinition.attributeType) {
        case 'enum':
        case 'lenum':
        case 'ltext':
        case 'boolean':
        case 'text':
        case 'number':
        case 'reference':
          facet = {
            distinct: {
              ...facetValue,
              level: 'products',
              sort: {
                by: 'key',
                order: 'asc',
              },
            },
          };
          break;

        case 'money':
        case 'range':
          facet = {
            ranges: {
              ...facetValue,
              level: 'products',
              ranges: [
                {
                  from: 0,
                },
              ],
            },
          };
          break;

        default:
          facet = {
            count: {
              ...facetValue,
              level: 'products',
              scope: 'all',
            },
          };
          break;
      }

      // Alias to identifier used by FE
      searchFacetExpressions.push(facet);
    });

    return searchFacetExpressions;
  };

  private static facetDefinitionToFacetValue = (
    facetDefinition: FacetDefinition,
    locale: Locale,
  ):
    | Pick<ProductSearchFacetDistinctValue, 'name' | 'field' | 'fieldType' | 'language'>
    | Pick<ProductSearchFacetRangesValue, 'name' | 'field' | 'fieldType'> => {
    switch (facetDefinition.attributeType) {
      case 'money':
        return {
          name: facetDefinition.attributeId,
          field: `${facetDefinition.attributeId}.centAmount`,
        };

      case 'enum':
        return {
          name: facetDefinition.attributeId,
          field: `${facetDefinition.attributeId}.key`,
          fieldType: facetDefinition.attributeType,
        };

      case 'lenum':
        return {
          name: facetDefinition.attributeId,
          field: `${facetDefinition.attributeId}.key`,
          fieldType: facetDefinition.attributeType,
          language: locale.language,
        };

      case 'ltext':
        return {
          name: facetDefinition.attributeId,
          field: facetDefinition.attributeId,
          fieldType: facetDefinition.attributeType,
          language: locale.language,
        };

      case 'text':
      case 'number':
      case 'boolean':
        return {
          name: facetDefinition.attributeId,
          field: facetDefinition.attributeId,
          fieldType: facetDefinition.attributeType,
        };

      case 'reference':
        return {
          name: facetDefinition.attributeId,
          field: `${facetDefinition.attributeId}.id`,
          fieldType: facetDefinition.attributeType,
        };

      case 'range':
      default:
        return {
          name: facetDefinition.attributeId,
          field: facetDefinition.attributeId,
        };
    }
  };

  private static getOffsetFromCursor(cursor: string): number {
    if (cursor === undefined) {
      return undefined;
    }

    const offsetMach = cursor.match(/(?<=offset:).+/);
    return offsetMach !== null ? +Object.values(offsetMach)[0] : undefined;
  }

  private static getSearchQueryFilterExpressionFromRangeFacet(
    searchFacetExpression: _ProductSearchFacetExpression,
    queryFacet: Facet,
    locale: Locale,
  ): SearchQueryExpression {
    const searchQueryExpressions: SearchQueryExpression[] = [];

    const searchNumberRangeExpression: Writeable<SearchNumberRangeExpression> = {
      range: this.hydrateQueryExpressionWithAttributeType(
        searchFacetExpression,
        {
          field: this.getFacetSearchExpressionFieldIdentifier(searchFacetExpression),
        },
        locale,
      ) as SearchNumberRangeValue,
    };
    if ((queryFacet as RangeFilter).min) {
      searchNumberRangeExpression.range.gte = (queryFacet as RangeFilter).min;
    }
    if ((queryFacet as RangeFilter).max) {
      searchNumberRangeExpression.range.lte = (queryFacet as RangeFilter).max;
    }

    searchQueryExpressions.push(searchNumberRangeExpression);

    // If the queryFacet is a price range, we also need to specify the currencyCode
    if (queryFacet.identifier === 'variants.prices') {
      // Add one more filter for the currencyCode
      const searchExactExpresionPriceCurrencyCode: SearchExactExpression = {
        exact: {
          field: `${queryFacet.identifier}.currencyCode`,
          value: locale.currency,
        },
      };
      searchQueryExpressions.push(searchExactExpresionPriceCurrencyCode);
    }

    if (searchQueryExpressions.length === 1) {
      return searchQueryExpressions[0];
    }

    return {
      and: searchQueryExpressions.map((searchQueryExpression) => searchQueryExpression),
    };
  }

  private static getSearchQueryFilterExpressionFromBooleanFacet(
    searchFacetExpression: _ProductSearchFacetExpression,
    queryFacet: Facet,
    locale: Locale,
  ): SearchQueryExpression {
    return {
      exact: this.hydrateQueryExpressionWithAttributeType(
        searchFacetExpression,
        {
          field: this.getFacetSearchExpressionFieldIdentifier(searchFacetExpression),
          value: (queryFacet as TermFilter).terms[0]?.toString().toLowerCase() === 'true',
        },
        locale,
      ),
    };
  }

  private static getSearchQueryFilterExpressionFromTermFacetValue(
    searchFacetExpression: _ProductSearchFacetExpression,
    term: string,
    locale: Locale,
  ): SearchQueryExpression {
    return {
      exact: this.hydrateQueryExpressionWithAttributeType(
        searchFacetExpression,
        {
          field: this.getFacetSearchExpressionFieldIdentifier(searchFacetExpression),
          value: term,
        },
        locale,
      ),
    };
  }

  private static getSearchQueryFilterExpressionFromTermFacet(
    searchFacetExpression: _ProductSearchFacetExpression,
    queryFacet: Facet,
    locale: Locale,
  ): SearchQueryExpression {
    const searchQueryExpressions: SearchQueryExpression[] = [];

    (queryFacet as TermFilter).terms.forEach((term) =>
      // Create a filter expression for each term
      searchQueryExpressions.push(
        this.getSearchQueryFilterExpressionFromTermFacetValue(searchFacetExpression, term, locale),
      ),
    );

    if (searchQueryExpressions.length === 1) {
      return searchQueryExpressions[0];
    }

    // Add the filter expressions to the product search post filter using OR expression if there are multiple terms
    return {
      or: searchQueryExpressions.map((searchQueryExpression) => searchQueryExpression),
    };
  }

  private static getProductSearchFacetIdentifier(facet: _ProductSearchFacetExpression): string {
    return (
      ('count' in facet && facet.count?.name) ||
      ('distinct' in facet && facet.distinct?.name) ||
      ('ranges' in facet && facet.ranges?.name)
    );
  }

  private static facetDefinitionToSearchSorting(
    facetDefinition: FacetDefinition,
    locale: Locale,
  ): Pick<SearchSorting, 'field' | 'fieldType' | 'language'> {
    switch (facetDefinition.attributeType) {
      case 'money':
        return {
          field: `${facetDefinition.attributeId}.centAmount`,
        };

      case 'enum':
        return {
          field: `${facetDefinition.attributeId}.key`,
          fieldType: 'enum',
        };

      case 'lenum':
        return {
          field: `${facetDefinition.attributeId}.key`,
          fieldType: 'lenum',
          language: locale.language,
        };

      case 'ltext':
        return {
          field: `${facetDefinition.attributeId}`,
          fieldType: 'ltext',
          language: locale.language,
        };

      case 'text':
        return {
          field: `${facetDefinition.attributeId}`,
          fieldType: 'text',
        };

      case 'boolean':
        return {
          field: `${facetDefinition.attributeId}`,
          fieldType: 'boolean',
        };

      case 'range':
      case 'reference':
      default:
        return {
          field: `${facetDefinition.attributeId}`,
        };
    }
  }
}
