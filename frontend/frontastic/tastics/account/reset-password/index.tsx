'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import ResetPassword, { ResetPasswordProps } from 'components/commercetools-ui/organisms/authentication/reset-password';
import Redirect from 'helpers/redirect';
import { TasticProps } from 'frontastic/tastics/types';

const ResetPasswordTastic = ({ data }: TasticProps<ResetPasswordProps>) => {
  //next/navigation
  const searchParams = useSearchParams();

  //reset password token
  const token = searchParams.get('token');

  if (!token) return <Redirect target="/login" />;

  return <ResetPassword token={token} {...data} />;
};

export default ResetPasswordTastic;
