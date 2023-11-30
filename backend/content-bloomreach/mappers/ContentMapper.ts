import { Content } from '@Types/content/Content';

export class ContentMapper {
  static bloomreachDocumentToContent(response: any): Content {
    response = JSON.parse(JSON.stringify(response));

    const pageRef = response.root.$ref.split('/').pop();
    const pageData = response.page[pageRef];

    const documentRef = response.document?.$ref.split('/').pop();
    const documentData = response.page[documentRef];
    const { id, title, introduction, image } = documentData.data;

    const imageRef = image.$ref.split('/').pop();
    const imageLinks = response.page[imageRef].data.original?.links;

    return {
      contentId: pageData.id,
      contentTypeId: id,
      title: title,
      banner: imageLinks?.site?.href,
      summary: introduction,
    };
  }
}
