import { useState } from 'react';
import { useTranslations } from 'use-intl';
import PasswordInput from 'components/commercetools-ui/atoms/input-password';
import AccountForm from '../../../account-atoms/account-form';

interface Props {
  deleteAccount?: (password: string) => Promise<{ success: boolean }>;
}

const DeleteAccountForm = ({ deleteAccount }: Props) => {
  const translate = useTranslations();
  const [data, setData] = useState({ password: '' });
  const [error, setError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(false);
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const onDeleteAccount = async (form: React.FormEvent) => {
    form.preventDefault();
    if (confirm(translate('account.delete-disclosure'))) {
      const deleteAccountState = await deleteAccount?.(data.password);
      if (!deleteAccountState?.success) {
        setError(true);
      }
    }
  };

  return (
    <AccountForm
      title={translate('account.delete-your-account')}
      subtitle={translate('account.delete-disclosure')}
      defaultCTASection
      requiredLabelIsVisible
      ctaVariant="delete"
      onSubmit={onDeleteAccount}
    >
      <PasswordInput
        error={error ? translate('account.password-invalid') : ''}
        name={'password'}
        onChange={handleChange}
        label="Password confirmation"
        required
      />
    </AccountForm>
  );
};

export default DeleteAccountForm;
