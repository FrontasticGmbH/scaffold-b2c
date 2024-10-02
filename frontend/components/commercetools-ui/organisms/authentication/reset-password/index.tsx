import React, { FC } from 'react';
import { Account } from 'types/entity/account';
import { Reference } from 'types/reference';
import ResetPasswordForm from './reset-password-form';
import AlterForm from '../../account/account-atoms/alter-form';

export interface ResetPasswordProps {
  token?: string | string[];
  accountLink: Reference;
  signInLink: Reference;
  resetPassword: (password: string) => Promise<Account>;
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
