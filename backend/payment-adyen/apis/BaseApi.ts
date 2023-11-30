import axios, { AxiosInstance } from 'axios';
import { AdyenMapper } from '../mappers/AdyenMapper';
import { AdyenPaymentResponse } from '../types/payment';
import { AdyenPaymentMethod } from '../types/paymentMethod';

class BaseApi {
  private instance: AxiosInstance;

  constructor(config: Record<string, string>) {
    //Axios instance
    this.instance = axios.create({
      baseURL: config.EXTENSION_ADYEN_BASE_URL,
      headers: {
        'x-API-key': config.EXTENSION_ADYEN_API_KEY,
        'content-type': 'application/json',
      },
    });

    //Request interceptor
    this.instance.interceptors.request.use((req) => {
      req.data = { ...(req.data || {}), merchantAccount: config.EXTENSION_ADYEN_MERCHANT_ACCOUNT };
      return req;
    });
  }

  async getPaymentMethods({ locale, country }: { locale: string; country: string }) {
    const response = await this.instance.post<{ paymentMethods: AdyenPaymentMethod[] }>('/paymentMethods', {
      countryCode: country,
      shopperLocale: locale,
    });

    return response.data.paymentMethods.map((paymentMethod) =>
      AdyenMapper.adyenPaymentMethodToPaymentMethod(paymentMethod),
    );
  }

  async makePayment(data: unknown) {
    const response = await this.instance.post<AdyenPaymentResponse>('/payments', data);

    return AdyenMapper.adyenPaymentResponseToPaymentResponse(response.data);
  }

  async paymentDetails(data: unknown) {
    const response = await this.instance.post<AdyenPaymentResponse>('/payments/details', data);

    return AdyenMapper.adyenPaymentResponseToPaymentResponse(response.data);
  }
}

export default BaseApi;
