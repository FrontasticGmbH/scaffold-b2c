import { Context } from '@frontastic/extension-types';
import { ContentClient } from 'dc-delivery-sdk-js';
import { ContentMapper } from '../mappers/ContentMapper';
import { getFromProjectConfig } from '@Content-amplience/utils/Context';

export default class ContentApi {
  private client: ContentClient;
  private locale: string;

  constructor(commercetoolsFrontendContext: Context, locale?: string) {
    this.locale = (locale ?? commercetoolsFrontendContext.project.defaultLocale).replace('_', '-');

    let hubName = getFromProjectConfig('EXTENSION_AMPLIENCE_HUB_NAME', commercetoolsFrontendContext);
    if (!hubName) {
      hubName = commercetoolsFrontendContext.project.configuration?.amplience?.hubName;
    }

    this.client = new ContentClient({
      hubName: hubName,
      locale: this.locale,
    });
  }

  async getContentById(contentId: string) {
    const response = await this.client.getContentItemById(contentId);

    return ContentMapper.amplienceContentToContent(response.body);
  }

  async getContentList({
    contentType,
    filters,
    sorting,
    limit = 12,
    resolveHierarchyTree = false,
  }: {
    contentType: string;
    limit?: number;
    filters?: Array<[string, unknown]>;
    sorting?: Array<[string, string]>;
    resolveHierarchyTree?: boolean;
  }) {
    let query = this.client.filterByContentType(contentType);

    if (filters) filters.forEach(([key, val]) => (query = query.filterBy(`/${key}`, val)));

    if (sorting) sorting.forEach(([key, val]) => (query = query.filterBy(key, val.toUpperCase())));

    query = query.page(limit);

    const response = await query.request({
      depth: resolveHierarchyTree ? 'all' : 'root',
      format: 'inlined',
      locale: this.locale,
    });

    return response.responses.map(({ content }) => ContentMapper.amplienceContentToContent(content));
  }
}
