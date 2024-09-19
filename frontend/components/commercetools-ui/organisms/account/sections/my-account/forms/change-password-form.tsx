import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { InputProps } from 'components/commercetools-ui/atoms/input';
import PasswordInput from 'components/commercetools-ui/atoms/input-password';
import { useFormat } from 'helpers/hooks/useFormat';
import useValidate from 'helpers/hooks/useValidate';
import { useAccount } from 'frontastic';
import AccountForm from '../../../account-atoms/account-form';
import useDiscardForm from '../../../hooks/useDiscardForm';

type ChangePasswordFormData = {
  password: string;
  newPassword: string;
  confirmPassword: string;
};

const ChangePasswordForm = () => {
  const { formatMessage: formatErrorMessage } = useFormat({ name: 'error' });
  const { formatMessage: formatAccountMessage } = useFormat({ name: 'account' });
  const { changePassword } = useAccount();
  const { discardForm } = useDiscardForm();
  const { validatePassword } = useValidate();

  const defaultData: ChangePasswordFormData = { password: '', newPassword: '', confirmPassword: '' };
  const [data, setData] = useState<ChangePasswordFormData>(defaultData);
  const [loading, setLoading] = useState(false);

  const newPasswordIsNotValidMessage = formatErrorMessage({
    id: 'password.not.valid',
    defaultMessage: 'Password has to be at least 8 characters long and have at least one uppercase letter.',
  });

  const confirmPasswordIsNotValidMessage = formatErrorMessage({
    id: 'password.noMatch',
    defaultMessage: "Passwords don't match",
  });

  const confirmPasswordErrorMessage = useMemo(
    () => (data.confirmPassword.length > 0 ? confirmPasswordIsNotValidMessage : newPasswordIsNotValidMessage),
    [confirmPasswordIsNotValidMessage, data.confirmPassword.length, newPasswordIsNotValidMessage],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    // Generating a toast in case of errors
    if (!validatePassword(data.newPassword)) {
      toast.error(newPasswordIsNotValidMessage);
    } else if (data.newPassword !== data.confirmPassword) {
      toast.error(confirmPasswordErrorMessage);
    } else {
      setLoading(true);
      // Request update password
      changePassword(data.password, data.newPassword).then((account) => {
        if (account.accountId) {
          toast.success(formatAccountMessage({ id: 'data.updated', defaultMessage: 'Data updated successfully.' }));
          setLoading(false);
          discardForm();
        } else {
          setLoading(false);
          toast.error(formatErrorMessage({ id: 'wentWrong', defaultMessage: 'Sorry, something went wrong..' }));
        }
      });
    }
  };

  const inputFields: Array<InputProps> = [
    { label: formatAccountMessage({ id: 'password.current', defaultMessage: 'Current password' }), name: 'password' },
    {
      label: formatAccountMessage({ id: 'password.new', defaultMessage: 'New password' }),
      name: 'newPassword',
      errorMessage: newPasswordIsNotValidMessage,
      validation: validatePassword,
    },
    {
      label: formatAccountMessage({ id: 'password.confirm', defaultMessage: 'Confirm password' }),
      name: 'confirmPassword',
      errorMessage: confirmPasswordErrorMessage,
      validation: (password: string) => password === data.newPassword && !!password.length,
    },
  ];

  return (
    <AccountForm
      title={formatAccountMessage({ id: 'password.change', defaultMessage: 'Change your password' })}
      requiredLabelIsVisible
      defaultCTASection
      loading={loading}
      onSubmit={handleSubmit}
    >
      <div className="grid gap-12">
        {inputFields.map((fieldProps, index) => (
          <PasswordInput
            key={index}
            {...fieldProps}
            onChange={handleChange}
            value={data[fieldProps.name as keyof ChangePasswordFormData]}
            required
          />
        ))}
      </div>
    </AccountForm>
  );
};

export default ChangePasswordForm;
