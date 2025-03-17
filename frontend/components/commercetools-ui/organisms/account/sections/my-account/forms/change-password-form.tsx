import React, { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslations } from 'use-intl';
import { InputProps } from 'components/commercetools-ui/atoms/input';
import PasswordInput from 'components/commercetools-ui/atoms/input-password';
import useValidate from 'helpers/hooks/useValidate';
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
  const { validatePassword } = useValidate();

  const defaultData: ChangePasswordFormData = { password: '', newPassword: '', confirmPassword: '' };
  const [data, setData] = useState<ChangePasswordFormData>(defaultData);
  const [loading, setLoading] = useState(false);

  const newPasswordIsNotValidMessage = translate('error.password-not-valid');

  const confirmPasswordIsNotValidMessage = translate('error.password-noMatch');

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
      changePassword?.(data.password, data.newPassword).then((account) => {
        if (account.accountId) {
          toast.success(translate('account.data-updated'));
          setLoading(false);
          discardForm();
        } else {
          setLoading(false);
          toast.error(translate('error.wentWrong'));
        }
      });
    }
  };

  const inputFields: Array<InputProps> = [
    { label: translate('account.password-current'), name: 'password' },
    {
      label: translate('account.password-new'),
      name: 'newPassword',
      errorMessage: newPasswordIsNotValidMessage,
      validation: validatePassword,
    },
    {
      label: translate('account.password-confirm'),
      name: 'confirmPassword',
      errorMessage: confirmPasswordErrorMessage,
      validation: (password: string) => password === data.newPassword && !!password.length,
    },
  ];

  return (
    <AccountForm
      title={translate('account.password-change')}
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
