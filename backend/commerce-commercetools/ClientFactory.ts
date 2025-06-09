import {
  ClientBuilder,
  Client,
  AuthMiddlewareOptions,
  HttpMiddlewareOptions,
  RefreshAuthMiddlewareOptions,
  TokenCache,
  MiddlewareResponse,
  LoggerMiddlewareOptions,
} from '@commercetools/ts-client';
import { ClientConfig } from './interfaces/ClientConfig';

export class ClientFactory {
  static factor(
    clientConfig: ClientConfig,
    environment: string | undefined,
    tokenCache: TokenCache | undefined,
    refreshToken?: string,
  ): Client {
    const httpMiddlewareOptions: HttpMiddlewareOptions = {
      host: clientConfig.hostUrl,
      includeOriginalRequest: true,
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

    // To avoid logging sensitive data, only enable the logger if the environment is defined and not production.
    if (environment !== undefined && environment !== 'prod' && environment !== 'production') {
      const loggerMiddlewareOptions: LoggerMiddlewareOptions = {
        loggerFn: (middlewareResponse: MiddlewareResponse) => {
          const { originalRequest, ...response } = middlewareResponse;

          console.log(`----+ Request for "${originalRequest.uriTemplate}" is: `, originalRequest);
          console.log(`+---- Response for "${originalRequest.uriTemplate}" is: `, response);
        },
      };

      clientBuilder = clientBuilder.withLoggerMiddleware(loggerMiddlewareOptions);
    }

    return clientBuilder.build();
  }

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
      tokenCache: tokenCache,
    };

    return new ClientBuilder()
      .withHttpMiddleware(httpMiddlewareOptions)
      .withClientCredentialsFlow(authMiddlewareOptions);
  }
}
