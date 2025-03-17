import React from 'react';
import { Popover } from '@headlessui/react';
import { useTranslations } from 'use-intl';
import Button from 'components/commercetools-ui/atoms/button';
import Link from 'components/commercetools-ui/atoms/link';
import { useRouter } from 'i18n/routing';

const LoggedOut = () => {
  const router = useRouter();
  const translate = useTranslations();

  const goToLoginPage = () => router.push('/login');

  return (
    <div className="w-235 p-14">
      <Popover.Button as="div" className="w-full" tabIndex={-1}>
        <Button variant="primary" className="w-full py-12 text-16 leading-[16px]" onClick={goToLoginPage}>
          {translate('account.sign-in')}
        </Button>
      </Popover.Button>
      <Popover.Button tabIndex={-1}>
        <Link link="/" className="mt-20 block w-fit text-primary hover:underline">
          {translate('account.membership-info')}
        </Link>
      </Popover.Button>
      <div className="mt-32 flex pb-10">
        <span className="whitespace-nowrap">{translate('account.not-member')}</span>
        <Popover.Button tabIndex={-1}>
          <Link link="/register" className="ml-4 whitespace-nowrap font-medium text-primary hover:underline">
            {translate('account.join-here')}
          </Link>
        </Popover.Button>
      </div>
    </div>
  );
};

export default LoggedOut;
