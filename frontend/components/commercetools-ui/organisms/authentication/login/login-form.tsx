import React, { FC, useState } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useTranslations } from 'use-intl';
import Button from 'components/commercetools-ui/atoms/button';
import Checkbox, { CheckboxProps } from 'components/commercetools-ui/atoms/checkbox';
import Input from 'components/commercetools-ui/atoms/input';
import PasswordInput from 'components/commercetools-ui/atoms/input-password';
import Link from 'components/commercetools-ui/atoms/link';
import { EMAIL_REGX } from 'helpers/constants/auth';
import { Account } from 'types/entity/account';
import Feedback from '../../account/account-atoms/feedback';

interface Props {
  login?: (email: string, password: string, rememberMe?: boolean) => Promise<Account>;
  requestConfirmationEmail?: (email: string, password: string) => Promise<{ error?: boolean; message?: string }>;
  requestPasswordReset?: (email: string) => Promise<{ error?: boolean; message?: string }>;
}

interface FormInput {
  email: string;
  password: string;
  rememberMe: boolean;
}

const LoginForm: FC<Props> = ({ login, requestConfirmationEmail, requestPasswordReset }) => {
  //i18n messages
  const translate = useTranslations();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setValue,
    setError,
    clearErrors,
  } = useForm<FormInput>();

  //success
  const [success, setSuccess] = useState('');

  //attempting to resend verification email
  const [resendVerification, setResendVerification] = useState(false);

  //attempting to request a password reset
  const [resendPasswordReset, setResendPasswordReset] = useState(false);

  //not on default login modal
  const subModal = resendVerification || resendPasswordReset;

  const resetFeedback = () => {
    clearErrors('root');
    setSuccess('');
  };

  //get back to login modal
  const backToLogin = () => {
    setResendPasswordReset(false);
    setResendVerification(false);
    resetFeedback();
  };

  //requesting a password reset
  const toResendPassword = () => {
    setResendPasswordReset(true);
    setResendVerification(false);
    resetFeedback();
  };

  //handle checkbox input change
  const handleCheckboxChange: CheckboxProps['onChange'] = ({ name, checked }) => {
    setValue(name as 'rememberMe', checked);
  };

  //login user
  const loginUser = async (data: FormInput) => {
    try {
      const response = await login?.(data.email, data.password, data.rememberMe);

      if (!response?.accountId) setError('root', { type: 'custom', message: translate('error.auth-wrong') });
    } catch {
      setError('root', { type: 'root', message: translate('error.wentWrong') });
    }
  };

  //resend verification email for user
  const resendVerificationEmailForUser = async (data: FormInput) => {
    try {
      const response = await requestConfirmationEmail?.(data.email, data.password);

      if (response?.error) setError('root', { type: 'custom', message: translate('error.wentWrong') });
      else {
        setSuccess(translate('account.verification-resent', { email: data.email }));
      }
    } catch {
      setError('root', { type: 'custom', message: translate('error.wentWrong') });
    }
  };

  //request a password reset for user
  const resendPasswordResetForUser = async (data: FormInput) => {
    try {
      const response = await requestPasswordReset?.(data.email);

      if (response?.error) setError('root', { type: 'custom', message: translate('error.wentWrong') });
      else {
        setSuccess(translate('account.verification-resent', { email: data.email }));
      }
    } catch {
      setError('root', { type: 'custom', message: translate('error.wentWrong') });
    }
  };

  //form submission
  const onSubmit: SubmitHandler<FormInput> = (data) => {
    //if user is attempting to resend verification email
    if (resendVerification) resendVerificationEmailForUser(data);
    //if user is attempting tor equest a password reset
    else if (resendPasswordReset) resendPasswordResetForUser(data);
    //if user wants to login
    else loginUser(data);
  };

  return (
    <>
      <h3 className="mb-16 text-16 md:mb-24 md:text-20 lg:text-24">
        {resendPasswordReset ? translate('account.password-reset-headline') : translate('account.welcome-back')}
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Feedback success={success} error={errors.root?.message as string} />
        <div className="flex flex-col gap-16 md:gap-20">
          <Input
            id="email"
            type="email"
            title={translate('common.emailAddress')}
            autoComplete="email"
            placeholder={translate('common.emailAddress')}
            error={errors.email?.message}
            {...register('email', {
              required: translate('common.fieldIsRequired'),
              pattern: {
                message: translate('error.email'),
                value: EMAIL_REGX,
              },
            })}
          />

          {!resendPasswordReset && (
            <PasswordInput
              required
              id="password"
              title={translate('account.password')}
              autoComplete="current-password"
              placeholder={translate('account.password')}
              error={errors.password?.message}
              {...register('password', { required: translate('common.fieldIsRequired') })}
            />
          )}

          {subModal ? (
            <div>
              <ArrowLeftIcon className="w-4 cursor-pointer" onClick={backToLogin} />
            </div>
          ) : (
            <div className="mb-30 flex items-center justify-between">
              <Checkbox id="remember-me" label={translate('common.rememberMe')} onChange={handleCheckboxChange} />

              <button
                className="cursor-pointer text-12 text-gray-600 hover:underline md:text-14"
                onClick={toResendPassword}
              >
                {translate('account.password-forgot')}
              </button>
            </div>
          )}
        </div>

        <Button
          size="full"
          type="submit"
          className="mb-16 text-16 font-medium leading-tight md:mb-20"
          disabled={isSubmitting}
        >
          {resendPasswordReset ? translate('account.account-reset-link') : translate('account.sign-in')}
        </Button>

        {resendPasswordReset && (
          <Link
            variant="menu-item"
            className="mx-auto block w-fit cursor-pointer text-14"
            link=""
            onClick={backToLogin}
          >
            {translate('account.account-back-sign')}
          </Link>
        )}
      </form>
    </>
  );
};

export default LoginForm;
