import React, { FC } from 'react';
import { Reference } from 'types/reference';
import { UseAccountReturn } from 'frontastic/hooks/useAccount/types';
import ResetPasswordForm from './reset-password-form';
import AlterForm from '../../account/account-atoms/alter-form';

export interface ResetPasswordProps {
  token?: string | string[];
  accountLink: Reference;
  signInLink: Reference;
  resetPassword: UseAccountReturn['resetPassword'];
}

const ResetPassword: FC<ResetPasswordProps> = ({ token, accountLink, signInLink, resetPassword }) => {
  return (
    <>
      <div className="m-auto grid max-w-screen-sm px-16">
        <ResetPasswordForm
          token={token}
          accountLink={accountLink}
          signInLink={signInLink}
          resetPassword={resetPassword}
        />
      </div>
      <AlterForm page="register" />
    </>
  );
};

export default ResetPassword;
