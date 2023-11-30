import React, { FC } from 'react';
import { Reference } from 'types/reference';
import ResetPasswordForm from './reset-password-form';
import AlterForm from '../../account/account-atoms/alter-form';

export interface ResetPasswordProps {
  token?: string | string[];
  accountLink: Reference;
  signInLink: Reference;
}

const ResetPassword: FC<ResetPasswordProps> = ({ token, accountLink, signInLink }) => {
  return (
    <>
      <div className="m-auto grid max-w-[480px] px-16">
        <ResetPasswordForm token={token} accountLink={accountLink} signInLink={signInLink} />
      </div>
      <AlterForm page="register" />
    </>
  );
};

export default ResetPassword;
