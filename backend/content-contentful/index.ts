import { DataSourceConfiguration, DataSourceContext, ExtensionRegistry } from '@frontastic/extension-types';
import ContentApi from './apis/ContentApi';
import * as ContentActions from './actionControllers/ContentController';
import { getLocale } from './utils/Request';

export default {
  'data-sources': {
    'frontastic/content': async (config: DataSourceConfiguration, context: DataSourceContext) => {
      const contentApi = new ContentApi(context.frontasticContext, getLocale(context.request));

      return await contentApi.getContent(config.configuration.contentId).then((contentResult) => {
        return !context.isPreview
          ? { dataSourcePayload: contentResult }
          : {
              dataSourcePayload: contentResult,
              previewPayload: [
                {
                  title: contentResult.name,
                },
              ],
            };
      });
    },
  },
  actions: {
    content: ContentActions,
  },
} as ExtensionRegistry;
