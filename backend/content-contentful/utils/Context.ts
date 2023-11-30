import { Context } from '@frontastic/extension-types';

/**
 * Use this object to override values locally that would normally
 * be fetched from the projectConfiguration.
 * Only works in development.
 */
const projectConfigurationOverrides = {};

const isDevEnv = (context: Context) => {
  return context.environment === 'development' || context.environment === 'dev';
};

export const getFromProjectConfig = (key: string, context: Context) => {
  if (isDevEnv(context) && projectConfigurationOverrides[key]) {
    return projectConfigurationOverrides[key];
  }

  return context.projectConfiguration[key];
};
