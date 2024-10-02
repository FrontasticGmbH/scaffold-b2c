'use client';

import React, { useContext } from 'react';
import Register from 'components/commercetools-ui/organisms/authentication/register';
import { RegisterFormProps } from 'components/commercetools-ui/organisms/authentication/register/register-form';
import { AccountContext } from 'context/account';
import { TasticProps } from 'frontastic/tastics/types';

const AccountRegisterTastic = ({ data }: TasticProps<RegisterFormProps>) => {
  const { register, loggedIn } = useContext(AccountContext);

  return <Register {...data} register={register} loggedIn={loggedIn} />;
};

export default AccountRegisterTastic;
