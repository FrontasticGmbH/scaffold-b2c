import React from 'react';
import { useTranslations } from 'use-intl';
import Link from 'components/commercetools-ui/atoms/link';

const Footer = () => {
  const translate = useTranslations();

  return (
    <div className="mt-24 px-16 pb-36 md:mt-26 lg:mt-72">
      <p className="text-center text-12 text-gray-600">
        {translate('cart.terms-agree')}{' '}
        <Link link="#" className="underline decoration-gray-600 underline-offset-2">
          {translate('cart.terms-and-conditions')}
          {/* eslint-disable-next-line react/jsx-no-literals */}
        </Link>{' '}
        of The B2C Retail Store
      </p>
    </div>
  );
};

export default Footer;
