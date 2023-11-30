import { SDKResponse } from '@commercetools/frontend-sdk';
import useSWR from 'swr';
import { sdk } from 'sdk';
import { ProjectSettings } from './types';

const useProjectSettings = () => {
  const response = useSWR<SDKResponse<ProjectSettings>>('action/project/getProjectSettings', () =>
    sdk.callAction({ actionName: 'project/getProjectSettings' }),
  );

  const data = response.data?.isError ? {} : response.data?.data;

  return { ...response, data };
};

export default useProjectSettings;
