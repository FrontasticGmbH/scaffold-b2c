import { Content } from '@Types/content/Content';

export class ContentMapper {
  static contentstackEntryToContent(response: any): Content {
    response = JSON.parse(JSON.stringify(response));
    delete response._version;
    delete response.created_at;
    delete response.created_by;
    delete response.updated_at;
    delete response.updated_by;
    delete response.publish_details;

    return {
      title: response.title,
      contentId: response.uid,
      contentTypeId: response.contentTypeUid,
      banner: response.featured_image?.url,
      summary: response.multi_line,
    };
  }
}
