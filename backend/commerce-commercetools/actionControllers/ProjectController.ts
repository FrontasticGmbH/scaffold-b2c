import { ActionContext, Request, Response } from '@frontastic/extension-types';
import handleError from '@Commerce-commercetools/utils/handleError';
import getProjectApi from '@Commerce-commercetools/utils/apiFactories/getProjectApi';

type ActionHook = (request: Request, actionContext: ActionContext) => Promise<Response>;

export const getProjectSettings: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const projectApi = getProjectApi(request, actionContext.frontasticContext);
    const project = await projectApi.getProjectSettings();

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify(project),
      sessionData: {
        ...projectApi.getSessionData(),
      },
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};
