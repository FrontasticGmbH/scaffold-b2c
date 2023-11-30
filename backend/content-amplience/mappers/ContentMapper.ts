export class ContentMapper {
  static buildUrl(mediaObj: Record<string, string>, suffix: 'i' | 'v') {
    return `https://${mediaObj.host ?? mediaObj.defaultHost}/${suffix}/${mediaObj.endpoint}/${mediaObj.name}`;
  }

  static amplienceContentToContent({ _meta, ...attrs }: any) {
    const content = { _meta };

    for (const attr in attrs) {
      if (!attrs[attr]._meta) {
        content[attr] = attrs[attr];
        continue;
      }

      switch (attrs[attr]._meta.schema) {
        case 'http://bigcontent.io/cms/schema/v1/core#/definitions/image-link':
          content[attr] = this.buildUrl(attrs[attr], 'i');
          break;
        case 'http://bigcontent.io/cms/schema/v1/core#/definitions/video-link':
          content[attr] = this.buildUrl(attrs[attr], 'v');
          break;
        default:
          content[attr] = attrs[attr];
      }
    }

    return content;
  }
}
