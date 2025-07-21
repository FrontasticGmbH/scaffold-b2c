import { Context, Request } from '@frontastic/extension-types';
import { ProjectApi } from '@Commerce-commercetools/apis/ProjectApi';
import { getCurrency, getLocale } from '@Commerce-commercetools/utils/Request';

const getProjectApi = (request: Request, context: Context): ProjectApi => {
  return new ProjectApi(context, getLocale(request), getCurrency(request), request);
};

export default getProjectApi;
