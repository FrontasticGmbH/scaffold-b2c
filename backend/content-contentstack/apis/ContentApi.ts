import { Context } from '@frontastic/extension-types';
import * as Contentstack from 'contentstack';
import { ContentMapper } from '../mappers/ContentMapper';
import { getFromProjectConfig } from '@Content-contentful/utils/Context';

export default class ContentApi {
  private stack: Contentstack.Stack;
  private locale: string;

  constructor(frontasticContext: Context, locale?: string) {
    this.locale = (locale ?? frontasticContext.project.defaultLocale).replace('_', '-');

    let apiKey = getFromProjectConfig('EXTENSION_CONTENTSTACK_API_KEY', frontasticContext);
    let deliveryToken = getFromProjectConfig('EXTENSION_CONTENTSTACK_DELIVERY_TOKEN', frontasticContext);
    let environment = getFromProjectConfig('EXTENSION_CONTENTSTACK_ENVIRONMENT', frontasticContext);
    let region = getFromProjectConfig('EXTENSION_CONTENTSTACK_REGION', frontasticContext);

    if (!apiKey) {
      apiKey = frontasticContext.project.configuration?.contentstack?.apiKey;
    }

    if (!deliveryToken) {
      deliveryToken = frontasticContext.project.configuration?.contentstack?.deliveryToken;
    }

    if (!environment) {
      environment = frontasticContext.project.configuration?.contentstack?.environment;
    }

    if (!region) {
      region = frontasticContext.project.configuration?.contentstack?.region;
    }

    // Initialize the Contentstack Stack
    this.stack = Contentstack.Stack(apiKey, deliveryToken, environment, region);
  }

  async getContent({ contentTypeUid, entryUid }: any) {
    const Query = this.stack.ContentType(contentTypeUid).Entry(entryUid);

    return await Query.fetch().then(
      function success(entry) {
        return ContentMapper.contentstackEntryToContent(entry);
      },
      function error(err) {
        console.log('Failed to fetch ContentStack entry, Error log: ' + err);
        return { err };
      },
    );
  }

  async getContentList({ contentTypeUid, limit }: any) {
    const dataQuery = this.stack.ContentType(contentTypeUid).Query();
    const Query = dataQuery.limit(parseInt(limit)).find();
    return await Query.then(
      function success(entries) {
        return entries[0].map((entry: any) => ContentMapper.contentstackEntryToContent(entry));
      },
      function error(err) {
        console.log('Failed to fetch ContentStack entries, Error log: ' + err);
        return { err };
      },
    );
  }
}
