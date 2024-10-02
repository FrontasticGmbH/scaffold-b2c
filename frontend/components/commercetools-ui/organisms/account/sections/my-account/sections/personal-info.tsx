import { useContext } from 'react';
import { AccountContext } from 'context/account';
import { useFormat } from 'helpers/hooks/useFormat';
import InfoCard from '../../../account-atoms/info-card';

const PersonalInfo = () => {
  const { formatMessage } = useFormat({ name: 'common' });
  const { formatMessage: formatAccountMessage } = useFormat({ name: 'account' });

  const { account } = useContext(AccountContext);

  const personalInformationFields: Array<{ label: string; value: string }> = [
    { label: formatMessage({ id: 'firstName', defaultMessage: 'First Name' }), value: account?.firstName as string },
    { label: formatMessage({ id: 'lastName', defaultMessage: 'Last Name' }), value: account?.lastName as string },
    { label: formatMessage({ id: 'email', defaultMessage: 'Email' }), value: account?.email as string },
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
