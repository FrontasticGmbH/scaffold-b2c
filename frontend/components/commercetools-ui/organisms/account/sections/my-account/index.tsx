import React, { useContext } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useTranslations } from 'use-intl';
import { AccountContext } from 'context/account';
import Integrity from './sections/integrity';
import PersonalInfo from './sections/personal-info';

const MyAccount: React.FC = () => {
  const translate = useTranslations();

  const { account, accountLoading: isLoading } = useContext(AccountContext);

  return (
    <div>
      {/* Title and subtitle */}
      <div className="mb-32 grid gap-20 md:mb-42 lg:mb-56 lg:gap-24">
        {isLoading ? (
          <Skeleton className="h-30 max-w-300" />
        ) : (
          <h1 className="hidden text-20 text-primary md:block lg:text-24">
            {`${translate('account.hello')}${account?.firstName ?? ''}`}
          </h1>
        )}
        {isLoading ? (
          <Skeleton className="max-w-400" />
        ) : (
          <p className="text-14 text-gray-600 md:text-16">{translate('account.account-desc')}</p>
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
