import React, { FC, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslations } from 'use-intl';
import Button from 'components/commercetools-ui/atoms/button';
import Input from 'components/commercetools-ui/atoms/input';
import PasswordInput from 'components/commercetools-ui/atoms/input-password';
import Link from 'components/commercetools-ui/atoms/link';
import { EMAIL_REGX, PASSWORD_REGX } from 'helpers/constants/auth';
import Redirect from 'helpers/redirect';
import { Reference } from 'types/reference';
import { UseAccountReturn } from 'frontastic/hooks/useAccount/types';
import Feedback from '../../account/account-atoms/feedback';

export interface RegisterFormProps {
  termsOfUseLink?: Reference;
  loggedIn: UseAccountReturn['loggedIn'];
  register: UseAccountReturn['register'];
}

type Inputs = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

const RegisterForm: FC<RegisterFormProps> = ({ termsOfUseLink, loggedIn, register: registerUser }) => {
  const translate = useTranslations();

  const {
    formState: { errors, isSubmitting },
    register,
    handleSubmit,
    setError,
    clearErrors,
  } = useForm<Inputs>({
    defaultValues: { firstName: '', lastName: '', email: '', password: '' },
  });

  //success
  const [success, setSuccess] = useState('');

  //form submission
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    //try registering the user with given credentials
    try {
      const response = await registerUser(data);
      if (!response.success) {
        setError('root', {
          type: 'custom',
          message: response.error?.message || translate('error.account-create-fail'),
        });
        setSuccess('');
      } else {
        setSuccess(translate('account.verification-email-sent'));
        clearErrors('root');
      }
    } catch {
      setError('root', { type: 'custom', message: translate('error.wentWrong') });
      setSuccess('');
    }
  };

  if (loggedIn) return <Redirect target="/account" />;

  const required = { value: true, message: translate('common.fieldIsRequired') };

  return (
    <>
      <h3 className="mb-16 text-16 md:mb-24 md:text-20 lg:text-24">{translate('account.become-member')}</h3>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Feedback success={success} error={errors.root?.message as string} />
        <div className="flex flex-col gap-16 md:gap-20">
          <Input
            id="name"
            type="text"
            autoComplete="firstName"
            required
            placeholder={translate('common.firstName')}
            {...register('firstName', { required })}
            error={errors.firstName?.message}
          />

          <Input
            id="name"
            type="text"
            autoComplete="lastName"
            required
            placeholder={translate('common.lastName')}
            {...register('lastName', { required })}
            error={errors.lastName?.message}
          />

          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            placeholder={translate('common.emailAddress')}
            {...register('email', {
              required,
              pattern: { value: EMAIL_REGX, message: translate('error.email') },
            })}
            error={errors.email?.message}
          />

          <PasswordInput
            required
            id="password"
            autoComplete="current-password"
            placeholder={translate('account.password')}
            {...register('password', {
              required,
              pattern: { value: PASSWORD_REGX, message: translate('error.password-not-valid') },
            })}
            error={errors.password?.message}
          />

          <Button size="full" type="submit" className="mb-16 text-16 leading-tight md:mb-20" disabled={isSubmitting}>
            {translate('account.account-register')}
          </Button>
        </div>

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
