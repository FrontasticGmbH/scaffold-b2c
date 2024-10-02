import React from 'react';
import Button from 'components/commercetools-ui/atoms/button';
import Image from 'components/commercetools-ui/atoms/image';
import Link from 'components/commercetools-ui/atoms/link';
import { useFormat } from 'helpers/hooks/useFormat';

const NotFound = () => {
  const { formatMessage } = useFormat({ name: 'common' });

  return (
    <div className="relative h-[80vh] lg:h-[60vh]">
      <div className="absolute left-1/2 top-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-0 pb-60 lg:flex-row-reverse lg:gap-50">
        <div className="relative size-300 lg:size-350">
          <Image
            src="/images/shy-lens.png"
            alt={formatMessage({ id: 'page.notFound', defaultMessage: 'Page not found' })}
          />
        </div>
        <div className="mt-5 text-center lg:text-left">
          <h1 className="text-32">{formatMessage({ id: 'page.notFound', defaultMessage: 'Page not found' })}</h1>
          <p className="mt-24">
            {formatMessage({
              id: 'page.notFound.desc',
              defaultMessage:
                "The page you were looking for couldn't be found. It may have been deleted, renamed, or doesn't exist.",
            })}
          </p>
          <Link link="/">
            <Button variant="primary" className="mt-28 px-48 py-12 text-16 font-medium">
              {formatMessage({ id: 'page.notFound.cta', defaultMessage: 'Go back home' })}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
