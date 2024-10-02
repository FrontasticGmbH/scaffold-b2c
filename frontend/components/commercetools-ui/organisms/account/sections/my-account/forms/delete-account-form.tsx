import { useState } from 'react';
import PasswordInput from 'components/commercetools-ui/atoms/input-password';
import { useFormat } from 'helpers/hooks/useFormat';
import AccountForm from '../../../account-atoms/account-form';

interface Props {
  deleteAccount?: (password: string) => Promise<{ success: boolean }>;
}

const DeleteAccountForm = ({ deleteAccount }: Props) => {
  const { formatMessage } = useFormat({ name: 'account' });
  const [data, setData] = useState({ password: '' });
  const [error, setError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(false);
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const onDeleteAccount = async (form: React.FormEvent) => {
    form.preventDefault();
    if (
      confirm(
        formatMessage({
          id: 'delete.disclosure',
          defaultMessage: "You can't regain access once it's deleted.",
        }),
      )
    ) {
      const deleteAccountState = await deleteAccount?.(data.password);
      if (!deleteAccountState?.success) {
        setError(true);
      }
    }
  };

  return (
    <AccountForm
      title={formatMessage({ id: 'delete.your.account', defaultMessage: 'Delete your account' })}
      subtitle={formatMessage({
        id: 'delete.disclosure',
        defaultMessage: "You can't regain access once it's deleted.",
      })}
      defaultCTASection
      requiredLabelIsVisible
      ctaVariant="delete"
      onSubmit={onDeleteAccount}
    >
      <PasswordInput
        error={error ? formatMessage({ id: 'password.invalid', defaultMessage: 'Invalid password' }) : ''}
        name={'password'}
        onChange={handleChange}
        label="Password confirmation"
        required
      />
    </AccountForm>
  );
};

export default DeleteAccountForm;
