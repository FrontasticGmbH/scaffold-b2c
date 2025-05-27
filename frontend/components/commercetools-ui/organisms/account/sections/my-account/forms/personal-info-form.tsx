import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslations } from 'use-intl';
import Input from 'components/commercetools-ui/atoms/input';
import useFeedbackToasts from 'components/commercetools-ui/organisms/account/hooks/useFeedbackToasts';
import { EMAIL_REGX } from 'helpers/constants/auth';
import { Account } from 'types/entity/account';
import { UpdateAccount } from 'frontastic/hooks/useAccount/types';
import AccountForm from '../../../account-atoms/account-form';
import useDiscardForm from '../../../hooks/useDiscardForm';

type Inputs = {
  firstName: string;
  lastName: string;
  email: string;
};

interface Props {
  account?: Account;
  update?: (payload: UpdateAccount) => Promise<Account>;
}
const PersonalInfoForm = ({ account, update }: Props) => {
  const { discardForm } = useDiscardForm();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors, dirtyFields },
  } = useForm<Inputs>({
    defaultValues: {
      firstName: account?.firstName ?? '',
      lastName: account?.lastName ?? '',
      email: account?.email ?? '',
    },
    mode: 'onChange',
  });

  const { notifyDataUpdated, notifyWentWrong } = useFeedbackToasts();

  const translate = useTranslations();

  const invalidNameErrorMessage = translate('error.name');
  const invalidEmailErrorMessage = translate('error.email');

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    update?.({ ...data, email: data.email && data.email !== account?.email ? data.email : undefined })
      .then(() => notifyDataUpdated())
      .then(() => discardForm())
      .catch(() => notifyWentWrong());
  };

  return (
    <AccountForm requiredLabelIsVisible defaultCTASection loading={isSubmitting} onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-12">
        <Input
          label={translate('common.firstName')}
          {...register('firstName', {
            minLength: { value: 2, message: invalidNameErrorMessage },
            required: { value: true, message: invalidNameErrorMessage },
          })}
          error={errors.firstName?.message}
          isDirty={dirtyFields.firstName}
        />
        <Input
          label={translate('common.lastName')}
          {...register('lastName', {
            minLength: { value: 2, message: invalidNameErrorMessage },
            required: { value: true, message: invalidNameErrorMessage },
          })}
          error={errors.lastName?.message}
          isDirty={dirtyFields.lastName}
        />
        <Input
          label={translate('common.email')}
          {...register('email', {
            required: { value: true, message: invalidEmailErrorMessage },
            pattern: { value: EMAIL_REGX, message: invalidEmailErrorMessage },
          })}
          error={errors.email?.message}
          isDirty={dirtyFields.email}
        />
      </div>
    </AccountForm>
  );
};

export default PersonalInfoForm;
