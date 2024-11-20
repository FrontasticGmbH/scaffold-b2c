import { Event, SDK, ServerOptions } from '@commercetools/frontend-sdk';
import {
  AddCartItemPayload,
  CheckoutCartPayload,
  GetCartShippingMethodsPayload,
  RedeemDiscountCodePayload,
  RemoveCartItemPayload,
  RemoveDiscountCodePayload,
  SetCartShippingMethodPayload,
  UpdateCartItemPayload,
  UpdateCartPayload,
} from '../../types/payloads/CartPayloads';
import {
  AddCartItemAction,
  CheckoutCartAction,
  GetAvailableCartShippingMethodsAction,
  GetCartAction,
  GetCartShippingMethodsAction,
  GetCheckoutSessionTokenAction,
  GetOrderAction,
  QueryOrdersAction,
  RedeemDiscountCodeAction,
  RemoveCartItemAction,
  RemoveDiscountCodeAction,
  SetCartShippingMethodAction,
  UpdateCartAction,
  UpdateCartItemAction,
} from '../../types/actions/CartActions';
import { Cart, ShippingMethod, Order } from 'shared/types/cart';
import { ComposableCommerceEvents } from '../../types/events/ComposableCommerceEvents';
import { QueryOrdersQuery, GetOrderQuery } from '../../types/queries/CartQueries';
import { PaginatedResult } from 'shared/types/result';
import { Token } from 'shared/types/Token';

export type CartActions = {
  getCart: GetCartAction;
  addItem: AddCartItemAction;
  removeItem: RemoveCartItemAction;
  updateItem: UpdateCartItemAction;
  updateCart: UpdateCartAction;
  getShippingMethods: GetCartShippingMethodsAction;
  getAvailableShippingMethods: GetAvailableCartShippingMethodsAction;
  setShippingMethod: SetCartShippingMethodAction;
  redeemDiscountCode: RedeemDiscountCodeAction;
  removeDiscountCode: RemoveDiscountCodeAction;
  checkout: CheckoutCartAction;
  queryOrders: QueryOrdersAction;
  getOrder: GetOrderAction;
  getCheckoutSessionToken: GetCheckoutSessionTokenAction;
};

export const getCartActions = (sdk: SDK<ComposableCommerceEvents>): CartActions => {
  return {
    getCart: async (
      options: {
        parallel?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<Cart>({
        actionName: 'cart/getCart',
        parallel: options.parallel,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });

      if (!response.isError) {
        sdk.trigger(
          new Event({
            eventName: 'cartFetched',
            data: {
              cart: response,
            },
          }),
        );
      }
      return response;
    },
    addItem: async (
      payload: AddCartItemPayload,
      options: {
        parallel?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<Cart>({
        actionName: 'cart/addToCart',
        payload,
        parallel: options.parallel,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });

      if (!response.isError) {
        sdk.trigger(
          new Event({
            eventName: 'productAddedToCart',
            data: {
              product: payload.variant,
              quantity: payload.variant.count,
            },
          }),
        );
      }
      return response;
    },
    removeItem: async (
      payload: RemoveCartItemPayload,
      options: {
        parallel?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<Cart>({
        actionName: 'cart/removeLineItem',
        payload,
        parallel: options.parallel,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });

      if (!response.isError) {
        sdk.trigger(
          new Event({
            eventName: 'productRemovedFromCart',
            data: {
              product: payload.lineItem,
              quantity: 1,
            },
          }),
        );
      }
      return response;
    },
    updateItem: async (
      payload: UpdateCartItemPayload,
      options: {
        parallel?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<Cart>({
        actionName: 'cart/updateLineItem',
        payload,
        parallel: options.parallel,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });

      if (!response.isError) {
        sdk.trigger(
          new Event({
            eventName: 'productUpdatedInCart',
            data: {
              product: {
                id: payload.lineItem.id,
              },
              newQuantity: payload.lineItem.count,
            },
          }),
        );
      }
      return response;
    },
    updateCart: async (
      payload: UpdateCartPayload,
      options: {
        parallel?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<Cart>({
        actionName: 'cart/updateCart',
        payload,
        parallel: options.parallel,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });

      if (!response.isError) {
        sdk.trigger(
          new Event({
            eventName: 'cartUpdated',
            data: payload,
          }),
        );
      }
      return response;
    },
    getShippingMethods: async (
      payload?: GetCartShippingMethodsPayload,
      options: {
        parallel?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<ShippingMethod[]>({
        actionName: 'cart/getShippingMethods',
        query: payload?.query ?? undefined,
        parallel: options.parallel,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });

      if (!response.isError) {
        sdk.trigger(
          new Event({
            eventName: 'shippingMethodsFetched',
            data: {
              shippingMethods: response.data,
            },
          }),
        );
      }
      return response;
    },
    getAvailableShippingMethods: async (
      options: {
        parallel?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<ShippingMethod[]>({
        actionName: 'cart/getAvailableShippingMethods',
        parallel: options.parallel,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });

      if (!response.isError) {
        sdk.trigger(
          new Event({
            eventName: 'availableShippingMethodsFetched',
            data: {
              shippingMethods: response.data,
            },
          }),
        );
      }
      return response;
    },
    setShippingMethod: async (
      payload: SetCartShippingMethodPayload,
      options: {
        parallel?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<Cart>({
        actionName: 'cart/setShippingMethod',
        payload,
        parallel: options.parallel,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });

      if (!response.isError) {
        sdk.trigger(
          new Event({
            eventName: 'shippingMethodUpdated',
            data: {
              shippingMethod: response.data.availableShippingMethods?.find(
                (shippingMethod) => shippingMethod.shippingMethodId === payload.shippingMethod.id,
              ),
            },
          }),
        );
      }
      return response;
    },
    redeemDiscountCode: async (
      payload: RedeemDiscountCodePayload,
      options: {
        parallel?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<Cart | string>({
        actionName: 'cart/redeemDiscount',
        payload,
        parallel: options.parallel,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });

      if (!response.isError) {
        sdk.trigger(
          new Event({
            eventName: 'discountCodeRedeemed',
            data: {
              discountCode: typeof response.data !== 'string' ? payload.code : response.data,
              cart: typeof response.data !== 'string' ? response.data : undefined,
            },
          }),
        );
      }
      return response;
    },
    removeDiscountCode: async (
      payload: RemoveDiscountCodePayload,
      options: {
        parallel?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<Cart>({
        actionName: 'cart/removeDiscount',
        payload,
        parallel: options.parallel,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });

      if (!response.isError) {
        sdk.trigger(
          new Event({
            eventName: 'discountCodeRemoved',
            data: {
              discountCode: payload.discountId,
              cart: response.data,
            },
          }),
        );
      }
      return response;
    },
    checkout: async (
      payload: CheckoutCartPayload,
      options: {
        parallel?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<Cart>({
        actionName: 'cart/checkout',
        payload,
        parallel: options.parallel,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });

      if (!response.isError) {
        sdk.trigger(
          new Event({
            eventName: 'cartCheckedOut',
            data: {},
          }),
        );
      }
      return response;
    },
    queryOrders: async (
      query?: QueryOrdersQuery,
      options: {
        parallel?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<PaginatedResult<Order>>({
        actionName: 'cart/queryOrders',
        query,
        parallel: options.parallel,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    getOrder: async (
      query: GetOrderQuery,
      options: {
        parallel?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<Order>({
        actionName: 'cart/getOrder',
        query,
        parallel: options.parallel,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    getCheckoutSessionToken: async (
      options: {
        parallel?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<Token>({
        actionName: 'cart/getCheckoutSessionToken',
        parallel: options.parallel,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
  };
};
