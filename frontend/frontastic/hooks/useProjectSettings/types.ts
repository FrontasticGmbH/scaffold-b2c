export interface ProjectSettings {
  // The name of the project.
  name?: string;

  // A two-digit country code as per [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2).
  countries?: string[];

  // A three-digit currency code as per [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217).
  currencies?: string[];

  languages?: string[];
  projectKey?: string;
  region?: string;
}
