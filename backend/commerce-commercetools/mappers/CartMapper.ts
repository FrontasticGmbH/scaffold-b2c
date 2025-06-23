import { Cart, CartOrigin, CartState } from '@Types/cart/Cart';
import {
  BaseAddress as CommercetoolsAddress,
  Cart as CommercetoolsCart,
  CartDiscount as CommercetoolsCartDiscount,
  CartDiscountReference,
  CartDiscountTarget as CommercetoolsCartDiscountTarget,
  CartDiscountValue as CommercetoolsCartDiscountValue,
  CartOrigin as CommercetoolsCartOrigin,
  CartState as CommercetoolsCartState,
  DiscountCodeInfo as CommercetoolsDiscountCodeInfo,
  DiscountCodeState as CommercetoolsDiscountCodeState,
  DiscountedLineItemPortion as CommercetoolsDiscountedLineItemPortion,
  DiscountedLineItemPrice as CommercetoolsDiscountedLineItemPrice,
  DiscountedLineItemPriceForQuantity as CommercetoolsDiscountedLineItemPriceForQuantity,
  DiscountedTotalPricePortion as CommercetoolsDiscountedTotalPricePortion,
  DiscountOnTotalPrice as CommercetoolsDiscountOnTotalPrice,
  LineItem as CommercetoolsLineItem,
  Order as CommercetoolsOrder,
  OrderState as CommercetoolsOrderState,
  Payment as CommercetoolsPayment,
  PaymentInfo as CommercetoolsPaymentInfo,
  Reference,
  SelectionMode as CommercetoolsSelectionMode,
  ShipmentState as CommercetoolsShipmentState,
  ShippingInfo as CommercetoolsShippingInfo,
  ShippingMethod as CommercetoolsShippingMethod,
  ShippingRate as CommercetoolsShippingRate,
  TaxedItemPrice as CommercetoolsTaxedItemPrice,
  TaxedPrice as CommercetoolsTaxedPrice,
  TaxRate as CommercetoolsTaxRate,
  ZoneRate as CommercetoolsZoneRate,
} from '@commercetools/platform-sdk';
import { LineItem } from '@Types/cart/LineItem';
import { Address } from '@Types/account/Address';
import { Order, OrderState, ShipmentState } from '@Types/cart/Order';
import {
  CartDiscount,
  CartDiscountValue,
  DiscountCode,
  DiscountCodeState,
  DiscountedPortion,
  DiscountedPrice,
  DiscountedPricePerCount,
  DiscountOnTotalPrice,
  Payment,
  ShippingInfo,
  ShippingLocation,
  ShippingMethod,
  ShippingRate,
  Tax,
  TaxPortion,
  TaxRate,
} from '@Types/cart';
import { CartDiscountSelectionMode, CartDiscountTarget } from '@Types/cart/Discount';
import { ProductRouter } from '../utils/routers/ProductRouter';
import { Locale } from '../Locale';
import LocalizedValue from '../utils/LocalizedValue';
import { AccountMapper } from './AccountMapper';
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
      discountCodes: CartMapper.commercetoolsDiscountCodesInfoToDiscountCodes(
        commercetoolsCart.discountCodes,
        locale,
        defaultLocale,
      ),
      taxed: CartMapper.commercetoolsTaxedPriceToTaxed(commercetoolsCart.taxedPrice, locale),
      itemShippingAddresses: commercetoolsCart.itemShippingAddresses,
      origin: this.commercetoolsCartOriginToCartOrigin(commercetoolsCart.origin),
      cartState: this.commercetoolsCartStateToCartState(commercetoolsCart.cartState),
      storeKey: commercetoolsCart.store?.key,
      discountOnTotalPrice: this.commerceToolsDiscountOnTotalPriceToDiscountOnTotalPrice(
        commercetoolsCart.discountOnTotalPrice,
        locale,
        defaultLocale,
      ),
      accountGroup: AccountMapper.commercetoolsCustomerGroupToAccountGroup(commercetoolsCart.customerGroup?.obj),
    };
  };

  static commerceToolsDiscountOnTotalPriceToDiscountOnTotalPrice(
    commerceToolsDiscountOnTotalPrice: CommercetoolsDiscountOnTotalPrice,
    locale: Locale,
    defaultLocale: string,
  ): DiscountOnTotalPrice | undefined {
    if (!commerceToolsDiscountOnTotalPrice) {
      return undefined;
    }

    return {
      discountedAmount: ProductMapper.commercetoolsMoneyToMoney(commerceToolsDiscountOnTotalPrice.discountedAmount),
      discountedGrossAmount: ProductMapper.commercetoolsMoneyToMoney(
        commerceToolsDiscountOnTotalPrice.discountedGrossAmount,
      ),
      discountedNetAmount: ProductMapper.commercetoolsMoneyToMoney(
        commerceToolsDiscountOnTotalPrice.discountedNetAmount,
      ),
      includedDiscounts: commerceToolsDiscountOnTotalPrice.includedDiscounts?.map((commercetoolsIncludedDiscount) => {
        return CartMapper.commercetoolsDiscountPortionToDiscountedPortion(
          commercetoolsIncludedDiscount,
          locale,
          defaultLocale,
        );
      }),
    };
  }

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
        productSlug: LocalizedValue.getLocalizedValue(locale, defaultLocale, commercetoolsLineItem.productSlug),
        name: LocalizedValue.getLocalizedValue(locale, defaultLocale, commercetoolsLineItem?.name) || '',
        type: 'variant',
        count: commercetoolsLineItem.quantity,
        price: ProductMapper.commercetoolsMoneyToMoney(commercetoolsLineItem.price?.value),
        discountedPrice:
          commercetoolsLineItem.price?.discounted !== undefined
            ? ProductMapper.commercetoolsDiscountedPriceToDiscountedPrice(
                commercetoolsLineItem.price?.discounted,
                locale,
              )
            : undefined,
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
      case 'Backorder':
        return ShipmentState.BACKORDER;
      case 'Delayed':
        return ShipmentState.DELAYED;
      case 'Delivered':
        return ShipmentState.DELIVERED;
      case 'Partial':
        return ShipmentState.PARTIAL;
      case 'Ready':
        return ShipmentState.READY;
      case 'Shipped':
        return ShipmentState.SHIPPED;
      case 'Pending':
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
      shippingInfo: CartMapper.commercetoolsShippingInfoToShippingInfo(
        commercetoolsOrder.shippingInfo,
        locale,
        defaultLocale,
      ),
      accountGroup: AccountMapper.commercetoolsCustomerGroupToAccountGroup(commercetoolsOrder.customerGroup?.obj),
    };
  };

  static commercetoolsShippingInfoToShippingInfo(
    commercetoolsShippingInfo: CommercetoolsShippingInfo | undefined,
    locale: Locale,
    defaultLocale: string,
  ): ShippingInfo | undefined {
    if (commercetoolsShippingInfo === undefined) {
      return undefined;
    }

    return {
      shippingMethodId: commercetoolsShippingInfo?.shippingMethod?.id,
      name: commercetoolsShippingInfo?.shippingMethodName,
      price: ProductMapper.commercetoolsMoneyToMoney(commercetoolsShippingInfo.price),
      rate: CartMapper.commercetoolsShippingRateToShippingRate(commercetoolsShippingInfo.shippingRate),
      taxRate: this.commercetoolsTaxRateToTaxRate(commercetoolsShippingInfo.taxRate),
      taxed: this.commercetoolsTaxedItemPriceToTaxed(commercetoolsShippingInfo.taxedPrice),
      discountedPrice: this.commercetoolsDiscountedLineItemPriceToDiscountedPrice(
        commercetoolsShippingInfo.discountedPrice,
        locale,
        defaultLocale,
      ),
    };
  }

  static commercetoolsShippingRateToShippingRate(commercetoolsShippingRate: CommercetoolsShippingRate): ShippingRate {
    return {
      price: ProductMapper.commercetoolsMoneyToMoney(commercetoolsShippingRate.price),
      freeAbove: ProductMapper.commercetoolsMoneyToMoney(commercetoolsShippingRate.freeAbove),
    };
  }

  static commercetoolsShippingMethodToShippingMethod(
    commercetoolsShippingMethod: CommercetoolsShippingMethod,
    locale: Locale,
    defaultLocale: string,
  ): ShippingMethod {
    return {
      shippingMethodId: commercetoolsShippingMethod?.id || undefined,
      name:
        LocalizedValue.getLocalizedValue(locale, defaultLocale, commercetoolsShippingMethod?.localizedName) ||
        undefined,
      description:
        LocalizedValue.getLocalizedValue(locale, defaultLocale, commercetoolsShippingMethod?.localizedDescription) ||
        undefined,
      rates: CartMapper.commercetoolsZoneRatesToRates(commercetoolsShippingMethod?.zoneRates),
    } as ShippingMethod;
  }

  static commercetoolsZoneRatesToRates(
    commercetoolsZoneRates: CommercetoolsZoneRate[] | undefined,
  ): ShippingRate[] | undefined {
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
        return shippingRate?.isMatching !== false;
      });

      matchingShippingRates.forEach((matchingShippingRate) => {
        const matchingShippingRatePriceTiers = matchingShippingRate.tiers.filter(function (shippingRatePriceTier) {
          return shippingRatePriceTier.isMatching;
        });

        shippingRates.push({
          shippingRateId: shippingRateId,
          name: name,
          locations: locations,
          price:
            // If there are multiple matching price, we only consider the first match.
            matchingShippingRatePriceTiers.length > 0
              ? ProductMapper.commercetoolsMoneyToMoney(matchingShippingRatePriceTiers[0].price)
              : ProductMapper.commercetoolsMoneyToMoney(matchingShippingRate.price),
          freeAbove: ProductMapper.commercetoolsMoneyToMoney(matchingShippingRate.freeAbove),
        } as ShippingRate);
      });
    });

    return shippingRates;
  }

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
  ) => DiscountCode[] = (
    commercetoolsDiscountCodesInfo: CommercetoolsDiscountCodeInfo[] | undefined,
    locale: Locale,
    defaultLocale: string,
  ) => {
    const discountCodes: DiscountCode[] = [];

    commercetoolsDiscountCodesInfo?.forEach((commercetoolsDiscountCodeInfo) => {
      discountCodes.push(
        CartMapper.commercetoolsDiscountCodeInfoToDiscountCode(commercetoolsDiscountCodeInfo, locale, defaultLocale),
      );
    });

    return discountCodes;
  };

  static commercetoolsDiscountCodeInfoToDiscountCode(
    commercetoolsDiscountCodeInfo: CommercetoolsDiscountCodeInfo,
    locale: Locale,
    defaultLocale: string,
  ): DiscountCode {
    let discountCode: DiscountCode = {
      discountCodeId: commercetoolsDiscountCodeInfo.discountCode.id,
      state: this.commercetoolsDiscountCodeStateToDiscountCodeState(commercetoolsDiscountCodeInfo.state),
    };

    if (commercetoolsDiscountCodeInfo.discountCode.obj) {
      const commercetoolsDiscountCode = commercetoolsDiscountCodeInfo.discountCode.obj;

      discountCode = {
        ...discountCode,
        code: commercetoolsDiscountCode.code,
        name: LocalizedValue.getLocalizedValue(locale, defaultLocale, commercetoolsDiscountCode.name) || undefined,
        description:
          LocalizedValue.getLocalizedValue(locale, defaultLocale, commercetoolsDiscountCode.description) || undefined,
        discounts: commercetoolsDiscountCode.cartDiscounts.map((commercetoolsCartDiscount) => {
          if (this.isCartDiscountReferenceExpanded(commercetoolsCartDiscount)) {
            return this.commercetoolsCartDiscountToCartDiscount(commercetoolsCartDiscount.obj, locale, defaultLocale);
          }
          return undefined;
        }),
      };
    }

    return discountCode;
  }

  static commercetoolsDiscountCodeStateToDiscountCodeState(
    commercetoolsDiscountCodeState: CommercetoolsDiscountCodeState,
  ): DiscountCodeState {
    let discountCodeState: DiscountCodeState;

    switch (true) {
      case commercetoolsDiscountCodeState === 'ApplicationStoppedByPreviousDiscount':
        discountCodeState = 'ApplicationStoppedByPreviousDiscount';
        break;
      case commercetoolsDiscountCodeState === 'DoesNotMatchCart':
        discountCodeState = 'DoesNotMatchCart';
        break;
      case commercetoolsDiscountCodeState === 'MatchesCart':
        discountCodeState = 'MatchesCart';
        break;
      case commercetoolsDiscountCodeState === 'MaxApplicationReached':
        discountCodeState = 'MaxApplicationReached';
        break;
      case commercetoolsDiscountCodeState === 'NotActive':
        discountCodeState = 'NotActive';
        break;
      case commercetoolsDiscountCodeState === 'NotValid':
      default:
        discountCodeState = 'NotValid';
        break;
    }

    return discountCodeState;
  }

  static commercetoolsDiscountPortionToDiscountedPortion(
    commercetoolsDiscountedPortion: CommercetoolsDiscountedTotalPricePortion | CommercetoolsDiscountedLineItemPortion,
    locale: Locale,
    defaultLocale: string,
  ): DiscountedPortion {
    let cartDiscount: CartDiscount = {
      cartDiscountId: commercetoolsDiscountedPortion.discount.id,
    };

    if (this.isCartDiscountReferenceExpanded(commercetoolsDiscountedPortion.discount)) {
      cartDiscount = this.commercetoolsCartDiscountToCartDiscount(
        commercetoolsDiscountedPortion.discount.obj,
        locale,
        defaultLocale,
      );
    }

    return {
      discountedAmount: ProductMapper.commercetoolsMoneyToMoney(commercetoolsDiscountedPortion.discountedAmount),
      discount: cartDiscount,
    };
  }

  static commercetoolsCartDiscountToCartDiscount(
    commercetoolsCartDiscount: CommercetoolsCartDiscount,
    locale: Locale,
    defaultLocale: string,
  ): CartDiscount {
    return {
      cartDiscountId: commercetoolsCartDiscount.id,
      name: LocalizedValue.getLocalizedValue(locale, defaultLocale, commercetoolsCartDiscount.name) || undefined,
      description:
        LocalizedValue.getLocalizedValue(locale, defaultLocale, commercetoolsCartDiscount.description) || undefined,
      discountValue: commercetoolsCartDiscount.value
        ? this.commercetoolsCartDiscountValueToCartDiscountValue(commercetoolsCartDiscount.value, locale)
        : undefined,
      cartPredicate: commercetoolsCartDiscount.cartPredicate,
      target: commercetoolsCartDiscount.target
        ? this.commercetoolsCartDiscountTargetToCartDiscountTarget(commercetoolsCartDiscount.target)
        : undefined,
    };
  }

  static commercetoolsCartDiscountTargetToCartDiscountTarget(
    commercetoolsCartDiscountTarget: CommercetoolsCartDiscountTarget,
  ): CartDiscountTarget | undefined {
    switch (commercetoolsCartDiscountTarget.type) {
      case 'lineItems':
        return {
          type: 'lineItems',
          predicate: commercetoolsCartDiscountTarget.predicate,
        };
      case 'pattern':
        return {
          type: 'pattern',
          maxOccurrence: commercetoolsCartDiscountTarget.maxOccurrence,
          selectionMode: this.commercetoolsSelectionModeToCartDiscountSelectionMode(
            commercetoolsCartDiscountTarget.selectionMode,
          ),
        };
      case 'shipping':
        return {
          type: 'shipping',
        };
      case 'totalPrice':
        return {
          type: 'totalPrice',
        };
      case 'multiBuyLineItems':
        return {
          type: 'multiBuyLineItems',
          predicate: commercetoolsCartDiscountTarget.predicate,
          selectionMode: this.commercetoolsSelectionModeToCartDiscountSelectionMode(
            commercetoolsCartDiscountTarget.selectionMode,
          ),
          triggerQuantity: commercetoolsCartDiscountTarget.triggerQuantity,
          discountedQuantity: commercetoolsCartDiscountTarget.discountedQuantity,
          maxOccurrence: commercetoolsCartDiscountTarget.maxOccurrence,
        };
      default:
        return undefined;
    }
  }

  static commercetoolsSelectionModeToCartDiscountSelectionMode(
    commercetoolsSelectionMode: CommercetoolsSelectionMode,
  ): CartDiscountSelectionMode | undefined {
    switch (commercetoolsSelectionMode) {
      case 'Cheapest':
        return 'Cheapest';
      case 'MostExpensive':
        return 'MostExpensive';
      default:
        return undefined;
    }
  }

  static commercetoolsDiscountedPricesPerQuantityToDiscountedPricePerCount(
    commercetoolsDiscountedLineItemPricesForQuantity: CommercetoolsDiscountedLineItemPriceForQuantity[] | undefined,
    locale: Locale,
    defaultLocale: string,
  ): DiscountedPricePerCount[] {
    return commercetoolsDiscountedLineItemPricesForQuantity?.map(
      (commercetoolsDiscountedLineItemPriceForQuantity): DiscountedPricePerCount => {
        return {
          count: commercetoolsDiscountedLineItemPriceForQuantity.quantity,
          discountedPrice: this.commercetoolsDiscountedLineItemPriceToDiscountedPrice(
            commercetoolsDiscountedLineItemPriceForQuantity.discountedPrice,
            locale,
            defaultLocale,
          ),
        };
      },
    );
  }

  static commercetoolsDiscountedLineItemPriceToDiscountedPrice(
    commercetoolsDiscountedLineItemPrice: CommercetoolsDiscountedLineItemPrice | undefined,
    locale: Locale,
    defaultLocale: string,
  ): DiscountedPrice | undefined {
    if (commercetoolsDiscountedLineItemPrice === undefined) {
      return undefined;
    }

    return {
      value: ProductMapper.commercetoolsMoneyToMoney(commercetoolsDiscountedLineItemPrice.value),
      includedDiscounts: commercetoolsDiscountedLineItemPrice.includedDiscounts.map(
        (commercetoolsDiscountedLineItemPortion) =>
          CartMapper.commercetoolsDiscountPortionToDiscountedPortion(
            commercetoolsDiscountedLineItemPortion,
            locale,
            defaultLocale,
          ),
      ),
    };
  }

  static commercetoolsTaxedPriceToTaxed: (
    commercetoolsTaxedPrice: CommercetoolsTaxedPrice | undefined,
    locale: Locale,
  ) => Tax | undefined = (commercetoolsTaxedPrice: CommercetoolsTaxedPrice | undefined) => {
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

  static isCartDiscountReferenceExpanded(reference: Reference): reference is CartDiscountReference {
    return reference.typeId === 'cart-discount' && reference.obj !== undefined;
  }

  static commercetoolsCartDiscountValueToCartDiscountValue(
    commercetoolsDiscountValue: CommercetoolsCartDiscountValue,
    locale: Locale,
  ): CartDiscountValue {
    switch (commercetoolsDiscountValue.type) {
      case 'absolute':
        return {
          type: 'absolute',
          value: LocalizedValue.getLocalizedCurrencyValue(locale, commercetoolsDiscountValue.money),
        };

      case 'fixed':
        return {
          type: 'fixed',
          value: LocalizedValue.getLocalizedCurrencyValue(locale, commercetoolsDiscountValue.money),
        };

      case 'relative':
        return {
          type: 'relative',
          value: commercetoolsDiscountValue.permyriad || 0,
        };

      case 'giftLineItem':
        return {
          type: 'giftLineItem',
          productId: commercetoolsDiscountValue.product.id,
          variantId: commercetoolsDiscountValue.variantId.toString(),
        };
    }
  }
}
