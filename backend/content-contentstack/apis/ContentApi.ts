import { Context } from '@frontastic/extension-types';
import * as Contentstack from 'contentstack';
import { ContentMapper } from '../mappers/ContentMapper';
import { getFromProjectConfig } from '@Content-contentful/utils/Context';
import { ContentstackEntryResponse } from '@Content-contentstack/interfaces';

enum ContentStackProjectConfigKeys {
  API_KEY = 'EXTENSION_CONTENTSTACK_API_KEY',
  DELIVERY_TOKEN = 'EXTENSION_CONTENTSTACK_DELIVERY_TOKEN',
  ENVIRONMENT = 'EXTENSION_CONTENTSTACK_ENVIRONMENT',
  REGION = 'EXTENSION_CONTENTSTACK_REGION',
}

export default class ContentApi {
  private readonly stack: Contentstack.Stack;
  private readonly locale: string;

  constructor(frontasticContext: Context, locale?: string) {
    this.locale = (locale ?? frontasticContext.project.defaultLocale).replace('_', '-');
    const {
      deliveryToken: contentStackDeliveryToken,
      environment: contentStackEnvironment,
      apiKey: contentStackApiKey,
      region: contentStackRegion,
    } = frontasticContext.project.configuration.contentstack;
    const apiKey = getFromProjectConfig(ContentStackProjectConfigKeys.API_KEY, frontasticContext) ?? contentStackApiKey;
    const deliveryToken =
      getFromProjectConfig(ContentStackProjectConfigKeys.DELIVERY_TOKEN, frontasticContext) ??
      contentStackDeliveryToken;
    const environment =
      getFromProjectConfig(ContentStackProjectConfigKeys.ENVIRONMENT, frontasticContext) ?? contentStackEnvironment;
    const region = getFromProjectConfig(ContentStackProjectConfigKeys.REGION, frontasticContext) ?? contentStackRegion;

    // Initialize the Contentstack Stack
    this.stack = Contentstack.Stack(apiKey, deliveryToken, environment, region);
  }

  async getContent({ contentTypeUid, entryUid }: { contentTypeUid: string; entryUid: string }) {
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

  async getContentList({ contentTypeUid, limit }: { contentTypeUid: string; limit: string }) {
    const dataQuery = this.stack.ContentType(contentTypeUid).Query();
    const Query: Promise<ContentstackEntryResponse[][]> = dataQuery.limit(parseInt(limit)).find();
    return await Query.then(
      function success(entries) {
        return entries[0].map((entry) => ContentMapper.contentstackEntryToContent(entry));
      },
      function error(err) {
        console.log('Failed to fetch ContentStack entries, Error log: ' + err);
        return { err };
      },
    );
  }
}
