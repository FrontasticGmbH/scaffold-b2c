import React, { FC, useState } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import Button from 'components/commercetools-ui/atoms/button';
import Checkbox, { CheckboxProps } from 'components/commercetools-ui/atoms/checkbox';
import Input from 'components/commercetools-ui/atoms/input';
import PasswordInput from 'components/commercetools-ui/atoms/input-password';
import Link from 'components/commercetools-ui/atoms/link';
import Typography from 'components/commercetools-ui/atoms/typography';
import { useFormat } from 'helpers/hooks/useFormat';
import { useAccount } from 'frontastic';
import Feedback from '../../account/account-atoms/feedback';

interface Props {
  onLogin?: () => void;
}

const LoginForm: FC<Props> = ({ onLogin }) => {
  //i18n messages
  const { formatMessage: formatErrorMessage } = useFormat({ name: 'error' });
  const { formatMessage: formatAccountMessage } = useFormat({ name: 'account' });
  const { formatMessage } = useFormat({ name: 'common' });

  //account actions
  const { login, requestConfirmationEmail, requestPasswordReset } = useAccount();

  //login data
  const [data, setData] = useState({ email: '', password: '', rememberMe: false });

  //error
  const [error, setError] = useState('');

  //success
  const [success, setSuccess] = useState('');

  //processing...
  const [loading, setLoading] = useState(false);

  //attempting to resend verification email
  const [resendVerification, setResendVerification] = useState(false);

  //attempting to request a password reset
  const [resendPasswordReset, setResendPasswordReset] = useState(false);

  //not on default login modal
  const subModal = resendVerification || resendPasswordReset;

  const resetFeedback = () => {
    setError('');
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

  //handle text input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  //handle checkbox input change
  const handleCheckboxChange: CheckboxProps['onChange'] = ({ name, checked }) => {
    setData({ ...data, [name]: checked });
  };

  //login user
  const loginUser = async () => {
    try {
      const response = await login(data.email, data.password, data.rememberMe);

      if (response.accountId) onLogin?.();
      else setError(formatErrorMessage({ id: 'auth.wrong', defaultMessage: 'Wrong email address or password' }));
    } catch (err) {
      setError(formatErrorMessage({ id: 'wentWrong', defaultMessage: 'Sorry. Something went wrong..' }));
    }
  };

  //resend verification email for user
  const resendVerificationEmailForUser = async () => {
    try {
      const response = await requestConfirmationEmail(data.email, data.password);

      if (response.error)
        setError(formatErrorMessage({ id: 'wentWrong', defaultMessage: 'Sorry. Something went wrong..' }));
      else {
        setSuccess(
          formatAccountMessage({
            id: 'verification.resent',
            defaultMessage: 'An email was sent to {email}',
            values: { email: data.email },
          }),
        );
      }
    } catch (err) {
      setError(formatErrorMessage({ id: 'wentWrong', defaultMessage: 'Sorry. Something went wrong..' }));
    }
  };

  //request a password reset for user
  const resendPasswordResetForUser = async () => {
    try {
      const response = await requestPasswordReset(data.email);

      if (response.error)
        setError(formatErrorMessage({ id: 'wentWrong', defaultMessage: 'Sorry. Something went wrong..' }));
      else {
        setSuccess(
          formatAccountMessage({
            id: 'verification.resent',
            defaultMessage: 'An email was sent to {email}',
            values: { email: data.email },
          }),
        );
      }
    } catch (err) {
      setError(formatErrorMessage({ id: 'wentWrong', defaultMessage: 'Sorry. Something went wrong..' }));
    }
  };

  //form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //processing starts
    setLoading(true);
    //if user is attempting to resend verification email
    if (resendVerification) resendVerificationEmailForUser();
    //if user is attempting tor equest a password reset
    else if (resendPasswordReset) resendPasswordResetForUser();
    //if user wants to login
    else loginUser();
    //processing ends
    setLoading(false);
  };
  return (
    <>
      <Typography as="h3" className="mb-16 text-16 md:mb-24 md:text-20 lg:text-24">
        {resendPasswordReset
          ? formatAccountMessage({ id: 'password.reset.headline', defaultMessage: 'Reset your password' })
          : formatAccountMessage({ id: 'welcome.back', defaultMessage: 'Welcome back' })}
      </Typography>

      <form onSubmit={handleSubmit}>
        <Feedback success={success} error={error} />

        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mb-16 md:mb-20"
          placeholder={formatMessage({ id: 'emailAddress', defaultMessage: 'Email Address' })}
          onChange={handleChange}
        />

        {!resendPasswordReset && (
          <PasswordInput
            required
            id="password"
            name="password"
            autoComplete="current-password"
            placeholder={formatAccountMessage({ id: 'password', defaultMessage: 'Password' })}
            className="mb-16 md:mb-20"
            onChange={handleChange}
          />
        )}

        {subModal ? (
          <div>
            <ArrowLeftIcon className="w-4 cursor-pointer" onClick={backToLogin} />
          </div>
        ) : (
          <div className="mb-30 flex items-center justify-between">
            <Checkbox
              id="remember-me"
              name="rememberMe"
              onChange={handleCheckboxChange}
              label={formatMessage({ id: 'rememberMe', defaultMessage: 'Remember me' })}
            />

            <Typography
              className="cursor-pointer text-12 text-secondary-black hover:underline md:text-14"
              onClick={toResendPassword}
            >
              {formatAccountMessage({ id: 'password.forgot', defaultMessage: 'Forgot your password?' })}
            </Typography>
          </div>
        )}

        <Button
          size="full"
          type="submit"
          className="mb-16 text-16 font-medium leading-tight md:mb-20"
          disabled={loading}
        >
          {resendPasswordReset
            ? formatAccountMessage({ id: 'account.reset.link', defaultMessage: 'Get reset link' })
            : formatAccountMessage({ id: 'sign.in', defaultMessage: 'Sign in' })}
        </Button>

        {resendPasswordReset && (
          <Link
            variant="menu-item"
            className="mx-auto block w-fit cursor-pointer text-14"
            link=""
            onClick={backToLogin}
          >
            {formatAccountMessage({ id: 'account.back.sign', defaultMessage: 'Back to sign in' })}
          </Link>
        )}
      </form>
    </>
  );
};

export default LoginForm;
