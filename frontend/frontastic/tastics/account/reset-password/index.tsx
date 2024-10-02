'use client';

import React, { useContext } from 'react';
import { useSearchParams } from 'next/navigation';
import ResetPassword, { ResetPasswordProps } from 'components/commercetools-ui/organisms/authentication/reset-password';
import { AccountContext } from 'context/account';
import Redirect from 'helpers/redirect';
import { TasticProps } from 'frontastic/tastics/types';

const ResetPasswordTastic = ({ data }: TasticProps<ResetPasswordProps>) => {
  const { resetPassword } = useContext(AccountContext);

  //next/navigation
  const searchParams = useSearchParams();

  //reset password token
  const token = searchParams.get('token');

  if (!token) return <Redirect target="/login" />;

  return <ResetPassword {...data} token={token} resetPassword={(password) => resetPassword(token, password)} />;
};

export default ResetPasswordTastic;
