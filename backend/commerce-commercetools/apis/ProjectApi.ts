import { ProjectSettings } from '@Types/ProjectSettings';
import { BaseApi } from './BaseApi';

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
