import { LineItem } from '@Types/cart/LineItem';
import { CartItem, BaseResponse } from '../interfaces';
import { PromotionResponse } from '../interfaces/Promotion';

export class TalonOneMapper {
  static lineItemToTalonOneCartItem(item: LineItem): CartItem {
    return {
      name: item.name,
      sku: item.variant.sku,
      price: (item.discountedPrice ?? item.price).centAmount / 100,
      quantity: item.count,
    };
  }

  static talonOneResponseToPromotionResponse(response: BaseResponse): PromotionResponse {
    return {
      ...(response.customerSession
        ? {
            customerSession: {
              profileId: response.customerSession.profileId,
              state: response.customerSession.state,
              couponCodes: response.customerSession.couponCodes,
              referralCode: response.customerSession.referralCode,
              attributes: response.customerSession.attributes,
            },
          }
        : {}),
      effects: response.effects,
    };
  }
}
