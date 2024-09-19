import React from 'react';
import { Reference } from 'types/reference';
import RegisterForm from './register-form';
import AlterForm from '../../account/account-atoms/alter-form';

export interface RegisterProps {
  termsOfUseLink?: Reference;
}

const Register: React.FC<RegisterProps> = ({ termsOfUseLink }) => {
  return (
    <>
      <div className="m-auto grid max-w-screen-sm px-16">
        <RegisterForm termsOfUseLink={termsOfUseLink} />
      </div>
      <AlterForm page="login" />
    </>
  );
};

export default Register;
