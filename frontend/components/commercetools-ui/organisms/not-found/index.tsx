import React from 'react';
import { useTranslations } from 'use-intl';
import Button from 'components/commercetools-ui/atoms/button';
import Image, { ImageProps } from 'components/commercetools-ui/atoms/image';
import Link from 'components/commercetools-ui/atoms/link';

type NotFoundProps = {
  image?: ImageProps;
};

const NotFound = ({ image }: NotFoundProps) => {
  const translate = useTranslations();

  return (
    <div className="flex w-full flex-col items-center justify-center gap-0 py-80 md:my-60 md:py-120 lg:flex-row-reverse lg:gap-64">
      <div className="relative mx-10 w-152 md:w-200 lg:w-350">
        <Image {...image} style={{ width: '100%', height: 'auto' }} />
      </div>
      <div className="mx-60 mt-24 text-center md:mx-0 lg:mt-0 lg:text-left">
        <h1 className="text-18 leading-[1.25] text-gray-700 md:text-22 lg:text-32">
          {translate('common.page-notFound')}
        </h1>
        <p className="mb-24 mt-12 text-sm leading-[1.5] text-gray-600 md:text-16 lg:mb-28 lg:mt-24">
          {translate('common.page-notFound-desc')}
        </p>
        <Link link="/">
          <Button variant="primary">{translate('common.page-notFound-cta')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
