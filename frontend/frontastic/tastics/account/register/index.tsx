'use client';

import React from 'react';
import Register from 'components/commercetools-ui/organisms/authentication/register';
import { RegisterFormProps } from 'components/commercetools-ui/organisms/authentication/register/register-form';
import { TasticProps } from 'frontastic/tastics/types';

const AccountRegisterTastic = ({ data }: TasticProps<RegisterFormProps>) => {
  return <Register {...data} />;
};

export default AccountRegisterTastic;
