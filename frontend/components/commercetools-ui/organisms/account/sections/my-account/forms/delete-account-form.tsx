import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslations } from 'use-intl';
import PasswordInput from 'components/commercetools-ui/atoms/input-password';
import AccountForm from '../../../account-atoms/account-form';

interface Props {
  deleteAccount?: (password: string) => Promise<{ success: boolean }>;
}

type InputData = { password: string };

const DeleteAccountForm = ({ deleteAccount }: Props) => {
  const translate = useTranslations();

  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm<InputData>({
    defaultValues: {
      password: '',
    },
  });

  const onDeleteAccount: SubmitHandler<InputData> = async (data) => {
    if (confirm(translate('account.delete-disclosure'))) {
      const deleteAccountState = await deleteAccount?.(data.password);
      if (!deleteAccountState?.success) {
        setError('password', { type: 'manual', message: translate('account.password-invalid') });
      }
    }
  };

  return (
    <AccountForm
      subtitle={translate('account.delete-disclosure')}
      defaultCTASection
      requiredLabelIsVisible
      ctaVariant="delete"
      onSubmit={handleSubmit(onDeleteAccount)}
    >
      <PasswordInput
        error={errors.password?.message}
        label="Password confirmation"
        {...register('password', { required: { value: true, message: translate('common.fieldIsRequired') } })}
        required
      />
    </AccountForm>
  );
};

export default DeleteAccountForm;
