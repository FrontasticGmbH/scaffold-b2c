import { DataSourceConfiguration, Request } from '@frontastic/extension-types';
import { ProductQuery, SortAttributes, SortOrder } from '@Types/query/ProductQuery';
import { Filter, FilterTypes } from '@Types/query/Filter';
import { RangeFilter } from '@Types/query/RangeFilter';
import { TermFilter } from '@Types/query/TermFilter';
import { FilterFieldTypes } from '@Types/product/FilterField';
import { Facet } from '@Types/query/Facet';
import { TermFacet } from '@Types/query/TermFacet';
import { RangeFacet } from '@Types/query/RangeFacet';
import { getAccountGroupId, getProductSelectionId } from '@Commerce-commercetools/utils/Request';

export class ProductQueryFactory {
  static queryFromParams: (request: Request, config?: DataSourceConfiguration) => ProductQuery = (
    request: Request,
    config?: DataSourceConfiguration,
  ) => {
    let queryParams;
    const productQuery: ProductQuery = {
      categories: [],
      productIds: [],
      productKeys: [],
      productRefs: [],
      skus: [],
    };

    /**
     * Merge params
     */
    if (request?.query) {
      queryParams = request.query;
    }

    // Overwrite queryParams with configuration from Studio
    if (config?.configuration) {
      for (const [key, value] of Object.entries(config?.configuration)) {
        if (value === undefined || value === '') {
          continue;
        }

        switch (key) {
          case 'categories':
            queryParams['categories'] = (value as string).split(',').map((val: string) => val.trim());
            break;
          case 'productId':
          case 'productRef':
          case 'productIds':
          case 'productRefs':
            // For backward compatibility, productIds and productRefs from Studio are the same
            queryParams['productRefs'] = (value as string).split(',').map((val: string) => val.trim());
            break;
          case 'productKeys': // For backward compatibility, we support both productIds and products
            queryParams['productKeys'] = (value as string).split(',').map((val: string) => val.trim());
            break;
          case 'productSkus':
            queryParams['skus'] = (value as string).split(',').map((val: string) => val.trim());
            break;
          default:
            queryParams[key] = value;
            break;
        }
      }
    }

    /**
     * Map query
     */
    productQuery.query = queryParams?.query || queryParams?.lquery || undefined;

    /**
     * Map Categories
     */
    if (queryParams?.categories && Array.isArray(queryParams?.categories)) {
      queryParams.categories.map((category: string | number) => {
        productQuery.categories.push(category.toString());
      });
    }
    // Support also queries with a single category
    if (queryParams?.category) {
      productQuery.categories.push(queryParams.category);
    }

    /**
     * Map products
     */
    if (queryParams?.productRefs && Array.isArray(queryParams?.productRefs)) {
      queryParams?.productRefs.map((product: string | number) => {
        productQuery.productRefs.push(product.toString());
      });
    }

    if (queryParams?.productIds && Array.isArray(queryParams?.productIds)) {
      queryParams?.productIds.map((productId: string | number) => {
        productQuery.productIds.push(productId.toString());
      });
    }

    if (queryParams?.productKeys && Array.isArray(queryParams?.productKeys)) {
      queryParams?.productKeys.map((productId: string | number) => {
        productQuery.productKeys.push(productId.toString());
      });
    }

    /**
     * Map skus
     */
    if (queryParams?.skus && Array.isArray(queryParams?.skus)) {
      queryParams?.skus.map((sku: string | number) => {
        productQuery.skus.push(sku.toString());
      });
    }

    /**
     * Since filters and values might be returned in separated arrays we are using
     * the following method to merge both, filters and values, in a single array.
     */
    const configFiltersData = [];
    configFiltersData.push(...ProductQueryFactory.mergeProductFiltersAndValues(queryParams));

    /**
     * Map filters
     */
    const filters = this.configFiltersDataToFilters(configFiltersData);
    if (filters.length > 0) {
      productQuery.filters = filters;
    }

    /**
     * Map category filters
     */
    const categoryFilters = this.configFiltersDataToCategoryFilters(configFiltersData);
    if (categoryFilters.length > 0) {
      productQuery.categories = categoryFilters;
    }

    /**
     * Map facets
     */
    if (queryParams.facets) {
      productQuery.facets = ProductQueryFactory.queryParamsToFacets(queryParams);
    }

    /**
     * Map sort attributes
     */
    if (queryParams.sortAttributes) {
      const sortAttributes: SortAttributes = {};
      let sortAttribute;

      for (sortAttribute of Object.values(queryParams.sortAttributes)) {
        const key = Object.keys(sortAttribute)[0];
        sortAttributes[key] = sortAttribute[key] ? sortAttribute[key] : SortOrder.ASCENDING;
      }
      productQuery.sortAttributes = sortAttributes;
    }

    /**
     * Map productSelectionId
     */
    productQuery.productSelectionId = queryParams?.productSelectionId || getProductSelectionId(request) || undefined;

    /**
     * Map page limit
     */
    productQuery.limit = queryParams?.limit || undefined;

    /**
     * Map page cursor
     */
    productQuery.cursor = queryParams?.cursor || undefined;

    /**
     * Map accountGroupId
     */
    productQuery.accountGroupId = queryParams?.accountGroupId || getAccountGroupId(request) || undefined;

    return productQuery;
  };

  private static queryParamsToFacets(queryParams: any) {
    const facets: Facet[] = [];
    let key: any;
    let facetData: any;

    for ([key, facetData] of Object.entries(queryParams.facets)) {
      // Force terms as an array if exist
      if (facetData?.terms && !Array.isArray(facetData.terms)) {
        facetData.terms = Object.values(facetData.terms);
      }

      switch (true) {
        case facetData.min !== undefined && facetData.max !== undefined:
          const min = parseInt(facetData.min);
          const max = parseInt(facetData.max);
          facets.push({
            type: FilterTypes.RANGE,
            identifier: key,
            min: isNaN(min) ? 0 : min,
            max: isNaN(max) ? Number.MAX_SAFE_INTEGER : max,
          } as RangeFacet);
          break;
        case facetData.terms !== undefined:
          facets.push({
            type: FilterTypes.TERM,
            identifier: key,
            terms: facetData.terms.map((facetValueData: string) => facetValueData),
          } as TermFacet);
          break;
        case facetData.boolean !== undefined:
          facets.push({
            type: FilterTypes.BOOLEAN,
            identifier: key,
            terms: [facetData.boolean],
          } as TermFacet);
          break;
        default:
          break;
      }
    }

    return facets;
  }

  private static mergeProductFiltersAndValues(queryParams: any) {
    const filtersData: any[] = [];

    if (queryParams?.productFilters?.filters === undefined) {
      return filtersData;
    }

    if (queryParams?.productFilters?.values === undefined) {
      return queryParams.productFilters.filters;
    }

    queryParams.productFilters.filters.forEach((filter: any) => {
      if (filter?.field) {
        const filterValues =
          // TODO: to be adapted when Studio returned multiple values
          [queryParams.productFilters?.values[filter.field]] || [];

        const filterData = {
          ...filter,
          values: filterValues,
        };
        filtersData.push(filterData);
      }
    });

    return filtersData;
  }

  private static configFiltersDataToFilters(configFiltersData: any) {
    const filters: Filter[] = [];

    configFiltersData.forEach((configFilterData: any) => {
      if (configFilterData?.field === 'categoryId' || configFilterData?.field === 'categoryIds') {
        // Ignore category filters, they are handled separately
        return;
      }

      switch (configFilterData.type) {
        case FilterFieldTypes.NUMBER:
        case FilterFieldTypes.MONEY:
          const rangeFilter: RangeFilter = {
            identifier: configFilterData?.field,
            type: FilterTypes.RANGE,
            min: +configFilterData?.values?.[0]?.min || +configFilterData?.values?.[0] || undefined,
            max: +configFilterData?.values?.[0]?.max || +configFilterData?.values?.[0] || undefined,
          };
          filters.push(rangeFilter);
          break;
        case FilterFieldTypes.TEXT:
          const termFilter: TermFilter = {
            identifier: configFilterData?.field,
            type: FilterTypes.TERM,
            terms: this.getTermsFromConfigFilterData(configFilterData),
          };
          filters.push(termFilter);
          break;
        case FilterFieldTypes.ENUM:
          const enumFilter: TermFilter = {
            identifier: configFilterData?.field,
            type: FilterTypes.ENUM,
            terms: this.getTermsFromConfigFilterData(configFilterData),
          };
          filters.push(enumFilter);
          break;
        case FilterFieldTypes.BOOLEAN:
          const booleanFilter: TermFilter = {
            identifier: configFilterData?.field,
            type: FilterTypes.BOOLEAN,
            terms: [configFilterData?.values[0]],
          };
          filters.push(booleanFilter);
          break;
        default:
          break;
      }
    });

    return filters;
  }

  private static configFiltersDataToCategoryFilters(configFiltersData: any) {
    const categoryFilters: string[] = [];

    configFiltersData.forEach((configFilterData: any) => {
      if (configFilterData?.field === 'categoryId' || configFilterData?.field === 'categoryIds') {
        // Overwrite category with any value that has been set from Studio
        categoryFilters.push(configFilterData.values);
      }
    });

    return categoryFilters;
  }

  private static getTermsFromConfigFilterData(configFilterData: any) {
    return configFilterData?.values.map((term: object | string | number) => {
      if (typeof term !== 'object') {
        return term;
      }

      // The config might include a key-value pair that include the locale and the term value. If this is
      // the case, we'll return the term value and ignore the locale
      const key = Object.keys(term)[0];
      if (term.hasOwnProperty(key)) {
        // term has a key-value pair, return the value
        return term[key];
      }
    });
  }
}
