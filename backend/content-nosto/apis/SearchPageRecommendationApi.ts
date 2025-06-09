import { Product } from '@Types/product/Product';
import { NostoMapper } from '../mappers/NostoMapper';
import BaseApi from './BaseApi';
import { NostoPageTypes } from '@Content-nosto/interfaces/NostoResponse';

export default class SearchPageRecommendationApi extends BaseApi {
  async fetchRecommendation(target: string, placementId: string): Promise<Product[]> {
    const sessionId = this.getSessionId();
    const body = `mutation {
      updateSession(by: BY_CID, id: "${sessionId}",
        params: {
          event: {
            type: SEARCHED_FOR
            target: "${target}"
          }
        }
      ) {
        pages {
          forSearchPage(params: {
            isPreview: false, imageVersion:   ${this.getQueryImageVersion()}
          }, term: "${target}") ${this.getQueryFields()}
        }
      }
    }`;
    const recommendationResult = await this.fetch(body);
    const placementList = recommendationResult?.data?.updateSession?.pages?.[NostoPageTypes.SEARCH];
    const recommendedProducts = placementList.filter((obj) => obj?.resultId == placementId)[0].primary;
    return NostoMapper.mapNostoResponseToProducts(recommendedProducts);
  }
}
