import { ProductQuery } from '@Types/query/ProductQuery';
import { Product } from '@Types/product/Product';
import { FilterField, FilterFieldTypes } from '@Types/product/FilterField';
import { CategoryQuery, CategoryQueryFormat } from '@Types/query/CategoryQuery';
import { Category } from '@Types/product/Category';
import { FacetDefinition } from '@Types/product/FacetDefinition';
import { PaginatedResult, ProductPaginatedResult } from '@Types/result';
import { Filter, TermFilter } from '@Types/query';
import { ProductProjection as CommercetoolsProductProjection } from '@commercetools/platform-sdk';
import { ProductMapper } from '../mappers/ProductMapper';
import { BadRequestError } from '../errors/BadRequestError';
import { ExternalError } from '../errors/ExternalError';
import { ResourceNotFoundError } from '../errors/ResourceNotFoundError';
import { BaseApi } from './BaseApi';
import { ProductSearchFactory } from '@Commerce-commercetools/utils/ProductSearchQueryFactory';
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

export class ProductApi extends BaseApi {
  async query(productQuery: ProductQuery): Promise<ProductPaginatedResult> {
    const locale = await this.getCommercetoolsLocal();
    const defaultLocale = await this.getCommercetoolsDefaultLocal();

    productQuery.categories = await this.hydrateCategories(productQuery);
    productQuery.filters = await this.hydrateFilters(productQuery);

    const facetDefinitions: FacetDefinition[] = [
      ...ProductMapper.commercetoolsProductTypesToFacetDefinitions(
        await this.getCommercetoolsProductTypes(),
        locale,
        defaultLocale,
      ),
      // Include Price facet
      {
        attributeId: 'variants.prices',
        attributeType: 'money',
      },
    ];

    const commercetoolsProductSearchRequest =
      ProductSearchFactory.createCommercetoolsProductSearchRequestFromProductQuery(
        productQuery,
        facetDefinitions,
        locale,
        this.productIdField,
      );

    return this.requestBuilder()
      .products()
      .search()
      .post({
        body: commercetoolsProductSearchRequest,
      })
      .execute()
      .then(async (response) => {
        let productSearchResults = response.body.results;

        // Extract product IDs from product search results
        const productIds = productSearchResults
          .map((productSearchResult) => productSearchResult.id)
          .filter((id) => id !== undefined);

        // If we have product IDs, fetch complete product projections
        if (productIds.length > 0) {
          const productProjections = await this.fetchProductProjectionsByProductIds(
            productIds,
            locale,
            productQuery.accountGroupIds,
          );

          // Create a map for product projections lookup
          const productProjectionsMap = new Map(
            productProjections.map((productProjection) => [productProjection.id, productProjection]),
          );

          // Enrich product search results with complete product projections
          productSearchResults = productSearchResults.map((productSearchResult) => {
            const productProjection = productProjectionsMap.get(productSearchResult.id);
            if (productProjection) {
              return {
                ...productSearchResult,
                productProjection,
              };
            }
            return productSearchResult;
          });
        }

        const items = productSearchResults.map((product) =>
          ProductMapper.commercetoolsProductSearchResultToProduct(
            product,
            this.productIdField,
            this.categoryIdField,
            locale,
            defaultLocale,
          ),
        );
        const count = response.body.results.length;
        const result: ProductPaginatedResult = {
          total: response.body.total,
          items,
          count,
          facets: ProductMapper.commercetoolsFacetResultsToFacets(
            response.body.facets,
            commercetoolsProductSearchRequest,
            facetDefinitions,
            productQuery,
          ),
          previousCursor: ProductMapper.calculatePreviousCursor(response.body.offset, count),
          nextCursor: ProductMapper.calculateNextCursor(response.body.offset, count, response.body.total),
          query: productQuery,
        };

        return result;
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.statusCode, message: error.message, body: error.body });
      });
  }

  async getProduct(productQuery: ProductQuery): Promise<Product> {
    try {
      // Handle productRefs base on value set in productIdField
      if (productQuery.productRefs?.length) {
        switch (this.productIdField) {
          case 'id':
            productQuery.productIds = [productQuery.productRefs[0]];
            break;
          case 'key':
          default:
            productQuery.productKeys = [productQuery.productRefs[0]];
            break;
        }
      }

      const locale = await this.getCommercetoolsLocal();
      const defaultLocale = await this.getCommercetoolsDefaultLocal();

      let commercetoolsProductProjection: CommercetoolsProductProjection;

      // We assume that the product query is a single product query, so we can use the first item of the result.
      switch (true) {
        case productQuery.productIds?.length > 0:
          commercetoolsProductProjection = await this.fetchProductProjectionById(productQuery.productIds[0], locale);
          break;
        case productQuery.productKeys?.length > 0:
          commercetoolsProductProjection = await this.fetchProductProjectionByKey(productQuery.productKeys[0], locale);
          break;
        case productQuery.skus?.length > 0:
          commercetoolsProductProjection = await this.fetchProductProjectionBySku(productQuery.skus[0], locale);
          break;
        default:
          throw new BadRequestError({ message: 'No product query parameters provided' });
      }

      // Map the ProductProjection to Product
      return ProductMapper.commercetoolsProductProjectionToProduct(
        commercetoolsProductProjection,
        this.productIdField,
        this.categoryIdField,
        locale,
        defaultLocale,
      );
    } catch (error) {
      throw error;
    }
  }

  async queryCategories(categoryQuery: CategoryQuery): Promise<PaginatedResult<Category>> {
    const locale = await this.getCommercetoolsLocal();
    const defaultLocale = await this.getCommercetoolsDefaultLocal();

    // TODO: get default from constant
    const limit = +categoryQuery.limit || 24;
    const where: string[] = [];

    if (categoryQuery.slug) {
      where.push(`slug(${locale.language}="${categoryQuery.slug}")`);
    }

    if (categoryQuery.parentId) {
      where.push(`parent(id="${categoryQuery.parentId}")`);
    }

    const methodArgs = {
      queryArgs: {
        limit: limit,
        offset: this.getOffsetFromCursor(categoryQuery.cursor),
        where: where.length > 0 ? where : undefined,
        expand: ['ancestors[*]', 'parent'],
        sort: 'orderHint',
      },
    };

    return await this.getCommercetoolsCategoryPagedQueryResponse(methodArgs)
      .then((response) => {
        const items =
          categoryQuery.format === CategoryQueryFormat.TREE
            ? ProductMapper.commercetoolsCategoriesToTreeCategory(response.body.results, this.categoryIdField, locale)
            : response.body.results.map((category) =>
                ProductMapper.commercetoolsCategoryToCategory(category, this.categoryIdField, locale, defaultLocale),
              );

        const result: PaginatedResult<Category> = {
          total: response.body.total,
          items: items,
          count: response.body.count,
          previousCursor: ProductMapper.calculatePreviousCursor(response.body.offset, response.body.count),
          nextCursor: ProductMapper.calculateNextCursor(response.body.offset, response.body.count, response.body.total),
          query: categoryQuery,
        };

        return result;
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.statusCode, message: error.message, body: error.body });
      });
  }

  async getProductFilters(): Promise<FilterField[]> {
    const locale = await this.getCommercetoolsLocal();
    const defaultLocale = await this.getCommercetoolsDefaultLocal();

    const commercetoolsProductTypes = await this.getCommercetoolsProductTypes();

    const filterFields: FilterField[] = [];

    // Product type filter
    filterFields.push({
      field: 'productTypeId',
      type: FilterFieldTypes.ENUM,
      label: 'Product type',
      values: commercetoolsProductTypes.map((item) => {
        return {
          value: item.id,
          name: item.name,
        };
      }),
    });

    // Variants price filter. Not included as commercetools product type.
    filterFields.push({
      field: 'variants.prices',
      type: FilterFieldTypes.MONEY,
      label: 'Variants price',
    });

    // Searchable attributes filter
    filterFields.push(
      ...ProductMapper.commercetoolsProductTypesToFilterFields(commercetoolsProductTypes, locale, defaultLocale),
    );

    filterFields.push(...(await this.getCategoryFilters()));

    return filterFields;
  }

  async getCategoryFilters(): Promise<FilterField[]> {
    return [
      {
        field: 'categoryRef',
        type: FilterFieldTypes.ENUM,
        label: 'Category',
        values: await this.queryCategories({ limit: 250 }).then((result) => {
          return result.items.map((item) => {
            return {
              value: item.categoryRef,
              name: item.name,
            };
          });
        }),
      },
    ];
  }

  /**
   * Fetches complete product projections by IDs using the product-projections endpoint
   * This is used to enrich search results with complete product data
   */
  protected async fetchProductProjectionsByProductIds(
    productIds: string[],
    locale: Locale,
    accountGroupIds?: string[],
  ): Promise<CommercetoolsProductProjection[]> {
    if (productIds.length === 0) {
      return [];
    }

    const queryArgs: {
      where: string;
      limit: number;
      priceCurrency: string;
      priceCountry: string;
      priceChannel?: string;
      priceCustomerGroupAssignments?: string[];
      expand: string[];
    } = {
      where: `id in ("${productIds.join('","')}")`,
      limit: productIds.length,
      priceCurrency: locale.currency,
      priceCountry: locale.country,
      priceCustomerGroupAssignments: accountGroupIds?.length > 0 ? accountGroupIds : undefined,
      expand: EXPANDS,
    };

    return this.requestBuilder()
      .productProjections()
      .get({
        queryArgs,
      })
      .execute()
      .then((response) => {
        const products = response.body.results;
        if (!products) {
          throw new ResourceNotFoundError({ message: `Products with IDs '${productIds.join('","')}' not found` });
        }
        return products;
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.statusCode, message: error.message, body: error.body });
      });
  }

  /**
   * Fetches a product projection by its unique ID.
   */
  protected async fetchProductProjectionById(
    productId: string,
    locale: Locale,
  ): Promise<CommercetoolsProductProjection> {
    const queryArgs: {
      priceCurrency?: string;
      priceCountry?: string;
      expand?: string[];
    } = {
      priceCurrency: locale.currency,
      priceCountry: locale.country,
      expand: EXPANDS,
    };

    return await this.requestBuilder()
      .productProjections()
      .withId({ ID: productId })
      .get({ queryArgs })
      .execute()
      .then((response) => {
        const product = response.body;
        if (!product) {
          throw new ResourceNotFoundError({ message: `Product with ID '${productId}' not found` });
        }
        return product;
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.statusCode, message: error.message, body: error.body });
      });
  }

  /**
   * Fetches a product projection by its key.
   */
  protected async fetchProductProjectionByKey(key: string, locale: Locale): Promise<CommercetoolsProductProjection> {
    const queryArgs: {
      priceCurrency?: string;
      priceCountry?: string;
      expand?: string[];
    } = {
      priceCurrency: locale.currency,
      priceCountry: locale.country,
      expand: EXPANDS,
    };

    return await this.requestBuilder()
      .productProjections()
      .withKey({ key })
      .get({ queryArgs })
      .execute()
      .then((response) => {
        const product = response.body;
        if (!product) {
          throw new ResourceNotFoundError({ message: `Product with key '${key}' not found` });
        }
        return product;
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.statusCode, message: error.message, body: error.body });
      });
  }

  /**
   * Fetches a product projection by SKU using a where clause.
   * Note: SKU lookup queries all products and returns the first match.
   */
  protected async fetchProductProjectionBySku(sku: string, locale: Locale): Promise<CommercetoolsProductProjection> {
    const queryArgs: {
      where?: string;
      priceCurrency?: string;
      priceCountry?: string;
      expand?: string[];
      limit?: number;
    } = {
      where: `masterVariant(sku="${sku}") or variants(sku="${sku}")`, // Match by SKU across all variants
      priceCurrency: locale.currency,
      priceCountry: locale.country,
      expand: EXPANDS,
      limit: 1, // We only need the first match
    };

    return await this.requestBuilder()
      .productProjections()
      .get({ queryArgs })
      .execute()
      .then((response) => {
        const product = response.body.results?.[0];
        if (!product) {
          throw new ResourceNotFoundError({ message: `Product with SKU '${sku}' not found` });
        }
        return product;
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.statusCode, message: error.message, body: error.body });
      });
  }

  protected getOffsetFromCursor(cursor: string) {
    if (cursor === undefined) {
      return undefined;
    }

    const offsetMach = cursor.match(/(?<=offset:).+/);
    return offsetMach !== null ? +Object.values(offsetMach)[0] : undefined;
  }

  protected async getCommercetoolsCategoryPagedQueryResponse(methodArgs: object) {
    return await this.requestBuilder()
      .categories()
      .get(methodArgs)
      .execute()
      .catch((error) => {
        throw new ExternalError({ statusCode: error.statusCode, message: error.message, body: error.body });
      });
  }

  protected async getCommercetoolsProductSelectionPagedQueryResponse(methodArgs: object) {
    return await this.requestBuilder()
      .productSelections()
      .get(methodArgs)
      .execute()
      .catch((error) => {
        throw new ExternalError({ statusCode: error.statusCode, message: error.message, body: error.body });
      });
  }

  protected async hydrateCategories(productQuery: ProductQuery): Promise<string[]> {
    if (productQuery.categories !== undefined && productQuery.categories.length !== 0) {
      let categoryIds = productQuery.categories.filter(function uniqueCategories(value, index, self) {
        return self.indexOf(value) === index;
      });

      // commercetools only allows filter categories by id. If we are using something different as categoryIdField,
      // we need first to fetch the category to get the correspondent category id.
      if (this.categoryIdField !== 'id') {
        const categoriesMethodArgs = {
          queryArgs: {
            where: [`key in ("${categoryIds.join('","')}")`],
          },
        };

        categoryIds = await this.getCommercetoolsCategoryPagedQueryResponse(categoriesMethodArgs).then((response) => {
          return response.body.results.map((category) => {
            return category.id;
          });
        });
      }

      return categoryIds;
    }
    return [];
  }

  protected async hydrateFilters(productQuery: ProductQuery): Promise<Filter[]> {
    if (productQuery.filters !== undefined && productQuery.filters.length !== 0) {
      const categoryIds = productQuery.filters
        .filter((filter) => filter.identifier === 'categoriesSubTree')
        .map((filter) => (filter as TermFilter).terms?.map((term) => term))
        .filter(function uniqueCategories(value, index, self) {
          return self.indexOf(value) === index;
        });

      // commercetools only allows filter categories by id. If we are using something different as categoryIdField,
      // we need first to fetch the category to get the correspondent category id.
      if (this.categoryIdField !== 'id' && categoryIds.length !== 0) {
        const categoriesMethodArgs = {
          queryArgs: {
            where: [`key in ("${categoryIds.join('","')}")`],
          },
        };

        const categories = await this.getCommercetoolsCategoryPagedQueryResponse(categoriesMethodArgs).then(
          (response) => {
            return response.body.results;
          },
        );

        productQuery.filters = productQuery.filters.map((filter) => {
          if (filter.identifier === 'categoriesSubTree') {
            return {
              ...filter,
              terms: categories
                ?.filter((category) => (filter as TermFilter).terms?.includes(category.key))
                ?.map((category) => category.id),
            };
          }
          return filter;
        });
      }

      return productQuery.filters;
    }
    return [];
  }
}
