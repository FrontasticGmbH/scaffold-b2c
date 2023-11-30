import { ActionContext, Request, Response } from '@frontastic/extension-types';
import { getLocale } from '../utils/Request';
import ContentApi from '../apis/ContentApi';

type ActionHook = (request: Request, actionContext: ActionContext) => Promise<Response>;

export const getContent: ActionHook = async (request: Request, actionContext: ActionContext) => {
  const { channel, page } = request.query;
  if (!channel) {
    return {
      body: 'Missing channel info',
      statusCode: 400,
    };
  }
  if (!page) {
    return {
      body: 'Missing page name/path info',
      statusCode: 400,
    };
  }

  const contentApi = new ContentApi(actionContext.frontasticContext, getLocale(request));
  const data = await contentApi.getContent(channel, page);

  const response: Response = {
    statusCode: 200,
    body: JSON.stringify(data),
    sessionData: request.sessionData,
  };

  return response;
};

export const getContentList: ActionHook = async (request: Request, actionContext: ActionContext) => {
  const { channel, pages } = request.query;
  let pageList;
  if (!channel) {
    return {
      body: 'Missing channel info',
      statusCode: 400,
    };
  }
  if (!pages) {
    return {
      body: 'Missing page name/path List',
      statusCode: 400,
    };
  } else {
    pageList = pages.split(',');
  }

  const contentApi = new ContentApi(actionContext.frontasticContext, getLocale(request));
  const data = await contentApi.getContentList(channel, pageList);

  const response: Response = {
    statusCode: 200,
    body: JSON.stringify(data),
    sessionData: request.sessionData,
  };

  return response;
};
