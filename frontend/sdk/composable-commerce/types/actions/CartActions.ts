import { Cart, Order, ShippingMethod } from 'shared/types/cart';
import { SDKResponse, ServerOptions } from '@commercetools/frontend-sdk';
import {
  AddCartItemPayload,
  CheckoutCartPayload,
  RemoveCartItemPayload,
  UpdateCartItemPayload,
  UpdateCartPayload,
  GetCartShippingMethodsPayload,
  SetCartShippingMethodPayload,
  RedeemDiscountCodePayload,
  RemoveDiscountCodePayload,
} from '../payloads/CartPayloads';
import { QueryOrdersQuery, GetOrderQuery } from '../queries/CartQueries';
import { PaginatedResult } from 'shared/types/result';
import { Token } from 'shared/types/Token';

type GetCartAction = (options?: {
  /**
   * @param {boolean} [options.parallel] - An optional boolean, default true indicating whether the action should executed asyncronously or be added to a queue and executed in sequence. Useful to supply false on actions you may think have race conditions.
   */
  parallel?: boolean;
  /**
   * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value. Overrides customHeaderValue passed in coFE base SDK configure.
   */
  customHeaderValue?: string;
  /**
   * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
   */
  serverOptions?: ServerOptions;
}) => Promise<SDKResponse<Cart>>;

type AddCartItemAction = (
  payload: AddCartItemPayload,
  options?: {
    /**
     * @param {boolean} [options.parallel] - An optional boolean, default true indicating whether the action should executed asyncronously or be added to a queue and executed in sequence. Useful to supply false on actions you may think have race conditions.
     */
    parallel?: boolean;
    /**
     * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value. Overrides customHeaderValue passed in coFE base SDK configure.
     */
    customHeaderValue?: string;
    /**
     * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
     */
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<Cart>>;

type RemoveCartItemAction = (
  payload: RemoveCartItemPayload,
  options?: {
    /**
     * @param {boolean} [options.parallel] - An optional boolean, default true indicating whether the action should executed asyncronously or be added to a queue and executed in sequence. Useful to supply false on actions you may think have race conditions.
     */
    parallel?: boolean;
    /**
     * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value. Overrides customHeaderValue passed in coFE base SDK configure.
     */
    customHeaderValue?: string;
    /**
     * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
     */
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<Cart>>;

type UpdateCartItemAction = (
  payload: UpdateCartItemPayload,
  options?: {
    /**
     * @param {boolean} [options.parallel] - An optional boolean, default true indicating whether the action should executed asyncronously or be added to a queue and executed in sequence. Useful to supply false on actions you may think have race conditions.
     */
    parallel?: boolean;
    /**
     * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value. Overrides customHeaderValue passed in coFE base SDK configure.
     */
    customHeaderValue?: string;
    /**
     * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
     */
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<Cart>>;

type UpdateCartAction = (
  payload: UpdateCartPayload,
  options?: {
    /**
     * @param {boolean} [options.parallel] - An optional boolean, default true indicating whether the action should executed asyncronously or be added to a queue and executed in sequence. Useful to supply false on actions you may think have race conditions.
     */
    parallel?: boolean;
    /**
     * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value. Overrides customHeaderValue passed in coFE base SDK configure.
     */
    customHeaderValue?: string;
    /**
     * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
     */
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<Cart>>;

type GetCartShippingMethodsAction = (
  payload: GetCartShippingMethodsPayload,
  options?: {
    /**
     * @param {boolean} [options.parallel] - An optional boolean, default true indicating whether the action should executed asyncronously or be added to a queue and executed in sequence. Useful to supply false on actions you may think have race conditions.
     */
    parallel?: boolean;
    /**
     * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value. Overrides customHeaderValue passed in coFE base SDK configure.
     */
    customHeaderValue?: string;
    /**
     * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
     */
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<ShippingMethod[]>>;

type GetAvailableCartShippingMethodsAction = (options?: {
  /**
   * @param {boolean} [options.parallel] - An optional boolean, default true indicating whether the action should executed asyncronously or be added to a queue and executed in sequence. Useful to supply false on actions you may think have race conditions.
   */
  parallel?: boolean;
  /**
   * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value. Overrides customHeaderValue passed in coFE base SDK configure.
   */
  customHeaderValue?: string;
  /**
   * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
   */
  serverOptions?: ServerOptions;
}) => Promise<SDKResponse<ShippingMethod[]>>;

type SetCartShippingMethodAction = (
  payload: SetCartShippingMethodPayload,
  options?: {
    /**
     * @param {boolean} [options.parallel] - An optional boolean, default true indicating whether the action should executed asyncronously or be added to a queue and executed in sequence. Useful to supply false on actions you may think have race conditions.
     */
    parallel?: boolean;
    /**
     * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value. Overrides customHeaderValue passed in coFE base SDK configure.
     */
    customHeaderValue?: string;
    /**
     * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
     */
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<Cart>>;

type RedeemDiscountCodeAction = (
  payload: RedeemDiscountCodePayload,
  options?: {
    /**
     * @param {boolean} [options.parallel] - An optional boolean, default true indicating whether the action should executed asyncronously or be added to a queue and executed in sequence. Useful to supply false on actions you may think have race conditions.
     */
    parallel?: boolean;
    /**
     * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value. Overrides customHeaderValue passed in coFE base SDK configure.
     */
    customHeaderValue?: string;
    /**
     * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
     */
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<Cart | string>>;

type RemoveDiscountCodeAction = (
  payload: RemoveDiscountCodePayload,
  options?: {
    /**
     * @param {boolean} [options.parallel] - An optional boolean, default true indicating whether the action should executed asyncronously or be added to a queue and executed in sequence. Useful to supply false on actions you may think have race conditions.
     */
    parallel?: boolean;
    /**
     * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value. Overrides customHeaderValue passed in coFE base SDK configure.
     */
    customHeaderValue?: string;
    /**
     * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
     */
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<Cart>>;

type CheckoutCartAction = (
  payload: CheckoutCartPayload,
  options?: {
    /**
     * @param {boolean} [options.parallel] - An optional boolean, default true indicating whether the action should executed asyncronously or be added to a queue and executed in sequence. Useful to supply false on actions you may think have race conditions.
     */
    parallel?: boolean;
    /**
     * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value. Overrides customHeaderValue passed in coFE base SDK configure.
     */
    customHeaderValue?: string;
    /**
     * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
     */
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<Cart>>;

type QueryOrdersAction = (
  query?: QueryOrdersQuery,
  options?: {
    /**
     * @param {boolean} [options.parallel] - An optional boolean, default true indicating whether the action should executed asyncronously or be added to a queue and executed in sequence. Useful to supply false on actions you may think have race conditions.
     */
    parallel?: boolean;
    /**
     * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value. Overrides customHeaderValue passed in coFE base SDK configure.
     */
    customHeaderValue?: string;
    /**
     * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
     */
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<PaginatedResult<Order>>>;

type GetOrderAction = (
  query: GetOrderQuery,
  options?: {
    /**
     * @param {boolean} [options.parallel] - An optional boolean, default true indicating whether the action should executed asyncronously or be added to a queue and executed in sequence. Useful to supply false on actions you may think have race conditions.
     */
    parallel?: boolean;
    /**
     * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value. Overrides customHeaderValue passed in coFE base SDK configure.
     */
    customHeaderValue?: string;
    /**
     * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
     */
    serverOptions?: ServerOptions;
  },
) => Promise<SDKResponse<Order>>;

type GetCheckoutSessionTokenAction = (options?: {
  /**
   * @param {boolean} [options.parallel] - An optional boolean, default true indicating whether the action should executed asyncronously or be added to a queue and executed in sequence. Useful to supply false on actions you may think have race conditions.
   */
  parallel?: boolean;
  /**
   * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value. Overrides customHeaderValue passed in coFE base SDK configure.
   */
  customHeaderValue?: string;
  /**
   * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
   */
  serverOptions?: ServerOptions;
}) => Promise<SDKResponse<Token>>;

export {
  type GetCartAction,
  type AddCartItemAction,
  type RemoveCartItemAction,
  type UpdateCartItemAction,
  type UpdateCartAction,
  type GetCartShippingMethodsAction,
  type GetAvailableCartShippingMethodsAction,
  type SetCartShippingMethodAction,
  type RedeemDiscountCodeAction,
  type RemoveDiscountCodeAction,
  type CheckoutCartAction,
  type QueryOrdersAction,
  type GetOrderAction,
  type GetCheckoutSessionTokenAction,
};
