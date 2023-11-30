import { Entry, Asset as ContentfulAsset, ContentType, EntryFields, RichTextContent } from 'contentful';
import { Attributes, Content } from '@Types/content/Content';
import { Asset } from '@Types/content/Asset';
import RichText = EntryFields.RichText;

export class ContentfulMapper {
  static contentfulEntryToContent(contentfulEntry: Entry<unknown>, contentfulContentType: ContentType): Content {
    const attributes = this.contentfulFieldsToAttributes(contentfulEntry.fields, contentfulContentType);

    return {
      contentId: contentfulEntry.sys.id,
      contentTypeId: contentfulEntry.sys.contentType.sys.id,
      name:
        attributes.hasOwnProperty(contentfulContentType.displayField) &&
        typeof attributes[contentfulContentType.displayField].content === 'string'
          ? (attributes[contentfulContentType.displayField].content as string)
          : undefined,
      attributes: attributes,
    };
  }

  static contentfulFieldsToAttributes(fields: unknown, contentfulContentType: ContentType): Attributes {
    const attributes: Attributes = {};

    for (const [key, value] of Object.entries(fields)) {
      attributes[key] = {
        attributeId: key,
        content:
          typeof value === 'string' || typeof value === 'number'
            ? value.toString()
            : this.contentfulCompoundAttributeToAttributeContent(value),
        type: contentfulContentType.fields.find((field) => {
          return field.id === key;
        })?.type,
      };
    }

    return attributes;
  }

  static contentfulCompoundAttributeToAttributeContent(value: unknown) {
    if ((value as ContentfulAsset).sys?.type === 'Asset') {
      return this.contentfulAsseToAsset(value as ContentfulAsset);
    }
    if ((value as RichText).data && (value as RichText).content && (value as RichText).nodeType == 'document') {
      return this.contentfulRichTextContentListToContentList((value as RichText).content);
    }

    // If the value type was not identify, we return the raw data as a key value pair.
    const content: { [key: string]: unknown } = {};

    for (const [key, data] of Object.entries(value)) {
      content[key] = data;
    }
    return content;
  }

  static contentfulRichTextContentListToContentList(richTextContentList: RichTextContent[]) {
    // The current Contentful library used (^9.2.5) seems to be returning different types than the ones
    // defined in their library. To avoid missing any data, we are returning the raw data received.
    return richTextContentList.map((richTextContent) => {
      return richTextContent;
    });
  }

  static contentfulAsseToAsset(contentfulAsset: ContentfulAsset): Asset {
    return {
      url: contentfulAsset.fields.file.url,
      title: contentfulAsset.fields.title,
      description: contentfulAsset.fields.description,
    };
  }
}
