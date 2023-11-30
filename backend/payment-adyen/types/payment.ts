export interface AdyenRedirectAction {
  type: 'redirect';
  method: string;
  data?: unknown;
  url: string;
  paymentMethodType: string;
}

export interface AdyenThreeDS2Action {
  type: 'threeDS2';
  authorisationToken: string;
  paymentData: string;
  paymentMethodType: string;
  subtype: string;
  token: string;
  url: string;
}

export type AdyenPaymentAction = AdyenRedirectAction | AdyenThreeDS2Action;

export interface AdyenPaymentResponse {
  additionalData: Record<string, string>;
  pspReference: string;
  resultCode: 'Authorised' | 'Cancelled' | 'Error' | 'Refused';
  merchantReference: string;
  action?: AdyenPaymentAction;
}
