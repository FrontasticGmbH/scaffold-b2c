import { useState } from 'react';
import { useTranslations } from 'use-intl';
import Input, { InputProps } from 'components/commercetools-ui/atoms/input';
import useFeedbackToasts from 'components/commercetools-ui/organisms/account/hooks/useFeedbackToasts';
import useValidate from 'helpers/hooks/useValidate';
import { Account } from 'types/entity/account';
import { UpdateAccount } from 'frontastic/hooks/useAccount/types';
import AccountForm from '../../../account-atoms/account-form';
import useDiscardForm from '../../../hooks/useDiscardForm';

type inputNameType = 'firstName' | 'lastName' | 'email';

interface Props {
  account?: Account;
  update?: (payload: UpdateAccount) => Promise<Account>;
}
const PersonalInfoForm = ({ account, update }: Props) => {
  const { discardForm } = useDiscardForm();

  const [data, setData] = useState<Account>(account as Account);
  const [loading, setLoading] = useState(false);

  const { validateEmail, validateTextExists } = useValidate();
  const { notifyDataUpdated, notifyWentWrong } = useFeedbackToasts();

  const translate = useTranslations();

  const invalidNameErrorMessage = translate('error.name');
  const invalidEmailErrorMessage = translate('error.email');

  //input change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    setLoading(true);

    update?.({ ...data, email: data.email && data.email !== account?.email ? data.email : undefined })
      .then(() => notifyDataUpdated())
      .then(() => discardForm())
      .then(() => setLoading(false))
      .catch(() => notifyWentWrong());
  };

  const inputFields: Array<InputProps> = [
    {
      label: translate('common.firstName'),
      name: 'firstName',
      errorMessage: invalidNameErrorMessage,
      validation: validateTextExists,
    },
    {
      label: translate('common.lastName'),
      name: 'lastName',
      errorMessage: invalidNameErrorMessage,
      validation: validateTextExists,
    },
    {
      label: translate('common.email'),
      name: 'email',
      errorMessage: invalidEmailErrorMessage,
      validation: validateEmail,
    },
  ];

  return (
    <AccountForm
      title={translate('account.personal-info-edit')}
      requiredLabelIsVisible
      defaultCTASection
      loading={loading}
      onSubmit={handleSubmit}
    >
      <div className="grid gap-12">
        {inputFields.map((fieldProps, index) => (
          <Input
            key={index}
            {...fieldProps}
            onChange={handleChange}
            value={data?.[fieldProps.name as inputNameType] ?? ''}
            required
          />
        ))}
      </div>
    </AccountForm>
  );
};

export default PersonalInfoForm;
