import React, { useRef, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useFormat } from 'helpers/hooks/useFormat';
import { Account } from 'types/entity/account';
import { Reference } from 'types/reference';
import LoginForm from './login-form';
import AlterForm from '../../account/account-atoms/alter-form';

export interface LoginProps {
  signInLink: Reference;
  accountLink?: Reference;
  login?: (email: string, password: string, rememberMe?: boolean) => Promise<Account>;
  requestConfirmationEmail?: (email: string, password: string) => Promise<{ error?: boolean; message?: string }>;
  requestPasswordReset?: (email: string) => Promise<{ error?: boolean; message?: string }>;
}

const Login: React.FC<LoginProps> = ({ login, requestConfirmationEmail, requestPasswordReset }) => {
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
      <div className="m-auto grid max-w-screen-sm px-16">
        <LoginForm
          login={login}
          requestConfirmationEmail={requestConfirmationEmail}
          requestPasswordReset={requestPasswordReset}
        />
      </div>
      <AlterForm page="register" />
    </>
  );
};

export default Login;
