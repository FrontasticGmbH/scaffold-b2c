import React from 'react';
import { Reference } from 'types/reference';
import LoginForm from './login-form';
import AlterForm from '../../account/account-atoms/alter-form';

export interface LoginProps {
  signInLink: Reference;
  accountLink?: Reference;
  onLogin?: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <>
      <div className="m-auto grid max-w-[480px] px-16">
        <LoginForm onLogin={onLogin} />
      </div>
      <AlterForm page="register" />
    </>
  );
};

export default Login;
