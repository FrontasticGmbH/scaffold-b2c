import React, { useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
//import { checkout } from '@commercetools/checkout-browser-sdk';
//import { getLocalizationInfo } from 'project.config';
import { useAccount, useCart, useProjectSettings } from 'frontastic';
import { CheckoutWrappedProps } from '..';
import Header from '../components/header';

const CommercetoolsCheckout = ({ logo, ...emptyState }: CheckoutWrappedProps) => {
  const initiatedCheckout = useRef(false);

  const { data: cart } = useCart();

  const { account } = useAccount();
  console.log(account);

  const { data: projectSettings } = useProjectSettings();

  const { locale } = useParams();

  const { projectKey } = projectSettings ?? {};

  useEffect(() => {
    if (initiatedCheckout.current || !projectKey || !cart) return;

    initiatedCheckout.current = true;

    //const info = getLocalizationInfo(locale);

    // checkout({
    //   host: process.env.NEXT_PUBLIC_COMMERCETOOLS_CHECKOUT_HOST,
    //   sellerId: projectKey,
    //   applicationId: process.env.NEXT_PUBLIC_COMMERCETOOLS_CHECKOUT_APPLICATION_ID,
    //   callbackUrl: process.env.NEXT_PUBLIC_COMMERCETOOLS_CHECKOUT_CALLBACK_URL,
    //   cartId: cart.cartId,
    //   accessToken: '{accessToken}',
    //   locale: info.locale,
    // });
  }, [projectKey, cart, locale]);

  return (
    <div className="min-h-screen lg:bg-neutral-200">
      <Header logo={logo} {...emptyState} />
      <div className="relative">
        <div data-ctc />
      </div>
    </div>
  );
};

export default CommercetoolsCheckout;
