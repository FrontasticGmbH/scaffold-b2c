import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { checkout, init } from '@commercetools/checkout-browser-sdk';
import toast from 'react-hot-toast';
import useTranslation from 'providers/i18n/hooks/useTranslation';
import { useCart, useProjectSettings, useCheckoutToken, useAccount } from 'frontastic';
import { CheckoutWrappedProps } from '..';
import Header from '../components/header';

const CommercetoolsCheckout = ({ logo }: CheckoutWrappedProps) => {
  const { push: pushRoute } = useRouter();

  const { translate } = useTranslation();

  const initiatedCheckout = useRef(false);

  const [isLoading, setIsLoading] = useState(true);

  const { data: cart } = useCart();

  const { data: projectSettings } = useProjectSettings();

  const { locale } = useParams();

  const { projectKey } = projectSettings ?? {};

  const { accessToken, isExpired } = useCheckoutToken();

  const { account, logout } = useAccount();

  const applicationId = useMemo(() => {
    return locale === 'en'
      ? process.env.NEXT_PUBLIC_COMMERCETOOLS_CHECKOUT_APPLICATION_ID_EN
      : process.env.NEXT_PUBLIC_COMMERCETOOLS_CHECKOUT_APPLICATION_ID_DE;
  }, [locale]);

  useEffect(() => {
    if (initiatedCheckout.current || !projectKey || !cart || !accessToken) return;

    initiatedCheckout.current = true;

    const host = typeof window !== 'undefined' ? window.location.origin : '';

    init({
      checkoutConfig: {},
      onInfo: (message) => {
        switch (message.code) {
          case 'checkout_cancelled':
            pushRoute('/cart');
            break;
          case 'checkout_loaded':
            setIsLoading(false);
            break;
        }
      },
    });

    checkout({
      host: process.env.NEXT_PUBLIC_COMMERCETOOLS_CHECKOUT_HOST,
      sellerId: projectKey,
      applicationId,
      callbackUrl: `${host}/${process.env.NEXT_PUBLIC_COMMERCETOOLS_CHECKOUT_CALLBACK_URL}`,
      cartId: cart.cartId,
      accessToken,
      locale,
      showTaxes: locale === 'en',
      styles: {
        '--font-family': "'Inter', sans-serif",
        '--button': '#212121',
        '--radio': '#343434',
        '--checkbox': '#343434',
      },
    });
  }, [projectKey, cart, locale, accessToken, applicationId, pushRoute]);

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
