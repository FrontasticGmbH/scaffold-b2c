import { ProductQuery } from '@Types/query/ProductQuery';
import { Product } from '@Types/product/Product';
import { FilterField, FilterFieldTypes } from '@Types/product/FilterField';
import { CategoryQuery, CategoryQueryFormat } from '@Types/query/CategoryQuery';
import { Category } from '@Types/product/Category';
import { FacetDefinition } from '@Types/product/FacetDefinition';
import { PaginatedResult, ProductPaginatedResult } from '@Types/result';

import { ProductMapper } from '../mappers/ProductMapper';
import { BaseApi } from './BaseApi';
import { ExternalError } from '@Commerce-commercetools/errors/ExternalError';

export class ProductApi extends BaseApi {
  async query(productQuery: ProductQuery): Promise<ProductPaginatedResult> {
    const locale = await this.getCommercetoolsLocal();

    // TODO: get default from constant
    const limit = +productQuery.limit || 24;

    const filterQuery: string[] = [];
    const filterFacets: string[] = [];
    const sortAttributes: string[] = [];

    const facetDefinitions: FacetDefinition[] = [
      ...ProductMapper.commercetoolsProductTypesToFacetDefinitions(await this.getProductTypes(), locale),
      // Include Category facet
      {
        attributeId: 'categories.id',
        attributeType: 'text',
      },
      // Include Scoped Price facet
      {
        attributeId: 'variants.scopedPrice.value',
        attributeType: 'money',
      },
      // Include Price facet
      {
        attributeId: 'variants.price',
        attributeType: 'money',
      },
      // Include Scoped Price discount facet
      {
        attributeId: 'variants.scopedPriceDiscounted',
        attributeType: 'boolean',
      },
    ];

    const queryArgFacets = ProductMapper.facetDefinitionsToCommercetoolsQueryArgFacets(facetDefinitions, locale);

    if (productQuery.productIds !== undefined && productQuery.productIds.length !== 0) {
      filterQuery.push(`${this.productIdField}:"${productQuery.productIds.join('","')}"`);
    }

    if (productQuery.skus !== undefined && productQuery.skus.length !== 0) {
      filterQuery.push(`variants.sku:"${productQuery.skus.join('","')}"`);
    }

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

      filterQuery.push(
        `categories.id: ${categoryIds.map((category) => {
          return `subtree("${category}")`;
        })}`,
      );
    }

    if (productQuery.filters !== undefined) {
      filterQuery.push(
        ...ProductMapper.facetDefinitionsToFilterQueries(productQuery.filters, facetDefinitions, locale),
      );
    }

    if (productQuery.facets !== undefined) {
      filterFacets.push(...ProductMapper.facetDefinitionsToFilterFacets(productQuery.facets, facetDefinitions, locale));
    }

    switch (true) {
      case productQuery.sortAttributes !== undefined:
        Object.keys(productQuery.sortAttributes).map((field, directionIndex) => {
          sortAttributes.push(`${field} ${Object.values(productQuery.sortAttributes)[directionIndex]}`);
        });
        break;
      default:
        // By default, in CoCo, search results are sorted descending by their relevancy with respect to the provided
        // text (that is their “score”). Sorting by score and then by id will ensure consistent products order
        // across several search requests for products that have the same relevance score.
        sortAttributes.push(`score desc`, `id desc`);
    }

    const methodArgs = {
      queryArgs: {
        sort: sortAttributes,
        limit: limit,
        offset: this.getOffsetFromCursor(productQuery.cursor),
        priceCurrency: locale.currency,
        priceCountry: locale.country,
        facet: queryArgFacets.length > 0 ? queryArgFacets : undefined,
        filter: filterFacets.length > 0 ? filterFacets : undefined,
        'filter.facets': filterFacets.length > 0 ? filterFacets : undefined,
        'filter.query': filterQuery.length > 0 ? filterQuery : undefined,
        [`text.${locale.language}`]: productQuery.query,
        expand: ['categories[*].ancestors[*]', 'categories[*].parent'],
        fuzzy: true,
      },
    };

    return await this.requestBuilder()
      .productProjections()
      .search()
      .get(methodArgs)
      .execute()
      .then((response) => {
        const items = response.body.results.map((product) =>
          ProductMapper.commercetoolsProductProjectionToProduct(
            product,
            this.productIdField,
            this.categoryIdField,
            locale,
            this.defaultLocale,
          ),
        );

        const result: ProductPaginatedResult = {
          total: response.body.total,
          items: items,
          count: response.body.count,
          facets: ProductMapper.commercetoolsFacetResultsToFacets(
            facetDefinitions,
            response.body.facets,
            productQuery,
            locale,
          ),
          previousCursor: ProductMapper.calculatePreviousCursor(response.body.offset, response.body.count),
          nextCursor: ProductMapper.calculateNextCursor(response.body.offset, response.body.count, response.body.total),
          query: productQuery,
        };

        return result;
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
      });
  }

  async getProduct(productQuery: ProductQuery): Promise<Product> {
    const result = await this.query(productQuery);

    return result.items.shift() as Product;
  }

  async getSearchableAttributes(): Promise<FilterField[]> {
    const locale = await this.getCommercetoolsLocal();

    const response = await this.requestBuilder()
      .productTypes()
      .get()
      .execute()
      .catch((error) => {
        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
      });

    const filterFields = ProductMapper.commercetoolsProductTypesToFilterFields(response.body.results, locale);

    // Category filter. Not included as commercetools product type.
    filterFields.push({
      field: 'categoryIds',
      type: FilterFieldTypes.ENUM,
      label: 'Category',
      values: await this.queryCategories({ limit: 250, format: CategoryQueryFormat.TREE }).then((result) => {
        return (result.items as Category[]).map((item) => {
          return {
            value: item.categoryId,
            name: item.name,
          };
        });
      }),
    });

    // Variants price filter. Not included as commercetools product type.
    filterFields.push({
      field: 'variants.price',
      type: FilterFieldTypes.MONEY,
      label: 'Variants price', // TODO: localize label
    });

    // Variants scoped price filter. Not included as commercetools product type.
    filterFields.push({
      field: 'variants.scopedPrice.value',
      type: FilterFieldTypes.MONEY,
      label: 'Variants scoped price', // TODO: localize label
    });

    return filterFields;
  }

  async queryCategories(categoryQuery: CategoryQuery): Promise<PaginatedResult<Category>> {
    const locale = await this.getCommercetoolsLocal();

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
      },
    };

    return await this.getCommercetoolsCategoryPagedQueryResponse(methodArgs)
      .then((response) => {
        const items =
          categoryQuery.format === CategoryQueryFormat.TREE
            ? ProductMapper.commercetoolsCategoriesToTreeCategory(response.body.results, this.categoryIdField, locale)
            : response.body.results.map((category) =>
                ProductMapper.commercetoolsCategoryToCategory(category, this.categoryIdField, locale),
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
        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
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
        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
      });
  }
}
