import { PaymentMethod, PaymentResponse } from '../../types/payment';
import { AdyenPaymentMethod } from '../types/paymentMethod';
import { AdyenPaymentResponse } from 'payment-adyen/types/payment';

export class AdyenMapper {
  static adyenPaymentMethodToPaymentMethod(adyenPaymentMethod: AdyenPaymentMethod) {
    return adyenPaymentMethod as PaymentMethod;
  }

  static adyenPaymentResponseToPaymentResponse(adyenPaymentResponse: AdyenPaymentResponse) {
    return adyenPaymentResponse as PaymentResponse;
  }
}
