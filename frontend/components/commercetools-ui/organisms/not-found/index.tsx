import React from 'react';
import { useTranslations } from 'use-intl';
import Button from 'components/commercetools-ui/atoms/button';
import Image from 'components/commercetools-ui/atoms/image';
import Link from 'components/commercetools-ui/atoms/link';

const NotFound = () => {
  const translate = useTranslations();

  return (
    <div className="my-175 flex w-full flex-col items-center justify-center gap-0 lg:flex-row-reverse lg:gap-64">
      <div className="relative mx-10 w-126 md:w-200 lg:w-350">
        <Image
          src="/images/shy-lens.png"
          alt={translate('common.page-notFound')}
          style={{ width: '100%', height: 'auto' }}
        />
      </div>
      <div className="mx-60 mt-24 text-center md:mx-0 lg:mt-0 lg:text-left">
        <h1 className="text-32 leading-[1.25]">{translate('common.page-notFound')}</h1>
        <p className="mb-24 mt-12 leading-[1.5] lg:mb-28 lg:mt-24">{translate('common.page-notFound-desc')}</p>
        <Link link="/">
          <Button variant="primary">{translate('common.page-notFound-cta')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
