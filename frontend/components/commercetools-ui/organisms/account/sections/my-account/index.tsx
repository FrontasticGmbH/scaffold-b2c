import React, { useContext } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useTranslations } from 'use-intl';
import Typography from 'components/commercetools-ui/atoms/typography';
import { AccountContext } from 'context/account';
import Integrity from './sections/integrity';
import PersonalInfo from './sections/personal-info';

const MyAccount: React.FC = () => {
  const translate = useTranslations();

  const { account, accountLoading: isLoading } = useContext(AccountContext);

  return (
    <div className="mt-20 px-16 md:px-24 lg:mt-42 lg:px-44">
      {/* Title and subtitle */}
      <div className="mb-32 grid gap-20 md:mb-42 lg:mb-56 lg:gap-24">
        {isLoading ? (
          <Skeleton className="h-30 max-w-300" />
        ) : (
          <Typography as="h1" className="hidden text-20 text-primary md:block lg:text-24">
            {`${translate('account.hello')}${account?.firstName ?? ''}`}
          </Typography>
        )}
        {isLoading ? (
          <Skeleton className="max-w-400" />
        ) : (
          <Typography className="text-14 text-gray-600 md:text-16">{translate('account.account-desc')}</Typography>
        )}
      </div>

      {/* Sections */}
      <div className="grid gap-32 md:gap-24 lg:gap-48">
        {isLoading ? (
          <Skeleton className="h-350" />
        ) : (
          <>
            <PersonalInfo />

            <Integrity />
          </>
        )}
      </div>
    </div>
  );
};

export default MyAccount;
