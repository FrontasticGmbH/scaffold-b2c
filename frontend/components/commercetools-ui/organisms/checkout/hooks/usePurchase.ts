import { useCallback, useContext } from 'react';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { useTranslations } from 'use-intl';
import * as uuid from 'uuid';
import { PaymentResponse } from 'components/commercetools-ui/organisms/checkout/provider/payment/types';
import { AccountContext } from 'context/account';
import useI18n from 'helpers/hooks/useI18n';
import { Guid } from 'helpers/utils/guid';
import { useRouter } from 'i18n/routing';
import { getLocalizationInfo } from 'project.config';
import { sdk } from 'sdk';
import { Cart } from 'types/entity/cart';
import { Transaction } from 'frontastic/hooks/useCart/types';
import { useCheckout } from '../provider';

interface Options {
  cart?: Cart;
  transaction: Transaction;
  hasOutOfStockItems?: boolean;
}
const usePurchase = ({ cart, transaction, hasOutOfStockItems }: Options) => {
  const translate = useTranslations();

  const router = useRouter();
  const { locale } = useParams();
  const { country } = useI18n();
  const { account } = useContext(AccountContext);
  const { makePayment, makeKlarnaPayment, paymentData, paymentDataIsValid, handleThreeDS2Action, setProcessing } =
    useCheckout();

  const handlePaymentResponse = useCallback(
    async (response: PaymentResponse, orderNumber: string) => {
      if (['Authorised', 'RedirectShopper', 'IdentifyShopper', 'ChallengeShopper'].includes(response?.resultCode)) {
        if (!response.action) {
          await sdk.callAction({ actionName: 'cart/resetCart' });
          router.push(`/thank-you?orderId=${orderNumber}`);
          return;
        }

        switch (response.action.type) {
          case 'redirect':
            await sdk.callAction({ actionName: 'cart/resetCart' });
            window.location.replace(response.action.url as string);
            break;
          case 'threeDS2':
            await handleThreeDS2Action(response.action, (threeDS2AuthResponse) =>
              handlePaymentResponse(threeDS2AuthResponse, orderNumber),
            );
            break;
        }
      } else {
        toast.error(`${translate('checkout.payment-failed')}`);
      }
    },
    [router, handleThreeDS2Action, translate],
  );

  const purchase = useCallback(async () => {
    if (!cart?.shippingAddress || !cart?.billingAddress || !cart?.shippingInfo) return;

    if (hasOutOfStockItems) {
      const outOfStockItems = cart?.lineItems?.filter((lineItem) => lineItem.variant?.isOnStock) ?? [];

      toast.error(
        `${translate('checkout.items-outOfStock')}:\n\n
            ${outOfStockItems.map((item) => `- ${item.name} \n\n`)}
          `,
        { style: { alignItems: 'flex-end', flexDirection: 'row-reverse' } },
      );
      return;
    }

    if (!transaction.total.centAmount || !paymentDataIsValid) {
      toast.error(`${translate('checkout.payment-failed')}`);

      return;
    }

    setProcessing(true);

    const orderNumber = Guid.newGuid(false, ['', 'xxxx-xxxx-yxxx']);

    let response = {} as PaymentResponse;

    if (paymentData?.type === 'scheme') {
      response = await makePayment({
        amount: { currency: transaction.total.currencyCode, value: transaction.total.centAmount },
        returnUrl: `${window.location.origin}/thank-you?orderId=${orderNumber}`,
        reference: orderNumber as string,
        channel: 'web',
        origin: window.location.origin,
        countryCode: country,
        shopperLocale: getLocalizationInfo(locale).locale,
        authenticationData: {
          threeDSRequestData: {
            nativeThreeDS: 'preferred',
          },
        },
        browserInfo: {
          acceptHeader: '*/*',
          colorDepth: screen.colorDepth,
          javaEnabled: false,
          language: navigator.language,
          screenHeight: screen.availHeight,
          screenWidth: screen.availWidth,
          timeZoneOffset: new Date().getTimezoneOffset(),
          userAgent: navigator.userAgent,
        },
        metadata: { cartId: cart.cartId },
      });
    }

    if (paymentData?.type === 'klarna_paynow') {
      response = await makeKlarnaPayment({
        amount: { currency: transaction.total.currencyCode, value: transaction.total.centAmount },
        returnUrl: `${window.location.origin}/thank-you?orderId=${orderNumber}`,
        reference: orderNumber as string,
        shopperReference: account?.accountId ?? uuid.v4(),
        countryCode: country,
        shopperLocale: getLocalizationInfo(locale).locale,
        lineItems: (cart?.lineItems ?? []).map((lineItem) => ({
          id: lineItem.lineItemId as string,
          quantity: (lineItem.count ?? 1).toString() as string,
          description: lineItem.name as string,
          amountIncludingTax: lineItem.totalPrice?.centAmount as number,
          productUrl: lineItem._url,
          imageUrl: lineItem.variant?.images?.[0],
        })),
        metadata: { cartId: cart.cartId },
      });
    }

    await handlePaymentResponse(response, orderNumber);

    setProcessing(false);
  }, [
    cart,
    setProcessing,
    makePayment,
    hasOutOfStockItems,
    transaction.total,
    locale,
    paymentData?.type,
    makeKlarnaPayment,
    account?.accountId,
    country,
    paymentDataIsValid,
    handlePaymentResponse,
    translate,
  ]);

  return { purchase };
};

export default usePurchase;
