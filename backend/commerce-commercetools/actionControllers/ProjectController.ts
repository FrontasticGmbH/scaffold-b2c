import { ActionContext, Request, Response } from '@frontastic/extension-types';
import { getCurrency, getLocale } from '../utils/Request';
import { ProjectApi } from '../apis/ProjectApi';
import handleError from '@Commerce-commercetools/utils/handleError';
import extractRegionFromCommercetoolsHostUrl from '@Commerce-commercetools/utils/extractRegionFromCommercetoolsHostUrl';

type ActionHook = (request: Request, actionContext: ActionContext) => Promise<Response>;

function getProjectApi(request: Request, actionContext: ActionContext) {
  return new ProjectApi(actionContext.frontasticContext, getLocale(request), getCurrency(request), request);
}

export const getProjectSettings: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const projectApi = getProjectApi(request, actionContext);

    const project = await projectApi.getProjectSettings();

    const region = extractRegionFromCommercetoolsHostUrl(actionContext.frontasticContext);

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify({ ...project, region }),
      sessionData: {
        ...projectApi.getSessionData(),
      },
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};
