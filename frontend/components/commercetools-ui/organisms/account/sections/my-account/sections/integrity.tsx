import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'use-intl';
import Link from 'components/commercetools-ui/atoms/link';
import Typography from 'components/commercetools-ui/atoms/typography';
import InfoCard, { InfoField } from '../../../account-atoms/info-card';

const Integrity = () => {
  const translate = useTranslations();

  // Integrity fields
  const integrityButtons: Array<InfoField> = [
    {
      label: translate('account.password-change'),
      value: '?id=change-password',
    },
    {
      label: translate('account.delete-account'),
      value: '?id=delete-account',
    },
  ];

  return (
    <InfoCard title={translate('account.integrity')} titleTagType="h3" clearPadding cardClassName="grid">
      {integrityButtons.map(({ label, value }, index) => (
        <Link key={index} link={value} className="hover:cursor-pointer">
          <div className="flex items-center justify-between pr-32 md:pr-36">
            <Typography className="py-24 pl-16 pr-32 text-14 font-medium text-primary md:pl-24">{label}</Typography>

            <ChevronRightIcon className="h-24 w-20 text-gray-600" />
          </div>

          {index === 0 && <hr />}
        </Link>
      ))}
    </InfoCard>
  );
};

export default Integrity;
