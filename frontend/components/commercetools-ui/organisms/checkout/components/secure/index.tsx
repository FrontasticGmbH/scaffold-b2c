import React from 'react';
import { useTranslations } from 'use-intl';

const Secure = () => {
  const translate = useTranslations();

  return (
    <div className="my-24 hidden border-b border-b-neutral-400 bg-neutral-200 pb-24 lg:block">
      <p className="text-22 capitalize">{translate('checkout.secure-checkout')}</p>
    </div>
  );
};

export default Secure;
