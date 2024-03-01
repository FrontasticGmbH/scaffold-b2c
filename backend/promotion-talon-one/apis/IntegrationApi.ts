import { Context } from '@frontastic/extension-types';
import axios, { AxiosInstance } from 'axios';
import { Cart } from '@Types/cart/Cart';
import { Profile, Session } from '../interfaces';
import { getFromProjectConfig } from '../utils/Context';
import { TalonOneMapper } from '@Promotion-talon-one/mappers/TalonOneMapper';

export class IntegrationApi {
  api: AxiosInstance;
  sessionId: string;
  locale?: string;
  currency?: string;

  constructor(frontasticContext: Context, sessionId: string, locale?: string, currency?: string) {
    this.locale = locale;
    this.currency = currency?.toUpperCase() ?? 'GBP';
    this.sessionId = sessionId;
    this.api = this.createApiClient(frontasticContext);
  }

  private createApiClient(frontasticContext: Context) {
    let host = getFromProjectConfig('EXTENSION_TALON_ONE_HOST', frontasticContext);
    if (!host) {
      host = frontasticContext.project.configuration?.talonOne?.host;
    }

    let apiKey = getFromProjectConfig('EXTENSION_TALON_ONE_API_KEY', frontasticContext);
    if (!apiKey) {
      apiKey = frontasticContext.project.configuration?.talonOne?.apiKey;
    }

    const instance = axios.create({
      baseURL: `${host}/v2`,
      headers: {
        Authorization: `ApiKey-v1 ${apiKey[this.currency]}`,
        'Content-Type': 'application/json',
      },
    });

    return instance;
  }

  async updateProfile(profile: Profile) {
    const response = await this.api.put(`/customer_profiles/${profile.profileId}`, profile.data ?? {});

    return TalonOneMapper.talonOneResponseToPromotionResponse(response.data);
  }

  async getSession() {
    const response = await this.api.get(`/customer_sessions/${this.sessionId}`);

    return TalonOneMapper.talonOneResponseToPromotionResponse(response.data);
  }

  async updateSession(session: Session) {
    const response = await this.api.put(`/customer_sessions/${this.sessionId}`, { customerSession: session });

    return TalonOneMapper.talonOneResponseToPromotionResponse(response.data);
  }

  async setProfile(profile: Profile) {
    const customerProfile = await this.updateProfile(profile);
    const customerSession = await this.updateSession({ state: 'open', profileId: profile.profileId });

    return [customerProfile, customerSession];
  }

  async updateCartItems(cart: Cart) {
    return this.updateSession({
      state: 'open',
      cartItems: cart.lineItems?.map((item) => TalonOneMapper.lineItemToTalonOneCartItem(item)),
    });
  }

  async updateShippingInfo(cart: Cart) {
    return this.updateSession({
      state: 'open',
      additionalCosts: {
        shipping: {
          price: cart.shippingInfo.price.centAmount / 100,
        },
      },
    });
  }

  async addCoupon(coupon: string) {
    const session = await this.getSession();

    return this.updateSession({
      state: 'open',
      couponCodes: [...(session.customerSession.couponCodes ?? []), coupon],
    });
  }

  async removeCoupon(coupon: string) {
    const session = await this.getSession();

    return this.updateSession({
      state: 'open',
      couponCodes: (session.customerSession.couponCodes ?? []).filter((c) => c !== coupon),
    });
  }

  async addReferralCode(code: string) {
    return this.updateSession({
      state: 'open',
      referralCode: code,
    });
  }

  async closeSession() {
    return this.updateSession({ state: 'closed' });
  }
}
