import React, { useContext } from 'react';
import { useTranslations } from 'use-intl';
import Link from 'components/commercetools-ui/atoms/link';
import { AccountContext } from 'context/account';
import { useRouter } from 'i18n/routing';

const LoggedIn = () => {
  const router = useRouter();
  const translate = useTranslations();
  const { logout } = useContext(AccountContext);

  const handleLogout = () => {
    logout().then(() => router.push('/login'));
  };

  return (
    <div className="w-235 p-14 pb-24">
      <Link link="/account#" className="mt-10 block w-fit">
        <p className="text-primary hover:underline">{translate('account.my-account')}</p>
      </Link>

      <Link link="/account/?hash=support" className="mt-32 block w-fit">
        <p className="text-primary hover:underline">{translate('account.customer-support')}</p>
      </Link>

      <button onClick={handleLogout} className="mt-32 w-fit text-left">
        <p className="text-16 text-primary hover:underline">{translate('account.sign-out')}</p>
      </button>
    </div>
  );
};

export default LoggedIn;
