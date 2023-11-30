// @ts-ignore
import { Context } from '@frontastic/extension-types';
import { getFromProjectConfig } from '@Commerce-commercetools/utils/Context';

interface Client {
  apiKey: string;
  url: string;
}

export default class BaseApi {
  private dyClient: Client;
  private sessionId: string;
  private userId: string;

  constructor(frontasticContext: Context, userId: string, sessionId: string) {
    this.userId = userId;
    this.sessionId = sessionId;
    this.dyClient = this.createDyClient(frontasticContext);
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getDyClient(): Client {
    return this.dyClient;
  }

  private createDyClient(frontasticContext: Context): Client {
    let apikey = getFromProjectConfig('EXTENSION_DYNAMICYIELD_API_KEY', frontasticContext);
    if (!apikey) {
      apikey = frontasticContext.project.configuration?.dynamicyield?.apiKey;
    }

    let host = getFromProjectConfig('EXTENSION_DYNAMICYIELD_HOST', frontasticContext);
    if (!host) {
      host = frontasticContext.project.configuration?.dynamicyield?.host;
    }

    const dyClient = {
      apiKey: apikey,
      url: `${host}/v2/serve/user/choose`,
    };
    return dyClient;
  }
}
