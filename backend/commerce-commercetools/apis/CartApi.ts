import { Cart } from '@Types/cart/Cart';
import {
  Cart as CommercetoolsCart,
  Order as CommercetoolsOrder,
  CartAddDiscountCodeAction,
  CartAddLineItemAction,
  CartAddPaymentAction,
  CartChangeLineItemQuantityAction,
  CartDraft,
  CartRemoveDiscountCodeAction,
  CartRemoveLineItemAction,
  CartSetBillingAddressAction,
  CartSetCountryAction,
  CartSetCustomerEmailAction,
  CartSetLocaleAction,
  CartSetShippingAddressAction,
  CartSetShippingMethodAction,
  CartUpdate,
  OrderFromCartDraft,
  OrderState,
  OrderUpdate,
  OrderUpdateAction,
  PaymentDraft,
  PaymentState,
  PaymentUpdateAction,
} from '@commercetools/platform-sdk';
import { LineItem } from '@Types/cart/LineItem';
import { Address } from '@Types/account/Address';
import { Order } from '@Types/cart/Order';
import { ShippingMethod } from '@Types/cart/ShippingMethod';
import { Payment } from '@Types/cart/Payment';
import { Account } from '@Types/account/Account';
import { DiscountCode } from '@Types/cart/Discount';
import { Context, Request } from '@frontastic/extension-types';
import { PaginatedResult } from '@Types/result';
import { OrderQuery } from '@Types/query';
import { Token } from '@Types/Token';
import { Locale } from '../Locale';
import { isReadyForCheckout } from '../utils/Cart';
import { CartNotCompleteError } from '../errors/CartNotCompleteError';
import { CartPaymentNotFoundError } from '../errors/CartPaymentNotFoundError';
import { CartRedeemDiscountCodeError } from '../errors/CartRedeemDiscountCodeError';
import { CartMapper } from '../mappers/CartMapper';
import { ProductApi } from './ProductApi';
import { BaseApi } from './BaseApi';
import { ProductMapper } from '@Commerce-commercetools/mappers/ProductMapper';
import { getOffsetFromCursor } from '@Commerce-commercetools/utils/Pagination';
import { ExternalError } from '@Commerce-commercetools/errors/ExternalError';
import { Guid } from '@Commerce-commercetools/utils/Guid';
import { ResourceNotFoundError } from '@Commerce-commercetools/errors/ResourceNotFoundError';

const CART_EXPANDS = [
  'lineItems[*].discountedPricePerQuantity[*].discountedPrice.includedDiscounts[*].discount',
  'lineItems[*].price.discounted.discount',
  'discountCodes[*].discountCode',
  'discountOnTotalPrice.includedDiscounts[*].discount',
  'paymentInfo.payments[*]',
  'shippingInfo.discountedPrice.includedDiscounts[*].discount',
  'customerGroup',
];
const ORDER_EXPANDS = [...CART_EXPANDS, 'orderState'];

export class CartApi extends BaseApi {
  productApi: ProductApi;

  constructor(
    commercetoolsFrontendContext: Context,
    locale: string | null,
    currency: string | null,
    request?: Request | null,
  ) {
    super(commercetoolsFrontendContext, locale, currency, request);
    this.productApi = new ProductApi(commercetoolsFrontendContext, locale, currency, request);
  }

  async replicateCart(orderId: string): Promise<Cart> {
    const locale = await this.getCommercetoolsLocal();
    const response = await this.requestBuilder()
      .carts()
      .replicate()
      .post({
        body: {
          reference: {
            id: orderId,
            typeId: 'order',
          },
        },
      })
      .execute()
      .catch((error) => {
        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
      });

    return await this.buildCartWithAvailableShippingMethods(response.body, locale);
  }

  async getActiveCartForAccount(account: Account): Promise<Cart | undefined> {
    this.invalidateSessionCheckoutData();

    const locale = await this.getCommercetoolsLocal();

    const response = await this.requestBuilder()
      .carts()
      .get({
        queryArgs: {
          limit: 1,
          expand: CART_EXPANDS,
          where: [`customerId="${account.accountId}"`, `cartState="Active"`],
          sort: 'lastModifiedAt desc',
        },
      })
      .execute()
      .catch((error) => {
        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
      });

    if (response.body.count === 0) {
      return undefined;
    }

    return this.buildCartWithAvailableShippingMethods(response.body.results[0], locale);
  }

  async createForAccount(account: Account): Promise<Cart> {
    this.invalidateSessionCheckoutData();

    const locale = await this.getCommercetoolsLocal();

    const cartDraft: CartDraft = {
      currency: locale.currency,
      country: locale.country,
      locale: locale.language,
      customerId: account.accountId,
      customerEmail: account.email,
      inventoryMode: 'ReserveOnOrder',
    };

    return await this.requestBuilder()
      .carts()
      .post({
        queryArgs: {
          expand: CART_EXPANDS,
        },
        body: cartDraft,
      })
      .execute()
      .then((response) => {
        return this.buildCartWithAvailableShippingMethods(response.body, locale);
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
      });
  }

  async createAnonymous(): Promise<Cart> {
    this.invalidateSessionCheckoutData();

    const locale = await this.getCommercetoolsLocal();

    const cartDraft: CartDraft = {
      currency: locale.currency,
      country: locale.country,
      locale: locale.language,
      anonymousId: Guid.newGuid(),
      inventoryMode: 'ReserveOnOrder',
    };

    return await this.requestBuilder()
      .carts()
      .post({
        queryArgs: {
          expand: CART_EXPANDS,
        },
        body: cartDraft,
      })
      .execute()
      .then((response) => {
        return this.buildCartWithAvailableShippingMethods(response.body, locale);
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
      });
  }

  async getById(cartId: string): Promise<Cart> {
    const locale = await this.getCommercetoolsLocal();

    return await this.requestBuilder()
      .carts()
      .withId({
        ID: cartId,
      })
      .get({
        queryArgs: {
          limit: 1,
          expand: CART_EXPANDS,
        },
      })
      .execute()
      .then((response) => {
        return this.buildCartWithAvailableShippingMethods(response.body, locale);
      })
      .catch((error) => {
        // The 404 error is thrown when the cart can't be found
        if (error.code === 404) {
          throw new ResourceNotFoundError({ message: error.message });
        }

        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
      });
  }

  async addToCart(cart: Cart, lineItem: LineItem): Promise<Cart> {
    const locale = await this.getCommercetoolsLocal();

    const cartUpdate: CartUpdate = {
      version: +cart.cartVersion,
      actions: [
        {
          action: 'addLineItem',
          sku: lineItem.variant.sku,
          quantity: +lineItem.count,
        } as CartAddLineItemAction,
      ],
    };

    const commercetoolsCart = await this.updateCart(cart.cartId, cartUpdate);

    return this.buildCartWithAvailableShippingMethods(commercetoolsCart, locale);
  }

  async updateLineItem(cart: Cart, lineItem: LineItem): Promise<Cart> {
    const locale = await this.getCommercetoolsLocal();

    const cartUpdate: CartUpdate = {
      version: +cart.cartVersion,
      actions: [
        {
          action: 'changeLineItemQuantity',
          lineItemId: lineItem.lineItemId,
          quantity: +lineItem.count,
        } as CartChangeLineItemQuantityAction,
      ],
    };

    const commercetoolsCart = await this.updateCart(cart.cartId, cartUpdate);

    return this.buildCartWithAvailableShippingMethods(commercetoolsCart, locale);
  }

  async removeLineItem(cart: Cart, lineItem: LineItem): Promise<Cart> {
    const locale = await this.getCommercetoolsLocal();

    const cartUpdate: CartUpdate = {
      version: +cart.cartVersion,
      actions: [
        {
          action: 'removeLineItem',
          lineItemId: lineItem.lineItemId,
        } as CartRemoveLineItemAction,
      ],
    };

    const commercetoolsCart = await this.updateCart(cart.cartId, cartUpdate);

    return this.buildCartWithAvailableShippingMethods(commercetoolsCart, locale);
  }

  async setEmail(cart: Cart, email: string): Promise<Cart> {
    const locale = await this.getCommercetoolsLocal();

    const cartUpdate: CartUpdate = {
      version: +cart.cartVersion,
      actions: [
        {
          action: 'setCustomerEmail',
          email: email,
        } as CartSetCustomerEmailAction,
      ],
    };

    const commercetoolsCart = await this.updateCart(cart.cartId, cartUpdate);

    return this.buildCartWithAvailableShippingMethods(commercetoolsCart, locale);
  }

  async setShippingAddress(cart: Cart, address: Address): Promise<Cart> {
    const locale = await this.getCommercetoolsLocal();

    const cartUpdate: CartUpdate = {
      version: +cart.cartVersion,
      actions: [
        {
          action: 'setShippingAddress',
          address: CartMapper.addressToCommercetoolsAddress(address),
        } as CartSetShippingAddressAction,
      ],
    };

    const commercetoolsCart = await this.updateCart(cart.cartId, cartUpdate);

    return this.buildCartWithAvailableShippingMethods(commercetoolsCart, locale);
  }

  async setBillingAddress(cart: Cart, address: Address): Promise<Cart> {
    const locale = await this.getCommercetoolsLocal();

    const cartUpdate: CartUpdate = {
      version: +cart.cartVersion,
      actions: [
        {
          action: 'setBillingAddress',
          address: CartMapper.addressToCommercetoolsAddress(address),
        } as CartSetBillingAddressAction,
      ],
    };

    const commercetoolsCart = await this.updateCart(cart.cartId, cartUpdate);

    return this.buildCartWithAvailableShippingMethods(commercetoolsCart, locale);
  }

  async setShippingMethod(cart: Cart, shippingMethod: ShippingMethod): Promise<Cart> {
    const locale = await this.getCommercetoolsLocal();

    const cartUpdate: CartUpdate = {
      version: +cart.cartVersion,
      actions: [
        {
          action: 'setShippingMethod',
          shippingMethod: {
            typeId: 'shipping-method',
            id: shippingMethod.shippingMethodId,
          },
        } as CartSetShippingMethodAction,
      ],
    };

    const commercetoolsCart = await this.updateCart(cart.cartId, cartUpdate);

    return this.buildCartWithAvailableShippingMethods(commercetoolsCart, locale);
  }

  async order(cart: Cart, purchaseOrderNumber?: string): Promise<Order> {
    const locale = await this.getCommercetoolsLocal();
    const date = new Date();

    const orderFromCartDraft: OrderFromCartDraft = {
      cart: {
        typeId: 'cart',
        id: cart.cartId,
      },
      version: +cart.cartVersion,
      orderNumber: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${String(Date.now()).slice(-6, -1)}`,
      purchaseOrderNumber: purchaseOrderNumber !== undefined ? purchaseOrderNumber : undefined,
    };

    if (!isReadyForCheckout(cart)) {
      throw new CartNotCompleteError({ message: 'Cart not complete yet.' });
    }

    return await this.requestBuilder()
      .orders()
      .post({
        queryArgs: {
          expand: CART_EXPANDS,
        },
        body: orderFromCartDraft,
      })
      .execute()
      .then((response) => {
        return CartMapper.commercetoolsOrderToOrder(response.body, locale, this.defaultLocale);
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
      });
  }

  async getShippingMethods(onlyMatching: boolean): Promise<ShippingMethod[]> {
    const locale = await this.getCommercetoolsLocal();

    const methodArgs = {
      queryArgs: {
        expand: ['zoneRates[*].zone'],
        country: undefined as string | any,
      },
    };

    let requestBuilder = this.requestBuilder().shippingMethods().get(methodArgs);

    if (onlyMatching) {
      methodArgs.queryArgs.country = locale.country;
      requestBuilder = this.requestBuilder().shippingMethods().matchingLocation().get(methodArgs);
    }

    return await requestBuilder
      .execute()
      .then((response) => {
        return response.body.results.map((shippingMethod) =>
          CartMapper.commercetoolsShippingMethodToShippingMethod(shippingMethod, locale, this.defaultLocale),
        );
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
      });
  }

  async getAvailableShippingMethods(cart: Cart): Promise<ShippingMethod[]> {
    const locale = await this.getCommercetoolsLocal();

    return await this.requestBuilder()
      .shippingMethods()
      .matchingCart()
      .get({
        queryArgs: {
          expand: ['zoneRates[*].zone'],
          cartId: cart.cartId,
        },
      })
      .execute()
      .then((response) => {
        return response.body.results.map((shippingMethod) =>
          CartMapper.commercetoolsShippingMethodToShippingMethod(shippingMethod, locale, this.defaultLocale),
        );
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
      });
  }

  async addPayment(cart: Cart, payment: Payment): Promise<Cart> {
    const locale = await this.getCommercetoolsLocal();

    // TODO: create and use custom a payment field to include details for the payment integration

    const paymentDraft: PaymentDraft = {
      key: payment.id,
      amountPlanned: {
        centAmount: payment.amountPlanned.centAmount,
        currencyCode: payment.amountPlanned.currencyCode,
      },
      interfaceId: payment.paymentId,
      paymentMethodInfo: {
        paymentInterface: payment.paymentProvider,
        method: payment.paymentMethod,
      },
      paymentStatus: {
        interfaceCode: payment.paymentStatus,
        interfaceText: payment.debug,
      },
    };

    const paymentResponse = await this.requestBuilder()
      .payments()
      .post({
        body: paymentDraft,
      })
      .execute();

    const cartUpdate: CartUpdate = {
      version: +cart.cartVersion,
      actions: [
        {
          action: 'addPayment',
          payment: {
            typeId: 'payment',
            id: paymentResponse.body.id,
          },
        } as CartAddPaymentAction,
      ],
    };

    const commercetoolsCart = await this.updateCart(cart.cartId, cartUpdate);

    return this.buildCartWithAvailableShippingMethods(commercetoolsCart, locale);
  }

  async updatePayment(cart: Cart, payment: Payment): Promise<Payment> {
    const locale = await this.getCommercetoolsLocal();
    const originalPayment = cart.payments.find((cartPayment) => cartPayment.id === payment.id);

    if (originalPayment === undefined) {
      throw new CartPaymentNotFoundError({ message: `Payment ${payment.id} not found in cart ${cart.cartId}` });
    }

    const paymentUpdateActions: PaymentUpdateAction[] = [];

    if (payment.paymentStatus) {
      paymentUpdateActions.push({
        action: 'setStatusInterfaceCode',
        interfaceCode: payment.paymentStatus,
      });
    }

    if (payment.debug) {
      paymentUpdateActions.push({
        action: 'setStatusInterfaceText',
        interfaceText: payment.debug,
      });
    }

    if (payment.paymentId) {
      paymentUpdateActions.push({
        action: 'setInterfaceId',
        interfaceId: payment.paymentId,
      });
    }

    if (paymentUpdateActions.length === 0) {
      // There is nothing to be updated
      return payment;
    }

    return await this.requestBuilder()
      .payments()
      .withKey({
        key: originalPayment.id,
      })
      .post({
        body: {
          version: originalPayment.version,
          actions: paymentUpdateActions,
        },
      })
      .execute()
      .then((response) => {
        return CartMapper.commercetoolsPaymentToPayment(response.body, locale);
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
      });
  }

  async getPayment(paymentId: string): Promise<any> {
    return await this.requestBuilder()
      .payments()
      .withId({
        ID: paymentId,
      })
      .get()
      .execute();
  }

  async updateOrderByNumber(
    orderNumber: string,
    payload: Pick<Order, 'orderState' | 'payments'> & { paymentState?: PaymentState },
  ): Promise<Order> {
    const locale = await this.getCommercetoolsLocal();

    const order = await this.requestBuilder()
      .orders()
      .withOrderNumber({ orderNumber })
      .get()
      .execute()
      .then((res) => res.body);

    const orderUpdateActions = [] as OrderUpdateAction[];

    if (payload.orderState) {
      orderUpdateActions.push({
        action: 'changeOrderState',
        orderState: payload.orderState as OrderState,
      });
    }

    if (payload.payments) {
      payload.payments.forEach((payment) => {
        orderUpdateActions.push({
          action: 'addPayment',
          payment: {
            typeId: 'payment',
            id: payment.id,
          },
        });
      });
    }

    if (payload.paymentState) {
      orderUpdateActions.push({
        action: 'changePaymentState',
        paymentState: payload.paymentState,
      });
    }

    return this.requestBuilder()
      .orders()
      .withOrderNumber({ orderNumber })
      .post({ body: { version: order.version, actions: orderUpdateActions } })
      .execute()
      .then((response) => CartMapper.commercetoolsOrderToOrder(response.body, locale, this.defaultLocale))
      .catch((error) => {
        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
      });
  }

  async createPayment(payload: PaymentDraft): Promise<Payment> {
    const locale = await this.getCommercetoolsLocal();

    const payment = this.requestBuilder()
      .payments()
      .post({ body: payload })
      .execute()
      .then((response) => CartMapper.commercetoolsPaymentToPayment(response.body, locale));

    return payment;
  }

  async updateOrderPayment(paymentId: string, paymentDraft: Payment): Promise<any> {
    const locale = await this.getCommercetoolsLocal();

    const paymentUpdateActions: PaymentUpdateAction[] = [];

    if (paymentDraft.paymentMethod) {
      paymentUpdateActions.push({
        action: 'setMethodInfoMethod',
        method: paymentDraft.paymentMethod,
      });
    }

    if (paymentDraft.amountPlanned) {
      paymentUpdateActions.push({
        action: 'changeAmountPlanned',
        amount: {
          centAmount: paymentDraft.amountPlanned.centAmount,
          currencyCode: paymentDraft.amountPlanned.currencyCode,
        },
      });
    }

    if (paymentDraft.paymentStatus) {
      paymentUpdateActions.push({
        action: 'setStatusInterfaceCode',
        interfaceCode: paymentDraft.paymentStatus,
      });
    }

    return await this.requestBuilder()
      .payments()
      .withId({
        ID: paymentId,
      })
      .post({
        body: {
          version: paymentDraft.version,
          actions: paymentUpdateActions,
        },
      })
      .execute()
      .then((response) => {
        return CartMapper.commercetoolsPaymentToPayment(response.body, locale);
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
      });
  }

  async redeemDiscountCode(cart: Cart, code: string): Promise<Cart> {
    const locale = await this.getCommercetoolsLocal();

    const cartUpdate: CartUpdate = {
      version: +cart.cartVersion,
      actions: [
        {
          action: 'addDiscountCode',
          code: code,
        } as CartAddDiscountCodeAction,
      ],
    };

    const commercetoolsCart = await this.updateCart(cart.cartId, cartUpdate)
      .then((commercetoolsCart) => {
        const commercetoolsDiscountCode = commercetoolsCart.discountCodes.find(
          (discountCode) => discountCode.discountCode?.obj.code === code,
        );

        if (commercetoolsDiscountCode.state !== 'MatchesCart') {
          // Remove the discount code if status is different than MatchesCart
          const cartUpdate: CartUpdate = {
            version: +commercetoolsCart.version,
            actions: [
              {
                action: 'removeDiscountCode',
                discountCode: {
                  typeId: 'discount-code',
                  id: commercetoolsDiscountCode.discountCode.id,
                },
              } as CartRemoveDiscountCodeAction,
            ],
          };

          this.updateCart(commercetoolsCart.id, cartUpdate);

          throw new CartRedeemDiscountCodeError({
            message: `Redeem discount code '${code}' failed with state '${commercetoolsDiscountCode.state}'`,
            statusCode: 409,
          });
        }

        return commercetoolsCart;
      })
      .catch((error) => {
        if (error instanceof ExternalError) {
          throw new CartRedeemDiscountCodeError({
            message: `Redeem discount code '${code}' failed. ${error.message}`,
            statusCode: error.statusCode,
          });
        }

        throw error;
      });

    return this.buildCartWithAvailableShippingMethods(commercetoolsCart, locale);
  }

  async removeDiscountCode(cart: Cart, discount: DiscountCode): Promise<Cart> {
    const locale = await this.getCommercetoolsLocal();

    const cartUpdate: CartUpdate = {
      version: +cart.cartVersion,
      actions: [
        {
          action: 'removeDiscountCode',
          discountCode: {
            typeId: 'discount-code',
            id: discount.discountCodeId,
          },
        } as CartRemoveDiscountCodeAction,
      ],
    };

    const commercetoolsCart = await this.updateCart(cart.cartId, cartUpdate);

    return this.buildCartWithAvailableShippingMethods(commercetoolsCart, locale);
  }

  async queryOrders(orderQuery: OrderQuery): Promise<PaginatedResult<Order>> {
    const locale = await this.getCommercetoolsLocal();
    const limit = +orderQuery.limit || undefined;
    const sortAttributes: string[] = [];

    if (orderQuery.sortAttributes !== undefined) {
      Object.keys(orderQuery.sortAttributes).map((field, directionIndex) => {
        sortAttributes.push(`${field} ${Object.values(orderQuery.sortAttributes)[directionIndex]}`);
      });
    } else {
      // default sort
      sortAttributes.push(`lastModifiedAt desc`);
    }

    const whereClause = [];

    if (orderQuery.accountId !== undefined) {
      whereClause.push(`customerId="${orderQuery.accountId}"`);
    }

    if (orderQuery.orderIds !== undefined && orderQuery.orderIds.length !== 0) {
      whereClause.push(`id in ("${orderQuery.orderIds.join('","')}")`);
    }

    if (orderQuery.orderNumbers !== undefined && orderQuery.orderNumbers.length !== 0) {
      whereClause.push(`orderNumber in ("${orderQuery.orderNumbers.join('","')}")`);
    }

    if (orderQuery.orderState !== undefined && orderQuery.orderState.length > 0) {
      whereClause.push(`orderState in ("${orderQuery.orderState.join('","')}")`);
    }

    if (orderQuery.businessUnitKey !== undefined) {
      whereClause.push(`businessUnit(key="${orderQuery.businessUnitKey}")`);
    }

    const searchQuery = orderQuery.query && orderQuery.query;

    return await this.requestBuilder()
      .orders()
      .get({
        queryArgs: {
          where: whereClause,
          expand: ORDER_EXPANDS,
          limit: limit,
          offset: getOffsetFromCursor(orderQuery.cursor),
          sort: sortAttributes,
          [`text.${locale.language}`]: searchQuery,
        },
      })
      .execute()
      .then((response) => {
        const orders = response.body.results.map((commercetoolsQuote) => {
          return CartMapper.commercetoolsOrderToOrder(commercetoolsQuote, locale, this.defaultLocale);
        });

        return {
          total: response.body.total,
          items: orders,
          count: response.body.count,
          previousCursor: ProductMapper.calculatePreviousCursor(response.body.offset, response.body.count),
          nextCursor: ProductMapper.calculateNextCursor(response.body.offset, response.body.count, response.body.total),
          query: orderQuery,
        };
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
      });
  }

  async getCheckoutSessionToken(cartId: string): Promise<Token> {
    return await this.generateCheckoutSessionToken(cartId);
  }

  assertCartIsActive: (cart: Cart) => boolean = (cart: Cart) => {
    return cart.cartState === 'Active';
  };

  protected async setOrderNumber(order: Order): Promise<Order> {
    const locale = await this.getCommercetoolsLocal();

    // By default, the order number is generated using the order creation date
    const date = new Date(order.createdAt);
    const orderNumber = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${String(Date.now()).slice(-6, -1)}`;

    const orderUpdate: OrderUpdate = {
      version: +order.orderVersion,
      actions: [
        {
          action: 'setOrderNumber',
          orderNumber,
        },
      ],
    };

    const commercetoolsOrder = await this.updateOrder(order.orderId, orderUpdate);

    return CartMapper.commercetoolsOrderToOrder(commercetoolsOrder, locale, this.defaultLocale);
  }

  protected async updateCart(cartId: string, cartUpdate: CartUpdate): Promise<CommercetoolsCart> {
    return await this.requestBuilder()
      .carts()
      .withId({
        ID: cartId,
      })
      .post({
        queryArgs: {
          expand: CART_EXPANDS,
        },
        body: cartUpdate,
      })
      .execute()
      .then((response) => {
        return response.body;
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
      });
  }

  protected async updateOrder(orderId: string, orderUpdate: OrderUpdate): Promise<CommercetoolsOrder> {
    return await this.requestBuilder()
      .orders()
      .withId({
        ID: orderId,
      })
      .post({
        queryArgs: {
          expand: ORDER_EXPANDS,
        },
        body: orderUpdate,
      })
      .execute()
      .then((response) => {
        return response.body;
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
      });
  }

  protected buildCartWithAvailableShippingMethods: (
    commercetoolsCart: CommercetoolsCart,
    locale: Locale,
  ) => Promise<Cart> = async (commercetoolsCart: CommercetoolsCart, locale: Locale) => {
    const cart = await this.assertCorrectLocale(commercetoolsCart, locale);

    // It would not be possible to get available shipping method
    // if the shipping address has not been set.
    if (cart.shippingAddress !== undefined && cart.shippingAddress.country !== undefined) {
      cart.availableShippingMethods = await this.getAvailableShippingMethods(cart);
    }

    return cart;
  };

  protected assertCorrectLocale: (commercetoolsCart: CommercetoolsCart, locale: Locale) => Promise<Cart> = async (
    commercetoolsCart: CommercetoolsCart,
    locale: Locale,
  ) => {
    if (commercetoolsCart.totalPrice.currencyCode !== locale.currency.toLocaleUpperCase()) {
      return this.recreate(commercetoolsCart, locale);
    }

    if (this.doesCartNeedLocaleUpdate(commercetoolsCart, locale)) {
      const cartUpdate: CartUpdate = {
        version: commercetoolsCart.version,
        actions: [
          {
            action: 'setCountry',
            country: locale.country,
          } as CartSetCountryAction,
          {
            action: 'setLocale',
            country: locale.language,
          } as CartSetLocaleAction,
        ],
      };

      commercetoolsCart = await this.updateCart(commercetoolsCart.id, cartUpdate);
    }

    return CartMapper.commercetoolsCartToCart(commercetoolsCart, locale, this.defaultLocale);
  };

  protected async recreate(primaryCommercetoolsCart: CommercetoolsCart, locale: Locale): Promise<Cart> {
    const primaryCartId = primaryCommercetoolsCart.id;
    const cartVersion = primaryCommercetoolsCart.version;
    const lineItems = primaryCommercetoolsCart.lineItems;

    const cartDraft: CartDraft = {
      currency: locale.currency,
      country: locale.country,
      locale: locale.language,
    };

    const propertyList = [
      'customerEmail',
      'store',
      'inventoryMode',
      'taxMode',
      'taxRoundingMode',
      'taxCalculationMode',
      'deleteDaysAfterLastModification',
      'origin',
    ];

    // Commercetools cart only accepts customerId or anonymousId
    primaryCommercetoolsCart.customerId !== undefined
      ? propertyList.push('customerId')
      : propertyList.push('anonymousId');

    for (const key of propertyList) {
      if (primaryCommercetoolsCart.hasOwnProperty(key)) {
        cartDraft[key] = primaryCommercetoolsCart[key];
      }
    }

    let replicatedCommercetoolsCart = await this.requestBuilder()
      .carts()
      .post({
        queryArgs: {
          expand: CART_EXPANDS,
        },
        body: cartDraft,
      })
      .execute()
      .then((response) => {
        return response.body;
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
      });

    // Add line items to the replicated cart one by one to handle the exception
    // if an item is not available on the new currency.
    for (const lineItem of lineItems) {
      if (lineItem.lineItemMode === 'GiftLineItem') {
        // If the line item is a gift, we don't need to add it to the cart
        continue;
      }
      try {
        const cartUpdate: CartUpdate = {
          version: +replicatedCommercetoolsCart.version,
          actions: [
            {
              action: 'addLineItem',
              sku: lineItem.variant.sku,
              quantity: +lineItem.quantity,
            },
          ],
        };

        replicatedCommercetoolsCart = await this.updateCart(replicatedCommercetoolsCart.id, cartUpdate);
      } catch (error) {
        // Ignore that a line item could not be added due to missing price, etc
      }
    }

    // Delete previous cart
    await this.requestBuilder()
      .carts()
      .withId({
        ID: primaryCartId,
      })
      .delete({
        queryArgs: {
          version: cartVersion,
        },
      })
      .execute()
      .catch((error) => {
        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
      });

    return CartMapper.commercetoolsCartToCart(replicatedCommercetoolsCart, locale, this.defaultLocale);
  }

  protected doesCartNeedLocaleUpdate(commercetoolsCart: CommercetoolsCart, locale: Locale): boolean {
    if (commercetoolsCart.country === undefined) {
      return true;
    }

    if (commercetoolsCart.locale === undefined) {
      return true;
    }

    return commercetoolsCart.country !== locale.country || commercetoolsCart.locale !== locale.language;
  }
}
