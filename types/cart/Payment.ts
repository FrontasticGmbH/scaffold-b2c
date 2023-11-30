import { Money } from '../product/Money';

export enum PaymentStatuses {
  INIT = 'init',
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
}

export interface Payment {
  /**
   * An internal ID to identify this payment
   */
  id: string;

  /**
   * The name of the payment service provider
   */
  paymentProvider: string;

  /**
   * The ID used by the payment service provider for this payment
   */
  paymentId: string;

  /**
   * How much money this payment intends to receive from the customer. The value usually matches the cart or order gross total.
   */
  amountPlanned: Money;

  /**
   * A text describing the current status of the payment
   */
  debug?: string;

  /**
   * One of the `PaymentStatuses` constants
   */
  paymentStatus: string;

  version?: number;

  /**
   * The descriptor of the payment method used for this payment
   */
  paymentMethod: string;

  // TODO: do we need paymentDetails if not using custom fields?
  paymentDetails?: [];
}
