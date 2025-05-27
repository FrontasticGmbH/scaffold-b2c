import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslations } from 'use-intl';
import PasswordInput from 'components/commercetools-ui/atoms/input-password';
import { PASSWORD_REGX } from 'helpers/constants/auth';
import { Account } from 'types/entity/account';
import AccountForm from '../../../account-atoms/account-form';
import useDiscardForm from '../../../hooks/useDiscardForm';

type ChangePasswordFormData = {
  password: string;
  newPassword: string;
  confirmPassword: string;
};

interface Props {
  changePassword?: (oldPassword: string, newPassword: string) => Promise<Account>;
}

const ChangePasswordForm = ({ changePassword }: Props) => {
  const translate = useTranslations();
  const { discardForm } = useDiscardForm();

  const {
    register,
    formState: { isSubmitting, errors },
    handleSubmit,
    watch,
  } = useForm<ChangePasswordFormData>({
    defaultValues: {
      password: '',
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onBlur',
  });

  const onSubmit: SubmitHandler<ChangePasswordFormData> = (data) => {
    changePassword?.(data.password, data.newPassword).then((account) => {
      if (account.accountId) {
        toast.success(translate('account.data-updated'));
        discardForm();
      } else {
        toast.error(translate('error.wentWrong'));
      }
    });
  };

  return (
    <AccountForm requiredLabelIsVisible defaultCTASection loading={isSubmitting} onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-12">
        <PasswordInput
          label={translate('account.password-current')}
          {...register('password', {
            required: { value: true, message: translate('common.fieldIsRequired') },
          })}
          error={errors.password?.message}
          required
        />
        <PasswordInput
          label={translate('account.password-new')}
          {...register('newPassword', {
            pattern: { value: PASSWORD_REGX, message: translate('error.password-not-valid') },
            required: { value: true, message: translate('common.fieldIsRequired') },
          })}
          error={errors.newPassword?.message}
          required
        />
        <PasswordInput
          label={translate('account.password-confirm')}
          {...register('confirmPassword', {
            pattern: { value: PASSWORD_REGX, message: translate('error.password-not-valid') },
            required: { value: true, message: translate('common.fieldIsRequired') },
            validate: (value) => value === watch('newPassword') || translate('error.password-noMatch'),
          })}
          error={errors.confirmPassword?.message}
          required
        />
      </div>
    </AccountForm>
  );
};

export default ChangePasswordForm;
