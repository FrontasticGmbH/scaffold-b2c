import { Request } from '@frontastic/extension-types';
import { getLocale, getPath } from './Request';
import axios from 'axios';

/**
 * PageFolderFetcher can be used on multi-store projects to fetch
 * Page Folder Configuration when not available on the context.
 */
export class PageFolderFetcher {
  /**
   * If passed, the path should start with '/'.
   */
  static fetchPageFolderConfiguration = async (request: Request, path?: string): Promise<any> => {
    // TODO: get default locale if empty locale from request
    const locale = getLocale(request) ?? 'de_CH';

    // If path is empty, try to get the first position of the request path.
    path = path ?? '/' + getPath(request)?.match(/[^\/]+/)[0];

    if (path === undefined) {
      return undefined;
    }

    // TODO: get host where Page Folder Fetcher can be fetched
    const url = `https://${request.hostname}/frontastic/page?path=${path}&locale=${locale}`;

    return await axios
      .get(url)
      .then((response) => {
        return response.data?.pageFolder?.configuration;
      })
      .catch((reason) => {
        console.error(reason);
        return reason;
      });
  };
}
