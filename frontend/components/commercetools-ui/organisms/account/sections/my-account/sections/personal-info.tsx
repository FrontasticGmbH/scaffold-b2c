import { FC } from 'react';
import { Account } from 'shared/types/account';
import { useFormat } from 'helpers/hooks/useFormat';
import InfoCard from '../../../account-atoms/info-card';

interface PersonalInformation {
  account: Account;
}

const PersonalInfo: FC<PersonalInformation> = ({ account }) => {
  const { formatMessage } = useFormat({ name: 'common' });
  const { formatMessage: formatAccountMessage } = useFormat({ name: 'account' });

  const personalInformationFields: Array<{ label: string; value: string }> = [
    { label: formatMessage({ id: 'firstName', defaultMessage: 'First Name' }), value: account?.firstName as string },
    { label: formatMessage({ id: 'lastName', defaultMessage: 'Last Name' }), value: account?.lastName as string },
    { label: formatMessage({ id: 'email', defaultMessage: 'Email' }), value: account?.email },
  ];

  return (
    <InfoCard
      title={formatAccountMessage({ id: 'personal.info', defaultMessage: 'Personal information' })}
      isEditable
      infoFields={personalInformationFields}
      editHref="?id=edit-personal-info"
    />
  );
};

export default PersonalInfo;
