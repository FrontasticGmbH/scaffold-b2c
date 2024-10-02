import React, { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from 'components/commercetools-ui/atoms/button';
import { InputProps } from 'components/commercetools-ui/atoms/input';
import PasswordInput from 'components/commercetools-ui/atoms/input-password';
import Link from 'components/commercetools-ui/atoms/link';
import Typography from 'components/commercetools-ui/atoms/typography';
import { useFormat } from 'helpers/hooks/useFormat';
import { resolveReferenceTarget } from 'helpers/reference';
import { ResetPasswordProps } from '.';

const ResetPasswordForm: FC<ResetPasswordProps> = ({ accountLink, signInLink, resetPassword }) => {
  //i18n messages
  const { formatMessage: formatErrorMessage } = useFormat({ name: 'error' });
  const { formatMessage: formatAccountMessage } = useFormat({ name: 'account' });

  //next/navigation
  const router = useRouter();

  //register data
  const [data, setData] = useState({ email: '', password: '', confirmPassword: '' });

  //error
  const [error, setError] = useState('');

  //processing...
  const [loading, setLoading] = useState(false);

  //handle text input change
  const handleChange: InputProps['onChange'] = ({ target: { name, value } }) => {
    setData({ ...data, [name]: value });
  };

  //data validation
  const validate = () => {
    //validation schema
    const passwordsMatch = data.password === data.confirmPassword;

    //UI error messages
    if (!passwordsMatch)
      setError(formatErrorMessage({ id: 'password.noMatch', defaultMessage: "Passwords don't match" }));

    //return a boolean representing the data validity
    return passwordsMatch;
  };

  //form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //validate data
    if (!validate()) return;
    //processing starts
    setLoading(true);
    //try registering the user with given credentials
    try {
      const response = await resetPassword(data.password);
      if (!response.accountId) {
        setError(
          formatErrorMessage({ id: 'account.create.fail', defaultMessage: "Sorry. We couldn't create your account.." }),
        );
      } else {
        setError('');
        router?.push(resolveReferenceTarget(accountLink) as string);
      }
    } catch (err) {
      setError(formatErrorMessage({ id: 'wentWrong', defaultMessage: 'Sorry. Something went wrong..' }));
    }
    //processing ends
    setLoading(false);
  };
  return (
    <>
      <Typography as="h3" className="mb-16 text-16 md:mb-24 md:text-20 lg:text-24">
        {formatAccountMessage({ id: 'password.reset.headline', defaultMessage: 'Reset your password' })}
      </Typography>

      <form onSubmit={handleSubmit}>
        {error && <Typography className="mb-12 text-12 capitalize text-accent-red">{error}</Typography>}

        <PasswordInput
          required
          id="password"
          name="password"
          autoComplete="current-password"
          placeholder={formatAccountMessage({ id: 'password', defaultMessage: 'Password' })}
          className="mb-16 md:mb-20"
          onChange={handleChange}
        />

        <PasswordInput
          required
          id="confirm-password"
          name="confirmPassword"
          autoComplete="current-password"
          placeholder={formatAccountMessage({ id: 'password.confirm', defaultMessage: 'Confirm Password' })}
          className="mb-16 md:mb-20"
          onChange={handleChange}
        />

        <Button size="full" type="submit" className="mb-16 text-16 leading-tight md:mb-20" disabled={loading}>
          {formatAccountMessage({ id: 'password.reset.keyword', defaultMessage: 'Reset' })}
        </Button>

        <Link variant="menu-item" className="mx-auto block w-fit text-14" link={signInLink}>
          {formatAccountMessage({ id: 'account.back.sign', defaultMessage: 'Back to sign in' })}
        </Link>
      </form>
    </>
  );
};

export default ResetPasswordForm;
