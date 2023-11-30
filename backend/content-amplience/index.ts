import { Context, ExtensionRegistry } from '@frontastic/extension-types';
import ContentApi from './apis/ContentApi';
import { getLocale } from './utils/Request';

export default {
  'data-sources': {
    'amplience/content': async (config, context) => {
      const contentApi = new ContentApi(context.frontasticContext as Context, getLocale(context.request));

      const { contentId } = config.configuration;

      const payload = await contentApi.getContentById(contentId);

      return {
        dataSourcePayload: payload,
      };
    },
    'amplience/content-list': async (config, context) => {
      const contentApi = new ContentApi(context.frontasticContext as Context, getLocale(context.request));

      const { contentType, filters, sorting, limit, resolveHierarchyTree } = config.configuration;

      const payload = await contentApi.getContentList({
        contentType,
        filters: filters ? filters.split(' ').map((token: string) => token.split('=')) : null,
        sorting: sorting ? sorting.split(' ').map((token: string) => token.split('=')) : null,
        limit,
        resolveHierarchyTree,
      });

      return {
        dataSourcePayload: payload,
      };
    },
  },
} as ExtensionRegistry;
