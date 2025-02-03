import { SDKResponse } from '@commercetools/frontend-sdk';
import useSWR from 'swr';
import { sdk } from 'sdk';
import { ProjectSettings } from './types';

const useProjectSettings = () => {
  const response = useSWR<SDKResponse<ProjectSettings>>('/action/project/getProjectSettings', () =>
    sdk.composableCommerce.project.getSettings(),
  );

  const projectSettings = response.data?.isError ? {} : response.data?.data;

  return { ...response, projectSettings };
};

export default useProjectSettings;
