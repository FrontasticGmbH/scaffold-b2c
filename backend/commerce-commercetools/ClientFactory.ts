import {
  ClientBuilder,
  Client,
  AuthMiddlewareOptions,
  HttpMiddlewareOptions,
  RefreshAuthMiddlewareOptions,
  TokenCache,
} from '@commercetools/ts-client';
// @ts-ignore
import fetch from 'node-fetch';
import { ClientConfig } from './interfaces/ClientConfig';

export class ClientFactory {
  static factor: (
    clientConfig: ClientConfig,
    environment: string | undefined,
    tokenCache: TokenCache | undefined,
    refreshToken?: string,
  ) => Client = (
    clientConfig: ClientConfig,
    environment: string | undefined,
    tokenCache: TokenCache | undefined,
    refreshToken?: string,
  ) => {
    const httpMiddlewareOptions: HttpMiddlewareOptions = {
      host: clientConfig.hostUrl,
      httpClient: fetch,
    };

    let clientBuilder: ClientBuilder;

    switch (true) {
      case refreshToken !== undefined:
        clientBuilder = ClientFactory.getClientBuilderWithRefreshTokenFlow(
          clientConfig,
          tokenCache,
          refreshToken,
          httpMiddlewareOptions,
        );
        break;

      default:
        clientBuilder = ClientFactory.getClientBuilderWithClientCredentialsFlow(
          clientConfig,
          tokenCache,
          httpMiddlewareOptions,
        );
        break;
    }

    // To avoid logging sensible data, only enable the logger if the environment is defined and not production.
    if (environment !== undefined && environment !== 'prod' && environment !== 'production') {
      clientBuilder = clientBuilder.withLoggerMiddleware();
    }

    return clientBuilder.build();
  };

  private static getClientBuilderWithRefreshTokenFlow(
    clientConfig: ClientConfig,
    tokenCache: TokenCache,
    refreshToken: string,
    httpMiddlewareOptions: HttpMiddlewareOptions,
  ) {
    const refreshAuthMiddlewareOptions: RefreshAuthMiddlewareOptions = {
      host: clientConfig.authUrl,
      projectKey: clientConfig.projectKey,
      credentials: {
        clientId: clientConfig.clientId,
        clientSecret: clientConfig.clientSecret,
      },
      // scopes: ['manage_project:' + clientConfig.projectKey],
      httpClient: fetch,
      tokenCache: tokenCache,
      refreshToken: refreshToken,
    };

    return new ClientBuilder()
      .withHttpMiddleware(httpMiddlewareOptions)
      .withRefreshTokenFlow(refreshAuthMiddlewareOptions);
  }

  private static getClientBuilderWithClientCredentialsFlow(
    clientConfig: ClientConfig,
    tokenCache: TokenCache,
    httpMiddlewareOptions: HttpMiddlewareOptions,
  ) {
    const authMiddlewareOptions: AuthMiddlewareOptions = {
      host: clientConfig.authUrl,
      projectKey: clientConfig.projectKey,
      credentials: {
        clientId: clientConfig.clientId,
        clientSecret: clientConfig.clientSecret,
      },
      // scopes: ['manage_project:' + clientConfig.projectKey],
      httpClient: fetch,
      tokenCache: tokenCache,
    };

    return new ClientBuilder()
      .withHttpMiddleware(httpMiddlewareOptions)
      .withClientCredentialsFlow(authMiddlewareOptions);
  }
}
