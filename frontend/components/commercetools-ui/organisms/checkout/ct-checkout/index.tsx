import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { checkoutFlow } from '@commercetools/checkout-browser-sdk';
import toast from 'react-hot-toast';
import { useTranslations } from 'use-intl';
import { AccountContext } from 'context/account';
import { useRouter } from 'i18n/routing';
import { useProjectSettings, useCheckout } from 'frontastic';
import { CheckoutWrappedProps } from '..';
import Header from '../components/header';

const CommercetoolsCheckout = ({ logo }: Pick<CheckoutWrappedProps, 'logo'>) => {
  const { push: pushRoute } = useRouter();

  const translate = useTranslations();

  const initiatedCheckout = useRef(false);

  const [isLoading, setIsLoading] = useState(true);

  const { projectSettings } = useProjectSettings();

  const { locale } = useParams();

  const { projectKey, region } = projectSettings ?? {};

  const { session, isExpired } = useCheckout();

  const { account, logout } = useContext(AccountContext);

  console.log(projectSettings);
  useEffect(() => {
    if (initiatedCheckout.current || !projectKey || !region || !session?.token) return;

    initiatedCheckout.current = true;

    checkoutFlow({
      region,
      projectKey,
      sessionId: session.token,
      locale,
      showTaxes: locale === 'en',
      styles: {
        '--font-family': "'Inter', sans-serif",
        '--button': '#212121',
        '--radio': '#343434',
        '--checkbox': '#343434',
      },
      languageOverrides: {
        orderSummary: {
          discountCode: {
            invalid: {
              singular: translate('cart.voucher-max-usage-singular', {
                defaultMessage:
                  'This discount code can no longer be redeemed as the maximum application has been reached. {codes}',
              }),
              plural: translate('cart.voucher-max-usage-plural', {
                defaultMessage:
                  'Theses discount codes can no longer be redeemed as the maximum application has been reached. {codes}',
              }),
            },
          },
        },
      },
      onInfo: (message) => {
        switch (message.code) {
          case 'checkout_cancelled':
            pushRoute('/cart');
            break;
          case 'checkout_loaded':
            setIsLoading(false);
            break;
          case 'checkout_completed':
            pushRoute(
              `${process.env.NEXT_PUBLIC_COMMERCETOOLS_CHECKOUT_CALLBACK_URL}?orderId=${
                (message.payload as any)?.order?.id //eslint-disable-line
              }`,
            );
        }
      },
    });
  }, [projectKey, region, locale, session, pushRoute, translate]);

  const errorTriggered = useRef(false);

  useEffect(() => {
    if (account?.accountId && isExpired && !errorTriggered.current) {
      errorTriggered.current = true;
      logout().then(() => {
        pushRoute('/login');
        toast.error(translate('checkout.your-token-has-expired'), { position: 'top-right' });
      });
    }
  }, [isExpired, pushRoute, logout, translate, account]);

  const handleGoingBack = useCallback(() => {
    const checkoutIframe = document.getElementById('ctc-wrapper');

    if (checkoutIframe) checkoutIframe.remove();

    window.onpopstate = null;
  }, []);

  useEffect(() => {
    window.onpopstate = handleGoingBack;
  }, [handleGoingBack]);

  return (
    <div className="min-h-screen lg:bg-neutral-200">
      <Header logo={logo} />
      <div className="relative pt-6">
        {/* eslint-disable-next-line tailwindcss/no-custom-classname*/}
        <div data-ctc className="checkout-Container" />
      </div>
      {isLoading && (
        <div className="flex h-[80vh] items-center justify-center">
          <div className="loading-full-screen" />
        </div>
      )}
    </div>
  );
};

export default CommercetoolsCheckout;
