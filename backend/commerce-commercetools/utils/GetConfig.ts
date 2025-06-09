import { Context } from '@frontastic/extension-types';
import { ClientConfig } from '../interfaces/ClientConfig';
import { getFromProjectConfig } from './Context';
import { normalizeUrl } from '@Commerce-commercetools/utils/NormalizeData';

export const getConfig = (context: Context, engine: string): ClientConfig => {
  const prefix = `EXTENSION_${engine.toUpperCase()}`;

  const clientConfig: ClientConfig = {
    authUrl: getFromProjectConfig(`${prefix}_AUTH_URL`, context),
    clientId: getFromProjectConfig(`${prefix}_CLIENT_ID`, context),
    clientSecret: getFromProjectConfig(`${prefix}_CLIENT_SECRET`, context),
    hostUrl: getFromProjectConfig(`${prefix}_HOST_URL`, context),
    projectKey: getFromProjectConfig(`${prefix}_PROJECT_KEY`, context),
    productIdField: getFromProjectConfig(`${prefix}_PRODUCT_ID_FIELD`, context),
    categoryIdField: getFromProjectConfig(`${prefix}_CATEGORY_ID_FIELD`, context),
    sessionUrl: getFromProjectConfig(`${prefix}_SESSION_URL`, context),
    checkoutApplicationKey: getFromProjectConfig(`${prefix}_CHECKOUT_APPLICATION_KEY`, context),
  };

  if (!clientConfig.authUrl) {
    clientConfig.authUrl = context.project.configuration?.[engine]?.authUrl;
  }

  if (!clientConfig.clientId) {
    clientConfig.clientId = context.project.configuration?.[engine]?.clientId;
  }

  if (!clientConfig.clientSecret) {
    clientConfig.clientSecret = context.project.configuration?.[engine]?.clientSecret;
  }

  if (!clientConfig.hostUrl) {
    clientConfig.hostUrl = context.project.configuration?.[engine]?.hostUrl;
  }

  if (!clientConfig.projectKey) {
    clientConfig.projectKey = context.project.configuration?.[engine]?.projectKey;
  }

  if (!clientConfig.productIdField) {
    clientConfig.productIdField = context.project.configuration?.[engine]?.productIdField;
  }

  if (!clientConfig.categoryIdField) {
    clientConfig.categoryIdField = context.project.configuration?.[engine]?.categoryIdField;
  }

  if (!clientConfig.sessionUrl) {
    clientConfig.sessionUrl = context.project.configuration?.[engine]?.sessionUrl;
  }

  if (!clientConfig.checkoutApplicationKey) {
    clientConfig.checkoutApplicationKey = context.project.configuration?.[engine]?.checkoutApplicationKey;
  }

  // Normalize urls
  clientConfig.authUrl = normalizeUrl(clientConfig.authUrl);
  clientConfig.hostUrl = normalizeUrl(clientConfig.hostUrl);
  clientConfig.sessionUrl = normalizeUrl(clientConfig.sessionUrl);

  return clientConfig;
};
