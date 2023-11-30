'use client';

import React, { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Login, { LoginProps } from 'components/commercetools-ui/organisms/authentication/login';
import Redirect from 'helpers/redirect';
import { useAccount } from 'frontastic/hooks';
import { TasticProps } from 'frontastic/tastics/types';

const AccountLoginTastic = ({ data }: TasticProps<LoginProps>) => {
  const searchParams = useSearchParams();

  const lvp = searchParams.get('lvp');

  //redirection link after user is logged in
  const redirectLink = useMemo(() => {
    const lastVisitedPage = lvp ? `/${lvp}` : data.accountLink;
    return lastVisitedPage;
  }, [data.accountLink, lvp]);

  const { loggedIn } = useAccount();

  if (loggedIn) return <Redirect target={redirectLink} />;

  return (
    <div className="mb-36 md:mb-56 lg:mb-84">
      <Login {...data} />
    </div>
  );
};

export default AccountLoginTastic;
