import { DataSourceConfiguration, Request } from '@frontastic/extension-types';
import { LocalizedString, ProductQuery, SortAttributes, SortOrder } from '@Types/query/ProductQuery';
import { Filter, FilterTypes } from '@Types/query/Filter';
import { RangeFilter } from '@Types/query/RangeFilter';
import { TermFilter } from '@Types/query/TermFilter';
import { FilterFieldTypes } from '@Types/product/FilterField';
import { Facet } from '@Types/query/Facet';
import { TermFacet } from '@Types/query/TermFacet';
import { RangeFacet } from '@Types/query/RangeFacet';
import { getAccountGroupId } from '@Commerce-commercetools/utils/Request';

export class ProductQueryFactory {
  static queryFromParams(request: Request, dataSourceConfiguration?: DataSourceConfiguration): ProductQuery {
    let queryParams;
    const productQuery: ProductQuery = {
      categories: [],
      productIds: [],
      productKeys: [],
      productRefs: [],
      skus: [],
      filters: [],
    };

    /**
     * Merge params
     */
    if (request?.query) {
      queryParams = request.query;
    }

    // Overwrite queryParams with configuration from Studio
    if (dataSourceConfiguration?.configuration) {
      for (const [key, value] of Object.entries(dataSourceConfiguration?.configuration)) {
        if (value === undefined || value === '') {
          continue;
        }

        switch (key) {
          case 'category':
          case 'categories':
          case 'categoryRef':
          case 'categoryRefs':
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
    productQuery.query = queryParams?.query || this.extractLocalizedString(queryParams?.lquery) || undefined;

    /**
     * Map products
     */
    if (queryParams?.productRefs && Array.isArray(queryParams?.productRefs)) {
      queryParams?.productRefs.map((product: string | number) => {
        productQuery.productRefs.push(product.toString());
      });
    }

    /**
     * Map productIds
     */
    if (queryParams?.productIds && Array.isArray(queryParams?.productIds)) {
      queryParams?.productIds.map((productId: string | number) => {
        productQuery.productIds.push(productId.toString());
      });
    }

    /**
     * Map productKeys
     */
    if (queryParams?.productKeys && Array.isArray(queryParams?.productKeys)) {
      queryParams?.productKeys.map((productId: string | number) => {
        productQuery.productKeys.push(productId.toString());
      });
    }

    /**
     * Map productTypeIds
     */
    if (queryParams?.productTypeId) {
      productQuery.productTypeId = queryParams.productTypeId;
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
     * Map categories
     */
    if (queryParams?.categories && Array.isArray(queryParams?.categories)) {
      queryParams.categories.map((category: string | number) => {
        productQuery.categories.push(category.toString());
      });
    }

    /**
     * Map product filters
     */
    if (queryParams?.productFilters) {
      const productFiltersData = this.mergeFiltersAndValues(queryParams, 'productFilters');

      productFiltersData.map((productFilterData: any) => {
        switch (true) {
          case productFilterData.field === 'categoryRef':
            productQuery.categories = productFilterData.values;
            break;
          case productFilterData.field === 'productTypeId':
            productQuery.productTypeId = productFilterData.values[0];
            break;
          case productFilterData.field.startsWith('attributes.'):
            productQuery.filters.push(this.productFiltersDataToProductFilter(productFilterData));
            break;
          default:
            break;
        }
      });
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
  }

  static extractLocalizedString(lquery: any | undefined): LocalizedString | undefined {
    if (lquery === undefined) {
      return undefined;
    }

    const localizedString: LocalizedString = {};
    for (const [key, value] of Object.entries(lquery)) {
      if (typeof key === 'string' && typeof value === 'string') {
        localizedString[key.replace(/_/g, '-')] = value;
      }
    }

    if (Object.keys(localizedString).length === 0) {
      return undefined;
    }

    return localizedString;
  }

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

  private static mergeFiltersAndValues(queryParams: any, filterKey: 'productFilters' | 'categoryFilters') {
    const filtersData: any[] = [];

    if (queryParams?.[filterKey]?.filters === undefined) {
      return filtersData;
    }

    if (queryParams?.[filterKey]?.values === undefined) {
      return queryParams[filterKey].filters;
    }

    queryParams[filterKey].filters.forEach((filter: any) => {
      if (filter?.field) {
        const filterValues = [queryParams[filterKey]?.values[filter.field]];
        filtersData.push({
          ...filter,
          values: filterValues,
        });
      }
    });

    return filtersData;
  }

  private static productFiltersDataToProductFilter(productFilterData: any): Filter {
    let filter: Filter;

    switch (productFilterData.type) {
      case FilterFieldTypes.NUMBER:
      case FilterFieldTypes.MONEY:
        const rangeFilter: RangeFilter = {
          identifier: productFilterData?.field,
          type: FilterTypes.RANGE,
          min: +productFilterData?.values?.[0]?.min || +productFilterData?.values?.[0] || undefined,
          max: +productFilterData?.values?.[0]?.max || +productFilterData?.values?.[0] || undefined,
        };
        filter = rangeFilter;
        break;
      case FilterFieldTypes.TEXT:
        const termFilter: TermFilter = {
          identifier: productFilterData?.field,
          type: FilterTypes.TERM,
          terms: this.getTermsFromConfigFilterData(productFilterData),
        };
        filter = termFilter;
        break;
      case FilterFieldTypes.ENUM:
        const enumFilter: TermFilter = {
          identifier: productFilterData?.field,
          type: FilterTypes.ENUM,
          terms: this.getTermsFromConfigFilterData(productFilterData),
        };
        filter = enumFilter;
        break;
      case FilterFieldTypes.BOOLEAN:
        const booleanFilter: TermFilter = {
          identifier: productFilterData?.field,
          type: FilterTypes.BOOLEAN,
          terms: [productFilterData?.values[0]],
        };
        filter = booleanFilter;
        break;
      default:
        break;
    }

    return filter;
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
