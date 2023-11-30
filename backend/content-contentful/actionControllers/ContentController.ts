import { ActionContext, Request, Response } from '@frontastic/extension-types';
import { getLocale } from '../utils/Request';
import ContentApi from '../apis/ContentApi';

type ActionHook = (request: Request, actionContext: ActionContext) => Promise<Response>;

export const getContent: ActionHook = async (request: Request, actionContext: ActionContext) => {
  const contentApi = new ContentApi(actionContext.frontasticContext, getLocale(request));

  const data = await contentApi.getContent(request.query.id);

  const response: Response = {
    statusCode: 200,
    body: JSON.stringify(data),
    sessionData: request.sessionData,
  };

  return response;
};
