import { ProjectSettings } from 'shared/types/ProjectSettings';
import { SDKResponse, ServerOptions } from '@commercetools/frontend-sdk';

type GetProjectSettingsAction = (options?: {
  /**
   * @param {boolean} [options.parallel] - An optional boolean, default true indicating whether the action should executed asyncronously or be added to a queue and executed in sequence. Useful to supply false on actions you may think have race conditions.
   */
  parallel?: boolean;
  /**
   * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value. Overrides customHeaderValue passed in coFE base SDK configure.
   */
  customHeaderValue?: string;
  /**
   * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
   */
  serverOptions?: ServerOptions;
}) => Promise<SDKResponse<ProjectSettings>>;

export { type GetProjectSettingsAction };
