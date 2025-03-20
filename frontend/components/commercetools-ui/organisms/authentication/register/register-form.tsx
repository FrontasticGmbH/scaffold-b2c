import React, { FC, useState } from 'react';
import { useTranslations } from 'use-intl';
import Button from 'components/commercetools-ui/atoms/button';
import Input from 'components/commercetools-ui/atoms/input';
import PasswordInput from 'components/commercetools-ui/atoms/input-password';
import Link from 'components/commercetools-ui/atoms/link';
import useValidate from 'helpers/hooks/useValidate';
import Redirect from 'helpers/redirect';
import { Reference } from 'types/reference';
import { UseAccountReturn } from 'frontastic/hooks/useAccount/types';
import Feedback from '../../account/account-atoms/feedback';

export interface RegisterFormProps {
  termsOfUseLink?: Reference;
  loggedIn: UseAccountReturn['loggedIn'];
  register: UseAccountReturn['register'];
}

const RegisterForm: FC<RegisterFormProps> = ({ termsOfUseLink, loggedIn, register }) => {
  const translate = useTranslations();

  const { validatePassword } = useValidate();

  //register data
  const [data, setData] = useState({ firstName: '', lastName: '', email: '', password: '' });

  //error
  const [error, setError] = useState('');

  //success
  const [success, setSuccess] = useState('');

  //processing...
  const [loading, setLoading] = useState(false);

  //handle text input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  //data validation
  const validate = () => {
    const validPassword = validatePassword(data.password);

    //UI error messages
    if (!validPassword) setError(translate('error.password-not-valid'));
    setSuccess('');

    //return a boolean representing the data validity
    return validPassword;
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
      const response = await register(data);
      if (!response.success) {
        setError(response.error?.message || translate('error.account-create-fail'));
        setSuccess('');
      } else {
        setSuccess(translate('account.verification-email-sent'));
        setError('');
      }
    } catch (err) {
      setError(translate('error.wentWrong'));
      setSuccess('');
    }
    //processing ends
    setLoading(false);
  };

  if (loggedIn) return <Redirect target="/account" />;

  return (
    <>
      <h3 className="mb-16 text-16 md:mb-24 md:text-20 lg:text-24">{translate('account.become-member')}</h3>
      <form onSubmit={handleSubmit}>
        <Feedback success={success} error={error} />

        <Input
          id="name"
          name="firstName"
          type="text"
          autoComplete="firstName"
          required
          className="mb-16 md:mb-20"
          placeholder={translate('common.firstName')}
          onChange={handleChange}
        />

        <Input
          id="name"
          name="lastName"
          type="text"
          autoComplete="lastName"
          required
          className="mb-16 md:mb-20"
          placeholder={translate('common.lastName')}
          onChange={handleChange}
        />

        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mb-16 md:mb-20"
          placeholder={translate('common.emailAddress')}
          onChange={handleChange}
        />

        <PasswordInput
          required
          id="password"
          name="password"
          autoComplete="current-password"
          placeholder={translate('account.password')}
          className="mb-16 md:mb-20"
          onChange={handleChange}
        />

        <Button size="full" type="submit" className="mb-16 text-16 leading-tight md:mb-20" disabled={loading}>
          {translate('account.account-register')}
        </Button>

        <div className="flex flex-wrap items-center justify-center gap-4 px-15 md:px-30">
          <p className="text-12 text-gray-600 md:text-14">{translate('account.by-registering')}</p>
          <Link className="border-b text-12 text-gray-600 md:text-14" link={termsOfUseLink} variant="menu-item">
            {translate('account.terms-of-use')}
          </Link>
        </div>
      </form>
    </>
  );
};

export default RegisterForm;
