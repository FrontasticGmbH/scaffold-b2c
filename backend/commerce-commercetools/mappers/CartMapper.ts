import { Cart, CartOrigin, CartState } from '@Types/cart/Cart';
import {
  BaseAddress as CommercetoolsAddress,
  Cart as CommercetoolsCart,
  CartDiscountReference,
  CartOrigin as CommercetoolsCartOrigin,
  CartState as CommercetoolsCartState,
  DiscountCodeInfo as CommercetoolsDiscountCodeInfo,
  DiscountedLineItemPortion as CommercetoolsDiscountedLineItemPortion,
  DiscountedLineItemPriceForQuantity as CommercetoolsDiscountedLineItemPriceForQuantity,
  LineItem as CommercetoolsLineItem,
  LineItemReturnItem,
  Order as CommercetoolsOrder,
  OrderState as CommercetoolsOrderState,
  Payment as CommercetoolsPayment,
  PaymentInfo as CommercetoolsPaymentInfo,
  Reference,
  ReturnInfo as CommercetoolsReturnInfo,
  ReturnItemDraft,
  ShipmentState as CommercetoolsShipmentState,
  ShippingInfo as CommercetoolsShippingInfo,
  ShippingMethod as CommercetoolsShippingMethod,
  TaxedPrice as CommercetoolsTaxedPrice,
  TaxRate as CommercetoolsTaxRate,
  TaxedItemPrice as CommercetoolsTaxedItemPrice,
  ZoneRate as CommercetoolsZoneRate,
} from '@commercetools/platform-sdk';
import { LineItem } from '@Types/cart/LineItem';
import { Address } from '@Types/account/Address';
import { Order, OrderState, ReturnInfo, ReturnLineItem, ShipmentState } from '@Types/cart/Order';
import { ShippingMethod } from '@Types/cart/ShippingMethod';
import { ShippingRate } from '@Types/cart/ShippingRate';
import { ShippingLocation } from '@Types/cart/ShippingLocation';
import { ShippingInfo } from '@Types/cart/ShippingInfo';
import { Payment } from '@Types/cart/Payment';
import { Tax } from '@Types/cart/Tax';
import { TaxPortion } from '@Types/cart/TaxPortion';
import { Discount, DiscountedPricePerCount } from '@Types/cart/Discount';
import { TaxRate } from '@Types/cart';
import { ProductRouter } from '../utils/routers/ProductRouter';
import { Locale } from '../Locale';
import LocalizedValue from '../utils/LocalizedValue';
import { ProductMapper } from './ProductMapper';

export class CartMapper {
  static commercetoolsCartToCart: (
    commercetoolsCart: CommercetoolsCart,
    locale: Locale,
    defaultLocale: string,
  ) => Cart = (commercetoolsCart: CommercetoolsCart, locale: Locale, defaultLocale: string) => {
    return {
      cartId: commercetoolsCart.id,
      accountId: commercetoolsCart.customerId,
      cartVersion: commercetoolsCart.version.toString(),
      lineItems: CartMapper.commercetoolsLineItemsToLineItems(commercetoolsCart.lineItems, locale, defaultLocale),
      email: commercetoolsCart?.customerEmail,
      sum: ProductMapper.commercetoolsMoneyToMoney(commercetoolsCart.totalPrice),
      shippingAddress: CartMapper.commercetoolsAddressToAddress(commercetoolsCart.shippingAddress),
      billingAddress: CartMapper.commercetoolsAddressToAddress(commercetoolsCart.billingAddress),
      shippingInfo: CartMapper.commercetoolsShippingInfoToShippingInfo(
        commercetoolsCart.shippingInfo,
        locale,
        defaultLocale,
      ),
      payments: CartMapper.commercetoolsPaymentInfoToPayments(commercetoolsCart.paymentInfo, locale),
      discountCodes: CartMapper.commercetoolsDiscountCodesInfoToDiscount(
        commercetoolsCart.discountCodes,
        locale,
        defaultLocale,
      ),
      taxed: CartMapper.commercetoolsTaxedPriceToTaxed(commercetoolsCart.taxedPrice, locale),
      discountedAmount: ProductMapper.commercetoolsMoneyToMoney(
        commercetoolsCart.discountOnTotalPrice?.discountedAmount,
      ),
      itemShippingAddresses: commercetoolsCart.itemShippingAddresses,
      origin: this.commercetoolsCartOriginToCartOrigin(commercetoolsCart.origin),
      cartState: this.commercetoolsCartStateToCartState(commercetoolsCart.cartState),
      storeKey: commercetoolsCart.store?.key,
      availableShippingMethods: [
        CartMapper.commercetoolsShippingMethodToShippingMethod(
          commercetoolsCart.shippingInfo?.shippingMethod?.obj,
          locale,
          defaultLocale,
        ),
      ],
    };
  };

  static commercetoolsLineItemsToLineItems: (
    commercetoolsLineItems: CommercetoolsLineItem[],
    locale: Locale,
    defaultLocale: string,
  ) => LineItem[] = (commercetoolsLineItems: CommercetoolsLineItem[], locale: Locale, defaultLocale: string) => {
    const lineItems: LineItem[] = [];

    commercetoolsLineItems?.forEach((commercetoolsLineItem) => {
      const item: LineItem = {
        lineItemId: commercetoolsLineItem.id,
        productId: commercetoolsLineItem.productId,
        name: LocalizedValue.getLocalizedValue(locale, defaultLocale, commercetoolsLineItem?.name) || '',
        type: 'variant',
        count: commercetoolsLineItem.quantity,
        price: ProductMapper.commercetoolsMoneyToMoney(commercetoolsLineItem.price?.value),
        discountedPrice: ProductMapper.commercetoolsMoneyToMoney(commercetoolsLineItem.price?.discounted?.value),
        discountTexts: CartMapper.commercetoolsDiscountedPricesPerQuantityToDiscountTexts(
          commercetoolsLineItem.discountedPricePerQuantity,
          locale,
          defaultLocale,
        ),
        discounts: CartMapper.commercetoolsDiscountedPricesPerQuantityToDiscounts(
          commercetoolsLineItem.discountedPricePerQuantity,
          locale,
          defaultLocale,
        ),
        discountedPricePerCount: this.commercetoolsDiscountedPricesPerQuantityToDiscountedPricePerCount(
          commercetoolsLineItem.discountedPricePerQuantity,
          locale,
          defaultLocale,
        ),
        totalPrice: ProductMapper.commercetoolsMoneyToMoney(commercetoolsLineItem.totalPrice),
        taxed: this.commercetoolsTaxedItemPriceToTaxed(commercetoolsLineItem.taxedPrice),
        taxRate: this.commercetoolsTaxRateToTaxRate(commercetoolsLineItem.taxRate),
        variant: ProductMapper.commercetoolsProductVariantToVariant(commercetoolsLineItem.variant, locale),
        isGift:
          commercetoolsLineItem?.lineItemMode !== undefined && commercetoolsLineItem.lineItemMode === 'GiftLineItem',
      };
      item._url = ProductRouter.generateUrlFor(item);
      lineItems.push(item);
    });

    return lineItems;
  };

  static commercetoolsAddressToAddress: (commercetoolsAddress: CommercetoolsAddress) => Address = (
    commercetoolsAddress: CommercetoolsAddress,
  ) => {
    return {
      addressId: commercetoolsAddress?.id,
      salutation: commercetoolsAddress?.salutation,
      firstName: commercetoolsAddress?.firstName,
      lastName: commercetoolsAddress?.lastName,
      streetName: commercetoolsAddress?.streetName,
      streetNumber: commercetoolsAddress?.streetNumber,
      additionalStreetInfo: commercetoolsAddress?.additionalStreetInfo,
      additionalAddressInfo: commercetoolsAddress?.additionalAddressInfo,
      postalCode: commercetoolsAddress?.postalCode,
      city: commercetoolsAddress?.city,
      country: commercetoolsAddress?.country,
      state: commercetoolsAddress?.state,
      phone: commercetoolsAddress?.phone,
    };
  };

  static commercetoolsShipmentStateToShipmentState: (
    commercetoolsShipmentState: CommercetoolsShipmentState | undefined,
  ) => ShipmentState | undefined = (commercetoolsShipmentState: CommercetoolsShipmentState | undefined) => {
    switch (commercetoolsShipmentState) {
      case 'backorder':
        return ShipmentState.BACKORDER;
      case 'delayed':
        return ShipmentState.DELAYED;
      case 'delivered':
        return ShipmentState.DELIVERED;
      case 'partial':
        return ShipmentState.PARTIAL;
      case 'ready':
        return ShipmentState.READY;
      case 'shipped':
        return ShipmentState.SHIPPED;
      case 'pending':
      default:
        return ShipmentState.PENDING;
    }
  };

  static addressToCommercetoolsAddress: (address: Address) => CommercetoolsAddress = (address: Address) => {
    return {
      id: address?.addressId,
      salutation: address?.salutation,
      firstName: address?.firstName,
      lastName: address?.lastName,
      streetName: address?.streetName,
      streetNumber: address?.streetNumber,
      additionalStreetInfo: address?.additionalStreetInfo,
      additionalAddressInfo: address?.additionalAddressInfo,
      postalCode: address?.postalCode,
      city: address?.city,
      country: address?.country,
      state: address?.state,
      phone: address?.phone,
    };
  };

  static commercetoolsOrderToOrder: (
    commercetoolsOrder: CommercetoolsOrder,
    locale: Locale,
    defaultLocale: string,
  ) => Order = (commercetoolsOrder: CommercetoolsOrder, locale: Locale, defaultLocale: string) => {
    return {
      cartId: commercetoolsOrder.cart?.id,
      origin: this.commercetoolsCartOriginToCartOrigin(commercetoolsOrder.origin),
      orderState: this.commercetoolsOrderStateToOrderState(commercetoolsOrder.orderState),
      orderId: commercetoolsOrder.id,
      orderNumber: commercetoolsOrder.orderNumber,
      purchaseOrderNumber: commercetoolsOrder.purchaseOrderNumber,
      orderVersion: commercetoolsOrder.version.toString(),
      createdAt: new Date(commercetoolsOrder.createdAt),
      lineItems: CartMapper.commercetoolsLineItemsToLineItems(commercetoolsOrder.lineItems, locale, defaultLocale),
      email: commercetoolsOrder?.customerEmail,
      shippingAddress: CartMapper.commercetoolsAddressToAddress(commercetoolsOrder.shippingAddress),
      billingAddress: CartMapper.commercetoolsAddressToAddress(commercetoolsOrder.billingAddress),
      sum: ProductMapper.commercetoolsMoneyToMoney(commercetoolsOrder.totalPrice),
      taxed: CartMapper.commercetoolsTaxedPriceToTaxed(commercetoolsOrder.taxedPrice, locale),
      discountedAmount: ProductMapper.commercetoolsMoneyToMoney(
        commercetoolsOrder.discountOnTotalPrice?.discountedAmount,
      ),
      payments: CartMapper.commercetoolsPaymentInfoToPayments(commercetoolsOrder.paymentInfo, locale),
      shipmentState: CartMapper.commercetoolsShipmentStateToShipmentState(commercetoolsOrder.shipmentState),
    };
  };

  static commercetoolsShippingInfoToShippingInfo: (
    commercetoolsShippingInfo: CommercetoolsShippingInfo | undefined,
    locale: Locale,
    defaultLocale: string,
  ) => ShippingInfo | undefined = (
    commercetoolsShippingInfo: CommercetoolsShippingInfo,
    locale: Locale,
    defaultLocale: string,
  ) => {
    if (commercetoolsShippingInfo === undefined) {
      return undefined;
    }

    let shippingMethod: ShippingMethod = {
      shippingMethodId: commercetoolsShippingInfo?.shippingMethod?.id,
    };

    if (commercetoolsShippingInfo.shippingMethod.obj) {
      shippingMethod = {
        ...CartMapper.commercetoolsShippingMethodToShippingMethod(
          commercetoolsShippingInfo.shippingMethod.obj,
          locale,
          defaultLocale,
        ),
      };
    }

    return {
      ...shippingMethod,
      price: ProductMapper.commercetoolsMoneyToMoney(commercetoolsShippingInfo.price),
      taxed: this.commercetoolsTaxedItemPriceToTaxed(commercetoolsShippingInfo.taxedPrice),
      taxIncludedInPrice: commercetoolsShippingInfo.taxRate?.includedInPrice,
      discounts: commercetoolsShippingInfo.discountedPrice?.includedDiscounts?.map(
        (commercetoolsDiscountedLineItemPortion) => {
          return this.commercetoolsDiscountedLineItemPortionToDiscount(
            commercetoolsDiscountedLineItemPortion,
            locale,
            defaultLocale,
          );
        },
      ),
    };
  };

  static commercetoolsShippingMethodToShippingMethod: (
    commercetoolsShippingMethod: CommercetoolsShippingMethod,
    locale: Locale,
    defaultLocale: string,
  ) => ShippingMethod = (
    commercetoolsShippingMethod: CommercetoolsShippingMethod,
    locale: Locale,
    defaultLocale: string,
  ) => {
    return {
      shippingMethodId: commercetoolsShippingMethod?.id || undefined,
      name:
        LocalizedValue.getLocalizedValue(locale, defaultLocale, commercetoolsShippingMethod?.localizedName) ||
        undefined,
      description:
        LocalizedValue.getLocalizedValue(locale, defaultLocale, commercetoolsShippingMethod?.localizedDescription) ||
        undefined,
      rates: CartMapper.commercetoolsZoneRatesToRates(commercetoolsShippingMethod?.zoneRates, locale),
    } as ShippingMethod;
  };

  static commercetoolsZoneRatesToRates: (
    commercetoolsZoneRates: CommercetoolsZoneRate[] | undefined,
    locale: Locale,
  ) => ShippingRate[] | undefined = (commercetoolsZoneRates: CommercetoolsZoneRate[] | undefined, locale: Locale) => {
    if (commercetoolsZoneRates === undefined) {
      return undefined;
    }

    const shippingRates: ShippingRate[] = [];

    commercetoolsZoneRates.forEach((commercetoolsZoneRate) => {
      const shippingRateId = commercetoolsZoneRate.zone.id;
      const name = commercetoolsZoneRate.zone?.obj?.name || undefined;
      const locations = commercetoolsZoneRate.zone?.obj?.locations?.map((location) => {
        return {
          country: location.country,
          state: location.state,
        } as ShippingLocation;
      });

      // When we tried to get only matching shipping methods, `isMatching` value will be returned.
      // In those cases, we'll only map the ones with value `true`.
      const matchingShippingRates = commercetoolsZoneRate.shippingRates.filter(function (shippingRate) {
        if (shippingRate.isMatching !== undefined && shippingRate.isMatching !== true) {
          return false; // skip
        }
        return true;
      });

      matchingShippingRates.forEach((matchingShippingRates) => {
        const matchingShippingRatePriceTiers = matchingShippingRates.tiers.filter(function (shippingRatePriceTier) {
          if (shippingRatePriceTier.isMatching !== true) {
            return false; // skip
          }
          return true;
        });

        shippingRates.push({
          shippingRateId: shippingRateId,
          name: name,
          locations: locations,
          price:
            // If there are multiple matching price, we only consider the first match.
            matchingShippingRatePriceTiers.length > 0
              ? ProductMapper.commercetoolsMoneyToMoney(matchingShippingRatePriceTiers[0].price)
              : ProductMapper.commercetoolsMoneyToMoney(matchingShippingRates.price),
        } as ShippingRate);
      });
    });

    return shippingRates;
  };

  static commercetoolsPaymentInfoToPayments: (
    commercetoolsPaymentInfo: CommercetoolsPaymentInfo | undefined,
    locale: Locale,
  ) => Payment[] = (commercetoolsPaymentInfo: CommercetoolsPaymentInfo | undefined, locale: Locale) => {
    const payments: Payment[] = [];

    commercetoolsPaymentInfo?.payments?.forEach((commercetoolsPayment) => {
      if (commercetoolsPayment.obj) {
        payments.push(CartMapper.commercetoolsPaymentToPayment(commercetoolsPayment.obj, locale));
      }
    });

    return payments;
  };

  static commercetoolsPaymentToPayment: (commercetoolsPayment: CommercetoolsPayment, locale: Locale) => Payment = (
    commercetoolsPayment: CommercetoolsPayment,
    locale: Locale,
  ) => {
    return {
      id: commercetoolsPayment.id ?? null,
      paymentId: commercetoolsPayment.interfaceId ?? null,
      paymentProvider: commercetoolsPayment.paymentMethodInfo.paymentInterface ?? null,
      paymentMethod: commercetoolsPayment.paymentMethodInfo.method ?? null,
      amountPlanned: ProductMapper.commercetoolsMoneyToMoney(commercetoolsPayment.amountPlanned),
      debug: JSON.stringify(commercetoolsPayment),
      paymentStatus: commercetoolsPayment.paymentStatus.interfaceCode ?? null,
      version: commercetoolsPayment.version ?? 0,
    };
  };

  static commercetoolsDiscountCodesInfoToDiscount: (
    commercetoolsDiscountCodesInfo: CommercetoolsDiscountCodeInfo[] | undefined,
    locale: Locale,
    defaultLocale: string,
  ) => Discount[] = (
    commercetoolsDiscountCodesInfo: CommercetoolsDiscountCodeInfo[] | undefined,
    locale: Locale,
    defaultLocale: string,
  ) => {
    const discounts: Discount[] = [];

    commercetoolsDiscountCodesInfo?.forEach((commercetoolsDiscountCodeInfo) => {
      discounts.push(
        CartMapper.commercetoolsDiscountCodeInfoToDiscountCode(commercetoolsDiscountCodeInfo, locale, defaultLocale),
      );
    });

    return discounts;
  };

  static commercetoolsDiscountCodeInfoToDiscountCode: (
    commercetoolsDiscountCodeInfo: CommercetoolsDiscountCodeInfo,
    locale: Locale,
    defaultLocale: string,
  ) => Discount = (
    commercetoolsDiscountCodeInfo: CommercetoolsDiscountCodeInfo,
    locale: Locale,
    defaultLocale: string,
  ) => {
    let discount: Discount = {
      state: commercetoolsDiscountCodeInfo.state,
    };

    if (commercetoolsDiscountCodeInfo.discountCode.obj) {
      const commercetoolsDiscountCode = commercetoolsDiscountCodeInfo.discountCode.obj;

      discount = {
        ...discount,
        discountId: commercetoolsDiscountCode.id,
        code: commercetoolsDiscountCode.code,
        name: LocalizedValue.getLocalizedValue(locale, defaultLocale, commercetoolsDiscountCode.name) || undefined,
        description:
          LocalizedValue.getLocalizedValue(locale, defaultLocale, commercetoolsDiscountCode.description) || undefined,
      };
    }

    return discount;
  };

  static commercetoolsDiscountedPricesPerQuantityToDiscountTexts: (
    commercetoolsDiscountedLineItemPricesForQuantity: CommercetoolsDiscountedLineItemPriceForQuantity[] | undefined,
    locale: Locale,
    defaultLocale: string,
  ) => string[] = (
    commercetoolsDiscountedLineItemPricesForQuantity: CommercetoolsDiscountedLineItemPriceForQuantity[] | undefined,
    locale: Locale,
    defaultLocale: string,
  ) => {
    const discountTexts: string[] = [];

    commercetoolsDiscountedLineItemPricesForQuantity?.forEach((commercetoolsDiscountedLineItemPriceForQuantity) => {
      commercetoolsDiscountedLineItemPriceForQuantity.discountedPrice.includedDiscounts.forEach(
        (commercetoolsDiscountedLineItemPortion) => {
          if (this.isCartDiscountReference(commercetoolsDiscountedLineItemPortion.discount)) {
            discountTexts.push(
              LocalizedValue.getLocalizedValue(
                locale,
                defaultLocale,
                commercetoolsDiscountedLineItemPortion.discount.obj?.name,
              ),
            );
          }
        },
      );
    });

    return discountTexts;
  };

  static commercetoolsDiscountedPricesPerQuantityToDiscounts: (
    commercetoolsDiscountedLineItemPricesForQuantity: CommercetoolsDiscountedLineItemPriceForQuantity[] | undefined,
    locale: Locale,
    defaultLocale: string,
  ) => Discount[] = (
    commercetoolsDiscountedLineItemPricesForQuantity: CommercetoolsDiscountedLineItemPriceForQuantity[] | undefined,
    locale: Locale,
    defaultLocale: string,
  ) => {
    const discounts: Discount[] = [];

    commercetoolsDiscountedLineItemPricesForQuantity?.forEach((commercetoolsDiscountedLineItemPriceForQuantity) => {
      commercetoolsDiscountedLineItemPriceForQuantity.discountedPrice.includedDiscounts.forEach(
        (commercetoolsDiscountedLineItemPortion) => {
          discounts.push(
            CartMapper.commercetoolsDiscountedLineItemPortionToDiscount(
              commercetoolsDiscountedLineItemPortion,
              locale,
              defaultLocale,
            ),
          );
        },
      );
    });

    return discounts;
  };

  static commercetoolsDiscountedPricesPerQuantityToDiscountedPricePerCount(
    commercetoolsDiscountedLineItemPricesForQuantity: CommercetoolsDiscountedLineItemPriceForQuantity[] | undefined,
    locale: Locale,
    defaultLocale: string,
  ): DiscountedPricePerCount[] {
    return commercetoolsDiscountedLineItemPricesForQuantity?.map((commercetoolsDiscountedLineItemPriceForQuantity) => {
      return {
        count: commercetoolsDiscountedLineItemPriceForQuantity.quantity,
        discounts: commercetoolsDiscountedLineItemPriceForQuantity.discountedPrice.includedDiscounts.map(
          (commercetoolsDiscountedLineItemPortion) =>
            this.commercetoolsDiscountedLineItemPortionToDiscount(
              commercetoolsDiscountedLineItemPortion,
              locale,
              defaultLocale,
            ),
        ),
      };
    });
  }

  static commercetoolsDiscountedLineItemPortionToDiscount: (
    commercetoolsDiscountedLineItemPortion: CommercetoolsDiscountedLineItemPortion,
    locale: Locale,
    defaultLocale: string,
  ) => Discount = (
    commercetoolsDiscountedLineItemPortion: CommercetoolsDiscountedLineItemPortion,
    locale: Locale,
    defaultLocale: string,
  ) => {
    let discount: Discount = {
      discountedAmount: ProductMapper.commercetoolsMoneyToMoney(
        commercetoolsDiscountedLineItemPortion.discountedAmount,
      ),
    };

    if (this.isCartDiscountReference(commercetoolsDiscountedLineItemPortion.discount)) {
      const commercetoolsCartDiscount = commercetoolsDiscountedLineItemPortion.discount.obj;

      discount = {
        ...discount,
        discountId: commercetoolsCartDiscount.id,
        name: LocalizedValue.getLocalizedValue(locale, defaultLocale, commercetoolsCartDiscount.name) || undefined,
        description:
          LocalizedValue.getLocalizedValue(locale, defaultLocale, commercetoolsCartDiscount.description) || undefined,
      };
    }

    return discount;
  };

  static commercetoolsTaxedPriceToTaxed: (
    commercetoolsTaxedPrice: CommercetoolsTaxedPrice | undefined,
    locale: Locale,
  ) => Tax | undefined = (commercetoolsTaxedPrice: CommercetoolsTaxedPrice | undefined, locale: Locale) => {
    if (commercetoolsTaxedPrice === undefined) {
      return undefined;
    }

    return {
      netAmount: ProductMapper.commercetoolsMoneyToMoney(commercetoolsTaxedPrice.totalNet),
      grossAmount: ProductMapper.commercetoolsMoneyToMoney(commercetoolsTaxedPrice.totalGross),
      taxAmount: ProductMapper.commercetoolsMoneyToMoney(commercetoolsTaxedPrice.totalTax),
      taxPortions: commercetoolsTaxedPrice.taxPortions.map((commercetoolsTaxPortion) => {
        const taxPortion: TaxPortion = {
          amount: ProductMapper.commercetoolsMoneyToMoney(commercetoolsTaxPortion.amount),
          name: commercetoolsTaxPortion.name,
          rate: commercetoolsTaxPortion.rate,
        };

        return taxPortion;
      }),
    };
  };

  static commercetoolsTaxedItemPriceToTaxed(
    commercetoolsTaxedPrice: CommercetoolsTaxedItemPrice | undefined,
  ): Tax | undefined {
    if (commercetoolsTaxedPrice === undefined) {
      return undefined;
    }

    return {
      netAmount: ProductMapper.commercetoolsMoneyToMoney(commercetoolsTaxedPrice.totalNet),
      grossAmount: ProductMapper.commercetoolsMoneyToMoney(commercetoolsTaxedPrice.totalGross),
      taxAmount: ProductMapper.commercetoolsMoneyToMoney(commercetoolsTaxedPrice.totalTax),
    };
  }

  static commercetoolsTaxRateToTaxRate(commercetoolsTaxRate: CommercetoolsTaxRate | undefined): TaxRate | undefined {
    if (commercetoolsTaxRate === undefined) {
      return undefined;
    }

    return {
      taxRateId: commercetoolsTaxRate?.id,
      taxRateKey: commercetoolsTaxRate?.key,
      name: commercetoolsTaxRate?.name,
      amount: commercetoolsTaxRate?.amount,
      includedInPrice: commercetoolsTaxRate?.includedInPrice,
      country: commercetoolsTaxRate?.country,
      state: commercetoolsTaxRate?.state,
    };
  }

  static commercetoolsCartOriginToCartOrigin(commercetoolsCartOrigin: CommercetoolsCartOrigin): CartOrigin {
    let cartOrigin: CartOrigin;

    switch (true) {
      case commercetoolsCartOrigin === 'Merchant':
        cartOrigin = 'Merchant';
        break;
      case commercetoolsCartOrigin === 'Customer':
      default:
        cartOrigin = 'Customer';
        break;
    }

    return cartOrigin;
  }

  static commercetoolsCartStateToCartState(commercetoolsCartState: CommercetoolsCartState): CartState {
    let cartState: CartState;

    switch (true) {
      case commercetoolsCartState === 'Frozen':
        cartState = 'Frozen';
        break;
      case commercetoolsCartState === 'Merged':
        cartState = 'Merged';
        break;
      case commercetoolsCartState === 'Ordered':
        cartState = 'Ordered';
        break;
      case commercetoolsCartState === 'Active':
      default:
        cartState = 'Active';
        break;
    }

    return cartState;
  }

  static commercetoolsOrderStateToOrderState(commercetoolsOrderState: CommercetoolsOrderState): OrderState {
    let orderState: OrderState;

    switch (true) {
      case commercetoolsOrderState === 'Cancelled':
        orderState = 'Cancelled';
        break;
      case commercetoolsOrderState === 'Complete':
        orderState = 'Complete';
        break;
      case commercetoolsOrderState === 'Confirmed':
        orderState = 'Confirmed';
        break;
      case commercetoolsOrderState === 'Open':
      default:
        orderState = 'Open';
        break;
    }

    return orderState;
  }

  static commercetoolsReturnInfoToReturnInfo(commercetoolsReturnInfo: CommercetoolsReturnInfo[]): ReturnInfo[] {
    return commercetoolsReturnInfo.map((returnInfo) => ({
      returnDate: new Date(returnInfo.returnDate),
      returnTrackingId: returnInfo.returnTrackingId,
      lineItems: returnInfo.items.map((returnItem) => ({
        returnLineItemId: returnItem.id,
        count: returnItem.quantity,
        lineItemId: (returnItem as LineItemReturnItem)?.lineItemId,
        comment: returnItem.comment,
        createdAt: new Date(returnItem.createdAt),
      })),
    }));
  }

  static returnLineItemToCommercetoolsReturnItemDraft(returnItem: ReturnLineItem[]): ReturnItemDraft[] {
    return returnItem.map((item) => ({
      quantity: item.count,
      lineItemId: item.lineItemId,
      shipmentState: 'Returned', //Initial state for Return Items that are refundable.
      comment: item?.comment,
    }));
  }

  static isCartDiscountReference(reference: Reference): reference is CartDiscountReference {
    return (reference as CartDiscountReference).obj !== undefined;
  }
}
