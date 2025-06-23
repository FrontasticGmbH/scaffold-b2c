import { DataSourceConfiguration, Request } from '@frontastic/extension-types';
import { Filter } from '@Types/query';
import { FilterTypes } from '@Types/query/Filter';
import { LocalizedString, ProductQuery, SortAttributes, SortOrder } from '@Types/query/ProductQuery';
import { RangeFacet } from '@Types/query/RangeFacet';
import { TermFacet } from '@Types/query/TermFacet';
import { getAccountGroupIds } from '@Commerce-commercetools/utils/Request';
import { QueryParams, RawFacetData } from '@Commerce-commercetools/interfaces/QueryParams';
import {
  DynamicFilter,
  DynamicFilterValue,
  ProductListDataSourceConfiguration,
} from '@Commerce-commercetools/interfaces/DataSource';

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
      const configuration: ProductListDataSourceConfiguration = dataSourceConfiguration?.configuration;
      for (const [key, value] of Object.entries(configuration)) {
        if (value === undefined || value === '') {
          continue;
        }

        switch (key) {
          case 'category':
          case 'categories':
          case 'categoryRef':
          case 'categoryRefs':
            queryParams['categories'] = value.split(',').map((val: string) => val.trim());
            break;
          case 'productId':
          case 'productRef':
          case 'productIds':
          case 'productRefs':
            // For backward compatibility, productIds and productRefs from Studio are the same
            queryParams['productRefs'] = value.split(',').map((val: string) => val.trim());
            break;
          case 'productKeys': // For backward compatibility, we support both productIds and products
            queryParams['productKeys'] = value.split(',').map((val: string) => val.trim());
            break;
          case 'productSkus':
            queryParams['skus'] = value.split(',').map((val: string) => val.trim());
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
      const productFilters: DynamicFilter = queryParams?.productFilters;

      productFilters?.filters.forEach((filter) => {
        switch (true) {
          case filter.field === 'categoryRef':
            const categoryRefValues = productFilters.values?.['categoryRef'];
            productQuery.categories = Array.isArray(categoryRefValues)
              ? categoryRefValues.map((value) => value.toString())
              : [categoryRefValues.toString()];
            break;
          case filter.field === 'productTypeId':
            const productTypeIdValues = productFilters.values?.['productTypeId'];
            productQuery.productTypeId = productTypeIdValues.toString();
            break;
          case filter.field.startsWith('variants.'):
            const { field, type } = filter;
            const filterValue = productFilters.values[field];
            productQuery.filters.push(this.productFiltersDataToProductFilter(field, type, filterValue));
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
      let sortAttribute: Record<string, SortOrder>;
      const sortAttributesArray: Array<Record<string, SortOrder>> = Object.values(queryParams.sortAttributes);

      for (sortAttribute of sortAttributesArray) {
        const key = Object.keys(sortAttribute)[0];
        sortAttributes[key] = sortAttribute[key] || SortOrder.ASCENDING;
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
     * Map accountGroupIds
     */
    productQuery.accountGroupIds = queryParams?.accountGroupIds || getAccountGroupIds(request) || undefined;

    return productQuery;
  }

  static extractLocalizedString(lquery?: Record<string, string>): LocalizedString | undefined {
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

  private static queryParamsToFacets(queryParams: QueryParams) {
    const facets: Array<RangeFacet | TermFacet> = [];
    let key: string;
    let facetData: RawFacetData;

    for ([key, facetData] of Object.entries(queryParams.facets)) {
      // Force terms as an array if exist
      if (facetData?.terms && !Array.isArray(facetData.terms)) {
        facetData.terms = Object.values(facetData.terms);
      }

      switch (true) {
        case facetData.min !== undefined && facetData.max !== undefined:
          const { min, max } = facetData;
          facets.push({
            type: FilterTypes.RANGE,
            identifier: key,
            min: isNaN(min) ? 0 : min,
            max: isNaN(max) ? Number.MAX_SAFE_INTEGER : max,
          });
          break;
        case facetData.terms !== undefined:
          facets.push({
            type: FilterTypes.TERM,
            identifier: key,
            terms: Array.isArray(facetData.terms)
              ? facetData.terms.map((facetValueData: string) => facetValueData)
              : [],
          });
          break;
        case facetData.boolean !== undefined:
          facets.push({
            type: FilterTypes.BOOLEAN,
            identifier: key,
            terms: [facetData.boolean.toString()],
          });
          break;
        default:
          break;
      }
    }

    return facets;
  }

  private static productFiltersDataToProductFilter(
    filterField: string,
    filterType: FilterTypes,
    filterValue: DynamicFilterValue & { min?: number; max?: number },
  ): Filter {
    let filter: Filter;

    switch (filterType) {
      case FilterTypes.NUMBER:
      case FilterTypes.MONEY:
        filter = {
          identifier: filterField,
          type: FilterTypes.RANGE,
          min: filterValue?.min ?? +filterValue,
          max: filterValue?.max ?? +filterValue,
        };
        break;
      case FilterTypes.TEXT:
        filter = {
          identifier: filterField,
          type: FilterTypes.TERM,
          terms: Array.isArray(filterValue) ? filterValue.map((value) => value.toString()) : [filterValue.toString()],
        };
        break;
      case FilterTypes.ENUM:
        filter = {
          identifier: filterField,
          type: FilterTypes.ENUM,
          terms: Array.isArray(filterValue) ? filterValue.map((value) => String(value)) : [String(filterValue)],
        };
        break;
      case FilterTypes.BOOLEAN:
        filter = {
          identifier: filterField,
          type: FilterTypes.BOOLEAN,
          terms: [String(filterValue)],
        };
        break;
      default:
        break;
    }

    return filter;
  }
}
