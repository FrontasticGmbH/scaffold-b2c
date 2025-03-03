import React, { FC, useMemo } from 'react';
import { MenuItem } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import Dropdown from 'components/commercetools-ui/atoms/dropdown';
import Link from 'components/commercetools-ui/atoms/link';
import Typography from 'components/commercetools-ui/atoms/typography';
import useClassNames from 'helpers/hooks/useClassNames';
import { AccountTab } from '..';

export interface Props {
  contentTitle: string;
  hash: string | undefined;
  tabs: AccountTab[];
  className?: string;
}

const AccountTabsMobile: FC<Props> = ({ contentTitle, hash, tabs, className = '' }) => {
  const forms = ['#edit-personal-info', '#edit-address', '#change-password', '#delete-account'];
  const accountNavButtonClassNames = useClassNames([
    hash && forms.includes(hash) ? 'hidden' : 'relative md:hidden',
    'z-30',
    className,
  ]);

  const accountTabButton = useMemo(() => {
    return (
      <>
        <Typography className="text-14 font-medium text-gray-600">{contentTitle}</Typography>
        <ChevronDownIcon strokeWidth={2} className="w-16 text-gray-600" />
      </>
    );
  }, [contentTitle]);

  return (
    <div className={accountNavButtonClassNames}>
      <Dropdown customButtonElement={accountTabButton} customMenuWrapperClassNames="absolute top-40 left-0 z-30 w-full">
        {tabs.map((tab, index) => (
          <MenuItem key={index}>
            <div className="overflow-y-scroll py-12 hover:bg-neutral-200 active:bg-neutral-200">
              <Link link={tab.href} className="flex w-full items-center justify-start px-16">
                <Typography className={`text-14 text-gray-600 ${tab.href === hash ? 'font-medium' : 'font-normal'}`}>
                  {tab.name}
                </Typography>
              </Link>
            </div>
          </MenuItem>
        ))}
      </Dropdown>
    </div>
  );
};

export default AccountTabsMobile;
