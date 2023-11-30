import { Cart } from '@Types/cart/Cart';
import {
  BaseAddress as CommercetoolsAddress,
  Cart as CommercetoolsCart,
  DiscountCodeInfo as CommercetoolsDiscountCodeInfo,
  DiscountedLineItemPortion as CommercetoolsDiscountedLineItemPortion,
  DiscountedLineItemPriceForQuantity as CommercetoolsDiscountedLineItemPriceForQuantity,
  LineItem as CommercetoolsLineItem,
  Order as CommercetoolsOrder,
  Payment as CommercetoolsPayment,
  PaymentInfo as CommercetoolsPaymentInfo,
  ShipmentState as CommercetoolsShipmentState,
  ShippingInfo as CommercetoolsShippingInfo,
  ShippingMethod as CommercetoolsShippingMethod,
  TaxedPrice as CommercetoolsTaxedPrice,
  ZoneRate as CommercetoolsZoneRate,
} from '@commercetools/platform-sdk';
import { LineItem } from '@Types/cart/LineItem';
import { Address } from '@Types/account/Address';
import { Order, ShipmentState } from '@Types/cart/Order';
import { Locale } from '../Locale';
import { ShippingMethod } from '@Types/cart/ShippingMethod';
import { ShippingRate } from '@Types/cart/ShippingRate';
import { ShippingLocation } from '@Types/cart/ShippingLocation';
import { ProductRouter } from '../utils/ProductRouter';
import { ProductMapper } from './ProductMapper';
import { ShippingInfo } from '@Types/cart/ShippingInfo';
import { Payment } from '@Types/cart/Payment';
import { Tax } from '@Types/cart/Tax';
import { TaxPortion } from '@Types/cart/TaxPortion';
import { Discount } from '@Types/cart/Discount';
import LocalizedValue from '../utils/LocalizedValue';

export class CartMapper {
  static commercetoolsCartToCart: (
    commercetoolsCart: CommercetoolsCart,
    locale: Locale,
    defaultLocale: string,
  ) => Cart = (commercetoolsCart: CommercetoolsCart, locale: Locale, defaultLocale: string) => {
    return {
      cartId: commercetoolsCart.id,
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
      discountCodes: CartMapper.commercetoolsDiscountCodesInfoToDiscountCodes(
        commercetoolsCart.discountCodes,
        locale,
        defaultLocale,
      ),
      taxed: CartMapper.commercetoolsTaxedPriceToTaxed(commercetoolsCart.taxedPrice, locale),
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
        totalPrice: ProductMapper.commercetoolsMoneyToMoney(commercetoolsLineItem.totalPrice),
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
    } as Address;
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
    } as CommercetoolsAddress;
  };

  static commercetoolsOrderToOrder: (
    commercetoolsOrder: CommercetoolsOrder,
    locale: Locale,
    defaultLocale: string,
  ) => Order = (commercetoolsOrder: CommercetoolsOrder, locale: Locale, defaultLocale: string) => {
    return {
      cartId: commercetoolsOrder.cart?.id,
      orderState: commercetoolsOrder.orderState,
      orderId: commercetoolsOrder.id,
      orderNumber: commercetoolsOrder.orderNumber,
      orderVersion: commercetoolsOrder.version.toString(),
      createdAt: new Date(commercetoolsOrder.createdAt),
      lineItems: CartMapper.commercetoolsLineItemsToLineItems(commercetoolsOrder.lineItems, locale, defaultLocale),
      email: commercetoolsOrder?.customerEmail,
      shippingAddress: CartMapper.commercetoolsAddressToAddress(commercetoolsOrder.shippingAddress),
      billingAddress: CartMapper.commercetoolsAddressToAddress(commercetoolsOrder.billingAddress),
      sum: ProductMapper.commercetoolsMoneyToMoney(commercetoolsOrder.totalPrice),
      taxed: CartMapper.commercetoolsTaxedPriceToTaxed(commercetoolsOrder.taxedPrice, locale),
      payments: CartMapper.commercetoolsPaymentInfoToPayments(commercetoolsOrder.paymentInfo, locale),
      shipmentState: CartMapper.commercetoolsShipmentStateToShipmentState(commercetoolsOrder.shipmentState),
    } as Order;
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
      discounts:
        commercetoolsShippingInfo.discountedPrice?.includedDiscounts?.map((discount) => discount.discountedAmount) ??
        [],
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

  static commercetoolsDiscountCodesInfoToDiscountCodes: (
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
          discountTexts.push(
            LocalizedValue.getLocalizedValue(
              locale,
              defaultLocale,
              commercetoolsDiscountedLineItemPortion.discount.obj?.name,
            ),
          );
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

    if (commercetoolsDiscountedLineItemPortion.discount.obj) {
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
      amount: ProductMapper.commercetoolsMoneyToMoney(commercetoolsTaxedPrice.totalNet),
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
}
