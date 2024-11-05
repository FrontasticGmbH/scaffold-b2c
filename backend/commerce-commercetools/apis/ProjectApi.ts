import { ProjectSettings } from '@Types/ProjectSettings';
import { Context } from '@frontastic/extension-types';
import { BaseApi } from './BaseApi';
import extractRegionFromCommercetoolsHostUrl from '@Commerce-commercetools/utils/extractRegionFromCommercetoolsHostUrl';

export class ProjectApi extends BaseApi {
  async getProjectSettings(): Promise<ProjectSettings> {
    return await this.getProject().then((response) => {
      const region = extractRegionFromCommercetoolsHostUrl(this.clientSettings.hostUrl);

      const projectSettings: ProjectSettings = {
        name: response.name,
        countries: response.countries,
        currencies: response.currencies,
        languages: response.languages,
        projectKey: response.key,
        region,
      };

      return projectSettings;
    });
  }
}
