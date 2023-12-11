import { BaseApi } from './BaseApi';
import { ProjectSettings } from '@Types/ProjectSettings';

export class ProjectApi extends BaseApi {
  getProjectSettings: () => Promise<ProjectSettings> = async () => {
    return await this.getProject().then((response) => {
      const projectSettings: ProjectSettings = {
        name: response.name,
        countries: response.countries,
        currencies: response.currencies,
        languages: response.languages,
        projectKey: response.key,
      };

      return projectSettings;
    });
  };
}
