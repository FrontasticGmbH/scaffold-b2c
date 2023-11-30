import BaseApi from './BaseApi';
import { NostoMapper } from '../mappers/NostoMapper';
import { Product } from '@Types/product/Product';
import { Recommendations } from '../interfaces/Recommendations';
import { NostoProduct } from '../interfaces/NostoProduct';

export default class CategoryPageRecommendationApi extends BaseApi {
  async fetchRecommendation(target: string, placementId: string): Promise<Product[]> {
    const sessionId = this.getSessionId();
    const body = `mutation {
      updateSession(by: BY_CID, id: "${sessionId}",
        params: {
          event: {
            type: VIEWED_CATEGORY
            target: "/${target}"
          }
        }
      ) {
        pages {
          forCategoryPage(params: {
            isPreview: false, imageVersion:   ${this.getQueryImageVersion()}
          }, category: "${target}") ${this.getQueryFields()}
        }
      }
    }`;
    const recommendationResult = await this.fetch(body);
    const placementList: Recommendations[] = recommendationResult?.data?.updateSession?.pages?.forCategoryPage;
    const recommendations: Recommendations = placementList.filter((obj) => obj?.resultId == placementId)[0];
    const recommendedProducts: NostoProduct[] = recommendations?.primary;
    const mappedProducts: Product[] = NostoMapper.mapNostoResponseToProducts(recommendedProducts);
    return mappedProducts;
  }
}
