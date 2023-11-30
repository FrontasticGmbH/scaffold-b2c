export type PaymentMethodType =
  | 'scheme'
  | 'klarna'
  | 'klarna_account'
  | 'klarna_paynow'
  | 'paysafecard'
  | 'swish'
  | 'trustly'
  | 'vipps'
  | 'multibanco'
  | 'ideal';

export interface PaymentMethod {
  name: string;
  type: PaymentMethodType;
  image: {
    src: string;
  };
}

export interface RedirectAction {
  type: 'redirect';
  method: string;
  data?: unknown;
  url: string;
  paymentMethodType: string;
}

export interface ThreeDS2Action {
  type: 'threeDS2';
  authorisationToken: string;
  paymentData: string;
  paymentMethodType: string;
  subtype: string;
  token: string;
  url: string;
}
export type PaymentAction = RedirectAction | ThreeDS2Action;

export type PaymentResponse = {
  additionalData: Record<string, string>;
  pspReference: string;
  resultCode:
    | 'Authorised'
    | 'Cancelled'
    | 'Error'
    | 'Refused'
    | 'RedirectShopper'
    | 'IdentifyShopper'
    | 'ChallengeShopper';
  merchantReference: string;
  action?: PaymentAction;
};

export interface SchemePaymentRequestPayload {
  amount: {
    currency: string;
    value: number;
  };
  reference: string;
  paymentMethod: SchemeData;
  returnUrl: string;
  channel: 'web';
  origin: string;
  countryCode: string;
  shopperLocale: string;
  browserInfo: {
    acceptHeader: string;
    colorDepth: number;
    javaEnabled: boolean;
    javaScriptEnabled?: boolean;
    language: string;
    screenHeight: number;
    screenWidth: number;
    timeZoneOffset: number;
    userAgent: string;
  };
  authenticationData: {
    threeDSRequestData: {
      nativeThreeDS: 'preferred';
    };
  };
  metadata?: Record<string, unknown>;
}

export interface KlarnaLineItem {
  id: string;
  quantity: string;
  description: string;
  amountIncludingTax: number | string;
  productUrl?: string;
  imageUrl?: string;
}

export interface KlarnaPaymentRequestPayload {
  amount: {
    currency: string;
    value: number;
  };
  reference: string;
  paymentMethod: Pick<KlarnaData, 'type'>;
  returnUrl: string;
  countryCode: string;
  shopperLocale: string;
  shopperReference: string;
  shopperEmail: string;
  shopperName?: {
    firstName: string;
    lastName?: string;
  };
  lineItems: Array<KlarnaLineItem>;
  metadata?: Record<string, unknown>;
}

export type PaymentRequestPayload = SchemePaymentRequestPayload | KlarnaPaymentRequestPayload;

export interface SchemeData {
  type: 'scheme';
  brand: string;
  holderName: string;
  number: string;
  expiryMonth: string;
  expiryYear: string;
  cvc: string;
}

export interface KlarnaData {
  type: 'klarna_paynow';
  shopperEmail: string;
  shopperFirstName: string;
  shopperLastName?: string;
}

export type PaymentData = SchemeData | KlarnaData;

export type ThreeDS2AuthCallback = (response: PaymentResponse) => void;

export interface PaymentProvider {
  paymentData: PaymentData;
  paymentDataIsValid: boolean;
  processing: boolean;
  setProcessing: (val: boolean) => void;
  setPaymentData: (data: PaymentData) => void;
  getPaymentMethods: () => Promise<PaymentMethod[]>;
  makePayment: (data: Omit<SchemePaymentRequestPayload, 'paymentMethod'>) => Promise<PaymentResponse>;
  makeKlarnaPayment: (
    data: Omit<KlarnaPaymentRequestPayload, 'paymentMethod' | 'shopperEmail' | 'shopperName'>,
  ) => Promise<PaymentResponse>;
  handleThreeDS2Action: (action: PaymentAction, cb: ThreeDS2AuthCallback) => Promise<void>;
}
