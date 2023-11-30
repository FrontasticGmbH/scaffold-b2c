import {
  DataSourceConfiguration,
  DataSourceContext,
  DataSourceResult,
  DynamicPageContext,
  DynamicPageRedirectResult,
  DynamicPageSuccessResult,
  Request,
  Response,
} from '@frontastic/extension-types';

import axios from 'axios';
import { loadMovieData, MovieData } from './movieData';
import { getPath } from './utils/Request';

export default {
  'dynamic-page-handler': async (
    request: Request,
    context: DynamicPageContext,
  ): Promise<DynamicPageSuccessResult | DynamicPageRedirectResult | null> => {
    const staticPageMatch = getPath(request)?.match(/^\/(foo-handler)/);
    if (staticPageMatch) {
      return {
        dynamicPageType: `frontastic${staticPageMatch[0]}`,
        dataSourcePayload: {
          foo: {
            result: 'test',
          },
        },
        pageMatchingPayload: {
          foo: {
            result: 'test',
          },
        },
      } as DynamicPageSuccessResult;
    }

    const starWarsUrlMatches = getPath(request)?.match(new RegExp('/movie/([^ /]+)/([^ /]+)'));
    if (starWarsUrlMatches) {
      return await loadMovieData(starWarsUrlMatches[2]).then(
        (result: MovieData | null): DynamicPageSuccessResult | DynamicPageRedirectResult | null => {
          if (result === null) {
            return null;
          }

          if (getPath(request) !== result._url) {
            console.log(getPath(request), result._url, getPath(request) !== result._url);
            return {
              statusCode: 301,
              redirectLocation: result._url,
            } as DynamicPageRedirectResult;
          }

          return {
            dynamicPageType: 'example/star-wars-movie-page',
            dataSourcePayload: result,
            pageMatchingPayload: result,
          } as DynamicPageSuccessResult;
        },
      );
    }

    return null;
  },
  'data-sources': {
    'example/star-wars/movie': async (config: DataSourceConfiguration): Promise<DataSourceResult> => {
      return await axios
        .request<DataSourceResult>({
          url: 'https://frontastic-swapi-graphql.netlify.app',
          method: 'post',
          data: {
            query:
              '{film(id:"' + config.configuration.movieId + '") {id, title, episodeID, openingCrawl, releaseDate}}',
          },
          timeout: 4000,
        })
        .then((response): DataSourceResult => {
          return {
            dataSourcePayload: response.data,
          } as DataSourceResult;
        });
    },
    'example/star-wars/character-search': (config: DataSourceConfiguration): DataSourceResult => {
      return {
        dataSourcePayload: config.configuration,
      };
    },
    'example/star-wars/character-filter': async (
      config: DataSourceConfiguration,
      context: DataSourceContext,
    ): Promise<DataSourceResult> => {
      const pageSize = context.request.query.pageSize || 10;
      const after = context.request.query.cursor || null;
      const { characterFilters } = config.configuration;
      const filters = characterFilters.filters.map((filter: any) => {
        let value = characterFilters.values[filter.field];
        if (typeof value !== 'number') {
          value = `"${value}"`;
        }
        return `${filter.field}: ${value}`;
      });
      return await axios
        .post('https://frontastic-swapi-graphql.netlify.app/', {
          query: `{
            allPeople(first: ${pageSize}, after: ${JSON.stringify(after)}, ${filters}) {
              totalCount
              pageInfo {
                hasNextPage
                endCursor
              }
              people {
                id
                name
                height
                hairColor
                eyeColor
                gender
                species {
                  name
                }
              }
            }
          }`,
        })
        .then((response): DataSourceResult => {
          return {
            dataSourcePayload: response.data?.data?.allPeople || {},
          } as DataSourceResult;
        });
    },
  },
  actions: {
    'star-wars': {
      character: async (request: Request): Promise<Response> => {
        if (!request.query.search) {
          return {
            body: 'Missing search query',
            statusCode: 400,
          };
        }
        return await axios
          .post('https://frontastic-swapi-graphql.netlify.app/', {
            query: `{
            allPeople(name: "${request.query.search}") {
              totalCount
              pageInfo {
                hasNextPage
                endCursor
              }
              people {
                id
                name
                height
                mass
                hairColor
                skinColor
                eyeColor
                birthYear
                gender
                species {
                  name
                }
              }
            }
          }`,
          })
          .then((response) => {
            return {
              body: JSON.stringify(response.data),
              statusCode: 200,
            };
          })
          .catch((reason) => {
            return {
              body: reason.body,
              statusCode: 500,
            };
          });
      },
      filters: async (): Promise<Response> => {
        return await axios
          .post('https://frontastic-swapi-graphql.netlify.app/', {
            query: `{
            getAllPossiblePeopleFilters {
              filter {
                name
                type
                values
              }
          }}`,
          })
          .then((response) => {
            const { filter } = response.data?.data?.getAllPossiblePeopleFilters;
            const responseData = filter.map((filter: any) => {
              return {
                field: filter.name,
                label: filter.name,
                type: filter.type,
                translatable: false,
                values: filter.values?.map((val: string) => {
                  return { name: val, value: val };
                }),
              };
            });
            return {
              body: JSON.stringify(responseData),
              statusCode: 200,
            };
          })
          .catch((reason) => {
            return {
              body: reason.body,
              statusCode: 500,
            };
          });
      },
    },
  },
};
