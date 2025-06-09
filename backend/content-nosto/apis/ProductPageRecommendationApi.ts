import { Product } from '@Types/product/Product';
import { NostoMapper } from '../mappers/NostoMapper';
import BaseApi from './BaseApi';
import { NostoPageTypes } from '@Content-nosto/interfaces/NostoResponse';

export default class ProductPageRecommendationApi extends BaseApi {
  async fetchRecommendation(target: string, placementId: string): Promise<Product[]> {
    const sessionId = this.getSessionId();
    const body = `mutation {
      updateSession(by: BY_CID, id: "${sessionId}",
        params: {
          event: {
            type: VIEWED_PRODUCT
            target: "${target}"
            ref: "front-page-slot-1"
          }
        }
      ) {
        pages {
          forProductPage(params: {
            isPreview: false, imageVersion:   ${this.getQueryImageVersion()}
          }, product: "${target}") ${this.getQueryFields()}
        }
      }
    }`;
    const recommendationResult = await this.fetch(body);
    const placementList = recommendationResult?.data?.updateSession?.pages?.[NostoPageTypes.PRODUCT];
    const recommendedProducts = placementList.filter((obj) => obj?.resultId == placementId)[0].primary;
    return NostoMapper.mapNostoResponseToProducts(recommendedProducts);
  }
}
