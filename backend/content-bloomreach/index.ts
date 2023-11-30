import { Context, ExtensionRegistry } from '@frontastic/extension-types';
import ContentApi from './apis/ContentApi';
import { getLocale } from './utils/Request';
import * as ContentActions from './actionControllers/BloomreachController';

export default {
  'data-sources': {
    'bloomreach/content': async (config, context) => {
      const contentApi = new ContentApi(context.frontasticContext as Context, getLocale(context.request));
      const { channel, page } = config.configuration;
      return {
        dataSourcePayload: await contentApi.getContent(channel, page),
      };
    },
    'bloomreach/content-list': async (config, context) => {
      const contentApi = new ContentApi(context.frontasticContext as Context, getLocale(context.request));

      const { channel, pages } = config.configuration;

      const payload = await contentApi.getContentList(channel, pages);

      return {
        dataSourcePayload: payload,
      };
    },
  },
  actions: {
    bloomreach: ContentActions,
  },
} as ExtensionRegistry;
