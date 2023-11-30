import PasswordInput from 'components/commercetools-ui/atoms/input-password';
import { useFormat } from 'helpers/hooks/useFormat';
import AccountForm from '../../../account-atoms/account-form';
import useDiscardForm from '../../../hooks/useDiscardForm';

const DeleteAccountForm = () => {
  const { discardForm } = useDiscardForm();
  const { formatMessage } = useFormat({ name: 'account' });

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
      onSubmit={discardForm}
    >
      <PasswordInput label="Password confirmation" required />
    </AccountForm>
  );
};

export default DeleteAccountForm;
