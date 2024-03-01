import React, { useRef, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useFormat } from 'helpers/hooks/useFormat';
import { Reference } from 'types/reference';
import LoginForm from './login-form';
import AlterForm from '../../account/account-atoms/alter-form';

export interface LoginProps {
  signInLink: Reference;
  accountLink?: Reference;
  onLogin?: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const router = useRouter();

  const { formatMessage: formatAccountMessage } = useFormat({ name: 'account' });

  const searchParams = useSearchParams();

  const verify = searchParams.get('verify');

  const responded = useRef(false);

  useEffect(() => {
    if (!verify || responded.current) return;

    if (verify === '0')
      toast.error(formatAccountMessage({ id: 'verification.failed', defaultMessage: 'Invalid token' }));
    else toast.success(formatAccountMessage({ id: 'verification.done', defaultMessage: 'Email verified' }));

    responded.current = true;
  }, [verify, router, formatAccountMessage]);

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
