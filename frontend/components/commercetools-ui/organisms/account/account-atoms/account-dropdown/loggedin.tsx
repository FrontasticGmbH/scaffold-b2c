import React, { useContext } from 'react';
import { useTranslations } from 'use-intl';
import Link from 'components/commercetools-ui/atoms/link';
import Typography from 'components/commercetools-ui/atoms/typography';
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
        <Typography className="text-primary hover:underline">{translate('account.my-account')}</Typography>
      </Link>

      <Link link="/account/?hash=support" className="mt-32 block w-fit">
        <Typography className="text-primary hover:underline">{translate('account.customer-support')}</Typography>
      </Link>

      <button onClick={handleLogout} className="mt-32 w-fit text-left">
        <Typography className="text-16 text-primary hover:underline">{translate('account.sign-out')}</Typography>
      </button>
    </div>
  );
};

export default LoggedIn;
