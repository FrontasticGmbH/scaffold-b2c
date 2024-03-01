import { createClient, ContentfulClientApi } from 'contentful';
import { Context } from '@frontastic/extension-types';
import { ContentfulMapper } from '../mappers/ContentfulMapper';
import { getFromProjectConfig } from '../utils/Context';

export default class ContentApi {
  private client: ContentfulClientApi;
  private locale: string;

  constructor(frontasticContext: Context, locale?: string) {
    let space = getFromProjectConfig('EXTENSION_CONTENTFUL_SPACE_ID', frontasticContext);
    if (!space) {
      space = frontasticContext.project.configuration?.contentful?.space;
    }

    let accessToken = getFromProjectConfig('EXTENSION_CONTENTFUL_ACCESS_TOKEN', frontasticContext);
    if (!accessToken) {
      accessToken = frontasticContext.project.configuration?.contentful?.accessToken;
    }

    this.client = createClient({
      space: space,
      accessToken: accessToken,
    });
    this.locale = this.formatLocale(locale !== null ? locale : frontasticContext.project.defaultLocale);
  }

  private formatLocale(locale: string) {
    return locale.replace('_', '-');
  }

  async getContent(id: string) {
    const contentfulEntry = await this.client.getEntry(id, { locale: this.locale });
    const contentfulContentType = await this.client.getContentType(contentfulEntry.sys.contentType.sys.id);

    return ContentfulMapper.contentfulEntryToContent(contentfulEntry, contentfulContentType);
  }
}
