import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { checkout, init } from '@commercetools/checkout-browser-sdk';
import toast from 'react-hot-toast';
import useTranslation from 'providers/i18n/hooks/useTranslation';
import { useProjectSettings, useCheckout, useAccount } from 'frontastic';
import { CheckoutWrappedProps } from '..';
import Header from '../components/header';

const CommercetoolsCheckout = ({ logo }: CheckoutWrappedProps) => {
  const { push: pushRoute } = useRouter();

  const { translate } = useTranslation();

  const initiatedCheckout = useRef(false);

  const [isLoading, setIsLoading] = useState(true);

  const { data: projectSettings } = useProjectSettings();

  const { locale } = useParams();

  const { projectKey } = projectSettings ?? {};

  const { session, isExpired } = useCheckout();

  const { account, logout } = useAccount();

  useEffect(() => {
    if (initiatedCheckout.current || !projectKey || !session?.token) return;

    initiatedCheckout.current = true;

    init({
      checkoutConfig: {
        region: process.env.NEXT_PUBLIC_COMMERCETOOLS_CHECKOUT_REGION,
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

    checkout({});
  }, [projectKey, locale, session, pushRoute]);

  const errorTriggered = useRef(false);

  useEffect(() => {
    if (account?.accountId && isExpired && !errorTriggered.current) {
      errorTriggered.current = true;
      logout().then(() => {
        pushRoute('/login');
        toast.error(translate('checkout.your.token.has.expired'), { position: 'top-right' });
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
