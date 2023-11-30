import { Context, ExtensionRegistry } from '@frontastic/extension-types';
import ContentApi from './apis/ContentApi';
import { getLocale } from './utils/Request';
import * as ContentActions from './actionControllers/ContentstackController';

export default {
  'data-sources': {
    'contentstack/content': async (config, context) => {
      const contentApi = new ContentApi(context.frontasticContext as Context, getLocale(context.request));

      const { contentTypeUid, entryUid } = config.configuration;

      return {
        dataSourcePayload: await contentApi.getContent({ contentTypeUid, entryUid }),
      };
    },
    'contentstack/content-list': async (config, context) => {
      const contentApi = new ContentApi(context.frontasticContext as Context, getLocale(context.request));

      const { contentTypeUid, limit } = config.configuration;

      const payload = await contentApi.getContentList({
        contentTypeUid,
        limit,
      });

      return {
        dataSourcePayload: payload,
      };
    },
  },
  actions: {
    contentstack: ContentActions,
  },
} as ExtensionRegistry;
