import React, { FC } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useTranslations } from 'use-intl';
import Button from 'components/commercetools-ui/atoms/button';
import PasswordInput from 'components/commercetools-ui/atoms/input-password';
import Link from 'components/commercetools-ui/atoms/link';
import { resolveReferenceTarget } from 'helpers/reference';
import { useRouter } from 'i18n/routing';
import { ResetPasswordProps } from '.';

type Inputs = {
  password: string;
  confirmPassword: string;
};

const ResetPasswordForm: FC<ResetPasswordProps> = ({ accountLink, signInLink, resetPassword }) => {
  //i18n messages
  const translate = useTranslations();

  //next/navigation
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<Inputs>({
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit: SubmitHandler<Inputs> = async ({ password }) => {
    //try registering the user with given credentials
    try {
      const response = await resetPassword(password);
      if (!response.accountId) {
        setError('root', { type: 'custom', message: translate('error.account-create-fail') });
      } else {
        clearErrors('root');
        router?.push(resolveReferenceTarget(accountLink) as string);
      }
    } catch {
      setError('root', { type: 'custom', message: translate('error.wentWrong') });
    }
  };

  return (
    <>
      <h3 className="mb-16 text-16 md:text-20 lg:text-24">{translate('account.password-reset-headline')}</h3>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <p className="mb-12 text-12 capitalize text-red-500">{errors.root?.message}&nbsp;</p>
        <div className="flex flex-col gap-16 md:gap-20">
          <PasswordInput
            required
            id="password"
            autoComplete="new-password"
            placeholder={translate('account.password')}
            {...register('password', { required: { value: true, message: translate('common.fieldIsRequired') } })}
            error={errors.password?.message}
          />

          <PasswordInput
            required
            id="confirm-password"
            autoComplete="new-password"
            placeholder={translate('account.password-confirm')}
            {...register('confirmPassword', {
              required: { value: true, message: translate('common.fieldIsRequired') },
              validate: (value) => {
                const isValid = value === watch('password');
                return isValid || translate('error.password-noMatch');
              },
            })}
            error={errors.confirmPassword?.message}
          />
          <Button size="full" type="submit" className="mb-16 text-16 leading-tight md:mb-20" disabled={isSubmitting}>
            {translate('account.password-reset-keyword')}
          </Button>
        </div>

        <Link variant="menu-item" className="mx-auto block w-fit text-14" link={signInLink}>
          {translate('account.account-back-sign')}
        </Link>
      </form>
    </>
  );
};

export default ResetPasswordForm;
