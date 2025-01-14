'use client';

import React, { useCallback, useContext, useState } from 'react';
import Register from 'components/commercetools-ui/organisms/authentication/register';
import { RegisterFormProps } from 'components/commercetools-ui/organisms/authentication/register/register-form';
import { AccountContext } from 'context/account';
import { TasticProps } from 'frontastic/tastics/types';

const AccountRegisterTastic = ({ data }: TasticProps<RegisterFormProps>) => {
  const { register, loggedIn } = useContext(AccountContext);

  const [accountId, setAccountId] = useState('');

  const handleRegister = useCallback(
    async (...params: Parameters<typeof register>) => {
      const res = await register(...params);

      if (res.success) setAccountId(res.account.accountId as string);

      return res;
    },
    [register],
  );

  return (
    <div data-testid={accountId ? `customer-${accountId}` : ''}>
      <Register {...data} register={handleRegister} loggedIn={loggedIn} />
    </div>
  );
};

export default AccountRegisterTastic;
