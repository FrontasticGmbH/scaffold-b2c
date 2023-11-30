'use client';

import React from 'react';
import Register, { RegisterProps } from 'components/commercetools-ui/organisms/authentication/register';
import { TasticProps } from 'frontastic/tastics/types';

const AccountRegisterTastic = ({ data }: TasticProps<RegisterProps>) => {
  return <Register {...data} />;
};

export default AccountRegisterTastic;
