'use client';

import React, { useContext, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Login, { LoginProps } from 'components/commercetools-ui/organisms/authentication/login';
import { AccountContext } from 'context/account';
import Redirect from 'helpers/redirect';
import { TasticProps } from 'frontastic/tastics/types';

const AccountLoginTastic = ({ data }: TasticProps<LoginProps>) => {
  const searchParams = useSearchParams();

  const lvp = searchParams.get('lvp');

  //redirection link after user is logged in
  const redirectLink = useMemo(() => {
    const lastVisitedPage = lvp ? `/${lvp}` : data.accountLink;
    return lastVisitedPage;
  }, [data.accountLink, lvp]);

  const { loggedIn, login, requestConfirmationEmail, requestPasswordReset } = useContext(AccountContext);

  if (loggedIn) return <Redirect target={redirectLink} />;

  return (
    <div className="mb-36 md:mb-56 lg:mb-84">
      <Login
        {...data}
        login={login}
        requestConfirmationEmail={requestConfirmationEmail}
        requestPasswordReset={requestPasswordReset}
      />
    </div>
  );
};

export default AccountLoginTastic;
