import fetch from 'node-fetch';
import { Context } from '@frontastic/extension-types';
import { Product } from '@Types/product/Product';
import { getFromProjectConfig } from '@Content-nosto/utils/Context';
import { NostoResponse } from '@Content-nosto/interfaces/NostoResponse';

export default abstract class BaseApi {
  private readonly graphqlQueryFields = `{
    divId
    resultId
    primary {
      productId
      name
      listPrice
      imageUrl
      categories
      url
    }
  }`;
  private readonly graphqlQueryImageVersion = `VERSION_8_400_400`;
  private sessionId: string;
  private apiToken: string;
  private apiUrl: string;

  constructor(frontasticContext: Context, nostoSessionId: string) {
    const nostoConfig = frontasticContext.project.configuration?.nosto;
    this.apiToken = getFromProjectConfig('EXTENSION_NOSTO_API_TOKEN', frontasticContext) ?? nostoConfig.apiToken;
    this.apiUrl = getFromProjectConfig('EXTENSION_NOSTO_API_URL', frontasticContext) ?? nostoConfig.apiUrl;

    this.sessionId = nostoSessionId;
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  public abstract fetchRecommendation(target: string, placementId: string): Promise<Product[]>;

  protected getQueryFields() {
    return this.graphqlQueryFields;
  }

  protected getQueryImageVersion() {
    return this.graphqlQueryImageVersion;
  }

  protected async fetch(body: string): Promise<NostoResponse> {
    const headers = {
      'Content-Type': 'application/graphql',
      Authorization: 'Basic ' + Buffer.from(`:${this.apiToken}`).toString('base64'),
    };
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        body,
        headers,
      });
      return response.json();
    } catch (error) {
      throw error;
    }
  }
}
