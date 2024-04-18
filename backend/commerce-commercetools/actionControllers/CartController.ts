import { ActionContext, Request, Response } from '@frontastic/extension-types';
import { Cart } from '@Types/cart/Cart';
import { LineItem } from '@Types/cart/LineItem';
import { Address } from '@Types/account/Address';
import { ShippingMethod } from '@Types/cart/ShippingMethod';
import { Payment, PaymentStatuses } from '@Types/cart/Payment';
import { Discount } from '@Types/cart/Discount';
import { SortAttributes, SortOrder } from '@Types/query/ProductQuery';
import { OrderQuery } from '@Types/query';
import { CartFetcher } from '../utils/CartFetcher';
import { CartApi } from '../apis/CartApi';
import { getCurrency, getLocale } from '../utils/Request';
import { EmailApiFactory } from '../utils/EmailApiFactory';
import { AccountAuthenticationError } from '../errors/AccountAuthenticationError';
import queryParamsToStates from '@Commerce-commercetools/utils/queryParamsToState';
import queryParamsToIds from '@Commerce-commercetools/utils/queryParamsToIds';
import handleError from '@Commerce-commercetools/utils/handleError';
import { fetchAccountFromSession } from '@Commerce-commercetools/utils/fetchAccountFromSession';
import { CartNotMatchOrderError } from '@Commerce-commercetools/errors/CartNotMatchOrderError';
import { ValidationError } from '@Commerce-commercetools/errors/ValidationError';

type ActionHook = (request: Request, actionContext: ActionContext) => Promise<Response>;

function getCartApi(request: Request, actionContext: ActionContext) {
  return new CartApi(actionContext.frontasticContext, getLocale(request), getCurrency(request), request);
}

function queryParamsToSortAttributes(queryParams: any) {
  const sortAttributes: SortAttributes = {};

  if (queryParams.sortAttributes) {
    let sortAttribute;

    for (sortAttribute of Object.values(queryParams.sortAttributes)) {
      const key = Object.keys(sortAttribute)[0];
      sortAttributes[key] = sortAttribute[key] ? sortAttribute[key] : SortOrder.ASCENDING;
    }
  }

  return sortAttributes;
}

async function updateCartFromRequest(cartApi: CartApi, request: Request): Promise<Cart> {
  let cart = await CartFetcher.fetchCart(cartApi, request);

  if (request?.body === undefined || request?.body === '') {
    return cart;
  }

  const body: {
    account?: { email?: string };
    shipping?: Address;
    billing?: Address;
  } = JSON.parse(request.body);

  if (body?.account?.email !== undefined) {
    cart = await cartApi.setEmail(cart, body.account.email);
  }

  if (body?.shipping !== undefined || body?.billing !== undefined) {
    const shippingAddress = body?.shipping !== undefined ? body.shipping : body.billing;
    const billingAddress = body?.billing !== undefined ? body.billing : body.shipping;

    cart = await cartApi.setShippingAddress(cart, shippingAddress);
    cart = await cartApi.setBillingAddress(cart, billingAddress);
  }

  return cart;
}

export const getCart: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const cartApi = getCartApi(request, actionContext);

    try {
      const cart = await CartFetcher.fetchCartFromSession(cartApi, request);

      return {
        statusCode: 200,
        body: cart ? JSON.stringify(cart) : '',
        sessionData: {
          ...cartApi.getSessionData(),
          ...(cart ? { cartId: cart.cartId } : {}),
        },
      };
    } catch (error) {
      const errorResponse = error as Error;
      return {
        statusCode: 400,
        message: errorResponse.message,
      };
    }
  } catch (error) {
    return handleError(error, request);
  }
};

export const resetCart: ActionHook = async (request: Request, actionContext: ActionContext) => {
  const cartApi = getCartApi(request, actionContext);
  cartApi.invalidateSessionCheckoutData();

  const response: Response = {
    statusCode: 200,
    body: null,
    sessionData: {
      ...request.sessionData,
      cartId: null,
    },
  };

  return response;
};

export const addToCart: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const cartApi = getCartApi(request, actionContext);

    const body: {
      variant?: { sku?: string; count: number };
    } = JSON.parse(request.body);

    const lineItem: LineItem = {
      variant: {
        sku: body.variant?.sku || undefined,
        price: undefined,
      },
      count: +body.variant?.count || 1,
    };

    let cart = await CartFetcher.fetchCart(cartApi, request);
    cart = await cartApi.addToCart(cart, lineItem);

    const cartId = cart.cartId;

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify(cart),
      sessionData: {
        ...cartApi.getSessionData(),
        cartId,
      },
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const replicateCart: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const cartApi = getCartApi(request, actionContext);
    const orderId = request.query?.['orderId'];

    if (!orderId) {
      throw new ValidationError({ message: `orderId is required` });
    }

    const cart = await cartApi.replicateCart(orderId);

    return {
      statusCode: 200,
      body: JSON.stringify(cart),
      sessionData: {
        ...cartApi.getSessionData(),
        cartId: cart.cartId,
      },
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const updateLineItem: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const cartApi = getCartApi(request, actionContext);

    const body: {
      lineItem?: { id?: string; count: number };
    } = JSON.parse(request.body);

    const lineItem: LineItem = {
      lineItemId: body.lineItem?.id,
      count: +body.lineItem?.count || 1,
    };

    let cart = await CartFetcher.fetchCart(cartApi, request);
    cart = await cartApi.updateLineItem(cart, lineItem);

    const cartId = cart.cartId;

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify(cart),
      sessionData: {
        ...cartApi.getSessionData(),
        cartId,
      },
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const removeLineItem: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const cartApi = getCartApi(request, actionContext);

    const body: {
      lineItem?: { id?: string };
    } = JSON.parse(request.body);

    const lineItem: LineItem = {
      lineItemId: body.lineItem?.id,
    };

    let cart = await CartFetcher.fetchCart(cartApi, request);
    cart = await cartApi.removeLineItem(cart, lineItem);

    const cartId = cart.cartId;

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify(cart),
      sessionData: {
        ...cartApi.getSessionData(),
        cartId,
      },
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const updateCart: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const cartApi = getCartApi(request, actionContext);

    const cart = await updateCartFromRequest(cartApi, request);
    const cartId = cart.cartId;

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify(cart),
      sessionData: {
        ...cartApi.getSessionData(),
        cartId,
      },
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const checkout: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const locale = getLocale(request);
    const body: {
      purchaseOrderNumber?: string;
    } = JSON.parse(request.body);

    const cartApi = getCartApi(request, actionContext);
    const emailApi = EmailApiFactory.getDefaultApi(actionContext.frontasticContext, locale);

    const cart = await updateCartFromRequest(cartApi, request);

    const order = await cartApi.order(cart, body?.purchaseOrderNumber);

    emailApi.sendOrderConfirmationEmail({ ...order, email: order.email || cart.email });

    // Unset the cartId
    const cartId: string = undefined;

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify(order),
      sessionData: {
        ...cartApi.getSessionData(),
        cartId,
      },
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};

/**
 * @deprecated Use queryOrders instead
 */
export const getOrders: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const cartApi = getCartApi(request, actionContext);

    const account = request.sessionData?.account !== undefined ? request.sessionData.account : undefined;

    if (account === undefined) {
      throw new AccountAuthenticationError({ message: 'Not logged in.' });
    }

    const orders = await cartApi.getOrders(account);

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify(orders),
      sessionData: {
        ...cartApi.getSessionData(),
      },
    };
    return response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const getShippingMethods: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const cartApi = getCartApi(request, actionContext);
    const onlyMatching = request.query.onlyMatching === 'true';

    const shippingMethods = await cartApi.getShippingMethods(onlyMatching);

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify(shippingMethods),
      sessionData: {
        ...cartApi.getSessionData(),
      },
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const getAvailableShippingMethods: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const cartApi = getCartApi(request, actionContext);
    const cart = await CartFetcher.fetchCart(cartApi, request);

    const availableShippingMethods = await cartApi.getAvailableShippingMethods(cart);

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify(availableShippingMethods),
      sessionData: {
        ...cartApi.getSessionData(),
        cartId: cart.cartId,
      },
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const setShippingMethod: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const cartApi = getCartApi(request, actionContext);

    let cart = await CartFetcher.fetchCart(cartApi, request);

    const body: {
      shippingMethod?: { id?: string };
    } = JSON.parse(request.body);

    const shippingMethod: ShippingMethod = {
      shippingMethodId: body.shippingMethod?.id,
    };

    cart = await cartApi.setShippingMethod(cart, shippingMethod);

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify(cart),
      sessionData: {
        ...cartApi.getSessionData(),
        cartId: cart.cartId,
      },
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const addPaymentByInvoice: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const cartApi = getCartApi(request, actionContext);

    let cart = await CartFetcher.fetchCart(cartApi, request);

    const body: {
      payment?: Payment;
    } = JSON.parse(request.body);

    const payment: Payment = {
      ...body.payment,
      paymentProvider: 'frontastic',
      paymentMethod: 'invoice',
      paymentStatus: PaymentStatuses.PENDING,
    };

    if (payment.amountPlanned === undefined) {
      payment.amountPlanned = {};
    }

    payment.amountPlanned.centAmount = payment.amountPlanned.centAmount ?? cart.sum.centAmount ?? undefined;
    payment.amountPlanned.currencyCode = payment.amountPlanned.currencyCode ?? cart.sum.currencyCode ?? undefined;

    cart = await cartApi.addPayment(cart, payment);

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify(cart),
      sessionData: {
        ...cartApi.getSessionData(),
        cartId: cart.cartId,
      },
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const updatePayment: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const cartApi = getCartApi(request, actionContext);
    const cart = await CartFetcher.fetchCart(cartApi, request);

    const body: {
      payment?: Payment;
    } = JSON.parse(request.body);

    const payment = await cartApi.updatePayment(cart, body.payment);

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify(payment),
      sessionData: {
        ...cartApi.getSessionData(),
        cartId: cart.cartId,
      },
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const redeemDiscount: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const cartApi = getCartApi(request, actionContext);
    let cart = await CartFetcher.fetchCart(cartApi, request);

    const body: {
      code?: string;
    } = JSON.parse(request.body);

    cart = await cartApi.redeemDiscountCode(cart, body.code);

    return {
      statusCode: 200,
      body: JSON.stringify(cart),
      sessionData: {
        ...cartApi.getSessionData(),
        cartId: cart.cartId,
      },
    };
  } catch (error) {
    return handleError(error, request);
  }
};

export const removeDiscount: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const cartApi = getCartApi(request, actionContext);
    let cart = await CartFetcher.fetchCart(cartApi, request);

    const body: {
      discountId?: string;
    } = JSON.parse(request.body);

    const discount: Discount = {
      discountId: body?.discountId,
    };

    cart = await cartApi.removeDiscountCode(cart, discount);

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify(cart),
      sessionData: {
        ...cartApi.getSessionData(),
        cartId: cart.cartId,
      },
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const queryOrders: ActionHook = async (request, actionContext) => {
  try {
    const cartApi = getCartApi(request, actionContext);

    const account = fetchAccountFromSession(request);
    if (account === undefined) {
      throw new AccountAuthenticationError({ message: 'Not logged in.' });
    }

    const orderQuery: OrderQuery = {
      accountId: account.accountId,
      limit: request.query?.limit ?? undefined,
      cursor: request.query?.cursor ?? undefined,
      orderNumbers: queryParamsToIds('orderNumbers', request.query),
      orderIds: queryParamsToIds('orderIds', request.query),
      orderState: queryParamsToStates('orderStates', request.query),
      sortAttributes: queryParamsToSortAttributes(request.query),
      query: request.query?.query ?? undefined,
    };

    const queryResult = await cartApi.queryOrders(orderQuery);

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify(queryResult),
      sessionData: {
        ...cartApi.getSessionData(),
      },
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const getOrder: ActionHook = async (request, actionContext) => {
  try {
    const cartApi = getCartApi(request, actionContext);

    const account = fetchAccountFromSession(request);
    const orderQuery: OrderQuery = {
      accountId: account?.accountId,
      orderIds: [request.query?.orderId],
      limit: 1,
    };

    const queryResult = await cartApi.queryOrders(orderQuery);

    // We'll consider the first order as the checkout order
    const order = queryResult.items[0];

    if (account === undefined) {
      // If account is not logged in, we need to validate if the order belongs to the current session cart
      if (order?.cartId !== request.sessionData?.cartId) {
        throw new CartNotMatchOrderError({ message: 'Order does not match the current cart.' });
      }
    }

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify(order),
      sessionData: {
        ...cartApi.getSessionData(),
      },
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};

export const getCheckoutSessionToken: ActionHook = async (request: Request, actionContext: ActionContext) => {
  try {
    const cartApi = getCartApi(request, actionContext);
    const cart = await CartFetcher.fetchCart(cartApi, request);

    const checkoutSessionToken = await cartApi.getCheckoutSessionToken(cart.cartId);

    const response: Response = {
      statusCode: 200,
      body: checkoutSessionToken ? JSON.stringify(checkoutSessionToken) : '',
      sessionData: {
        ...cartApi.getSessionData(),
      },
    };

    return response;
  } catch (error) {
    return handleError(error, request);
  }
};
