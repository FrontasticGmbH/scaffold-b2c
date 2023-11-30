export type PaymentMethod = {
  name: string;
  type: string;
  brands?: string[];
};

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
  resultCode: 'Authorised' | 'Cancelled' | 'Error' | 'Refused';
  merchantReference: string;
  action?: PaymentAction;
};
