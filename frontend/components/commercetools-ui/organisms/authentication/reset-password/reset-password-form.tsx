import React, { FC, useState } from 'react';
import { useTranslations } from 'use-intl';
import Button from 'components/commercetools-ui/atoms/button';
import { InputProps } from 'components/commercetools-ui/atoms/input';
import PasswordInput from 'components/commercetools-ui/atoms/input-password';
import Link from 'components/commercetools-ui/atoms/link';
import Typography from 'components/commercetools-ui/atoms/typography';
import { resolveReferenceTarget } from 'helpers/reference';
import { useRouter } from 'i18n/routing';
import { ResetPasswordProps } from '.';

const ResetPasswordForm: FC<ResetPasswordProps> = ({ accountLink, signInLink, resetPassword }) => {
  //i18n messages
  const translate = useTranslations();

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
    if (!passwordsMatch) setError(translate('error.password-noMatch'));

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
        setError(translate('error.account-create-fail'));
      } else {
        setError('');
        router?.push(resolveReferenceTarget(accountLink) as string);
      }
    } catch (err) {
      setError(translate('error.wentWrong'));
    }
    //processing ends
    setLoading(false);
  };
  return (
    <>
      <Typography as="h3" className="mb-16 text-16 md:mb-24 md:text-20 lg:text-24">
        {translate('account.password-reset-headline')}
      </Typography>

      <form onSubmit={handleSubmit}>
        {error && <Typography className="mb-12 text-12 capitalize text-red-500">{error}</Typography>}

        <PasswordInput
          required
          id="password"
          name="password"
          autoComplete="current-password"
          placeholder={translate('account.password')}
          className="mb-16 md:mb-20"
          onChange={handleChange}
        />

        <PasswordInput
          required
          id="confirm-password"
          name="confirmPassword"
          autoComplete="current-password"
          placeholder={translate('account.password-confirm')}
          className="mb-16 md:mb-20"
          onChange={handleChange}
        />

        <Button size="full" type="submit" className="mb-16 text-16 leading-tight md:mb-20" disabled={loading}>
          {translate('account.password-reset-keyword')}
        </Button>

        <Link variant="menu-item" className="mx-auto block w-fit text-14" link={signInLink}>
          {translate('account.account-back-sign')}
        </Link>
      </form>
    </>
  );
};

export default ResetPasswordForm;
