import React, { useCallback, useContext, useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useTranslations } from 'use-intl';
import Button from 'components/commercetools-ui/atoms/button';
import Link from 'components/commercetools-ui/atoms/link';
import { AccountContext } from 'context/account';
import useClassNames from 'helpers/hooks/useClassNames';
import { useRouter } from 'i18n/routing';
import { Account } from 'types/entity/account';
import { ShippingMethod } from 'types/entity/cart';
import { Order } from 'types/entity/order';
import { Reference } from 'types/reference';
import { UpdateAccount } from 'frontastic/hooks/useAccount/types';
import AccountTabsMobile from './account-atoms/account-tabs-mobile';
import CustomerSupport from './sections/customer-support';
import MyAccount from './sections/my-account';
import ChangePasswordForm from './sections/my-account/forms/change-password-form';
import DeleteAccountForm from './sections/my-account/forms/delete-account-form';
import PersonalInfoForm from './sections/my-account/forms/personal-info-form';
import Orders from './sections/orders';
import OrderPage from './sections/orders/order-page';

export interface AccountTab {
  name: string;
  href: string;
  isActive: boolean;
}
export interface FAQ {
  question: string;
  answer: string;
}

export type AccountInfo = {
  loginLink?: Reference;
  phoneNumber: string;
  workingHoursWeekdays: string;
  workingHoursWeekends: string;
  email: string;
  addressLine: string;
  cityAndPostalCode: string;
  country: string;
  faqs: FAQ[];
};

export type AccountDetailsProps = AccountInfo & {
  hash: string;
  id: string | null;
  orders: Order[];
  shippingMethods: ShippingMethod[];
  ordersLoading?: boolean;
  account?: Account;
  changePassword?: (oldPassword: string, newPassword: string) => Promise<Account>;
  deleteAccount?: (password: string) => Promise<{ success: boolean }>;
  update?: (payload: UpdateAccount) => Promise<Account>;
};

const AccountDetails: React.FC<AccountDetailsProps> = ({
  id,
  hash,
  orders,
  shippingMethods,
  ordersLoading,
  phoneNumber,
  workingHoursWeekdays,
  workingHoursWeekends,
  email,
  addressLine,
  cityAndPostalCode,
  country: organizationCountry,
  faqs,
  account,
  changePassword,
  deleteAccount,
  update,
}) => {
  const router = useRouter();

  const { accountLoading, logout } = useContext(AccountContext);

  const translate = useTranslations();

  const handleLogout = () => {
    logout?.().then(() => router.push('/login'));
  };

  const tabs = useMemo<AccountTab[]>(() => {
    return [
      {
        name: translate('account.my-account'),
        href: '?',
        isActive: hash === '',
      },
      {
        name: translate('account.orders'),
        href: '?hash=orders',
        isActive: hash === 'orders',
      },
      {
        name: translate('account.customer-support'),
        href: '?hash=support',
        isActive: hash === 'support',
      },
    ];
  }, [translate, hash]);

  const accountPagesRef = useMemo(() => {
    return {
      'edit-personal-info': <PersonalInfoForm account={account} update={update} />,
      'change-password': <ChangePasswordForm changePassword={changePassword} />,
      'delete-account': <DeleteAccountForm deleteAccount={deleteAccount} />,
    };
  }, [account, changePassword, deleteAccount, update]);

  const AccountSection = useMemo(
    () => accountPagesRef[id as keyof typeof accountPagesRef] ?? <MyAccount />,
    [accountPagesRef, id],
  );

  const OrdersSection = useMemo(() => {
    return id && id.startsWith('order') ? (
      <OrderPage
        order={orders.find((o) => o.orderId === id.split('_')[1]) as Order}
        shippingMethods={shippingMethods}
      />
    ) : (
      <Orders orders={orders} loading={ordersLoading} />
    );
  }, [id, orders, ordersLoading, shippingMethods]);

  const mapping = {
    '': AccountSection,
    orders: OrdersSection,
    support: (
      <CustomerSupport
        phoneNumber={phoneNumber}
        workingHoursWeekdays={workingHoursWeekdays}
        workingHoursWeekends={workingHoursWeekends}
        email={email}
        addressLine={addressLine}
        cityAndPostalCode={cityAndPostalCode}
        country={organizationCountry}
        faqs={faqs}
      />
    ),
  };

  const contentTitle = useMemo(() => {
    const tabIndex = tabs?.findIndex((tab) => tab.isActive);
    if (tabs[tabIndex]) return tabs[tabIndex].name ?? '';
    else return '';
  }, [tabs]);

  const Content = mapping[hash as keyof typeof mapping];

  const tabButtonClassNames = useClassNames(['whitespace-nowrap', accountLoading ? 'cursor-default' : '']);

  const tabButtonLabelClassNames = useCallback(
    (tab: AccountTab) => {
      return `hover:underline ${tab.isActive ? 'text-primary font-medium' : 'text-gray-600'}`;
    },

    [],
  );

  return (
    <div className="relative flex bg-white">
      <div className="sticky top-175 w-0 self-start md:h-[calc(100vh-200px)] md:w-1/4">
        <div className="hidden size-full flex-col justify-between pt-24 md:flex lg:pt-44">
          <div className="grid gap-36 px-28 lg:px-56">
            {tabs.map((tab) => (
              <Link link={accountLoading ? '' : tab.href} key={tab.name} className={tabButtonClassNames}>
                {accountLoading ? <Skeleton /> : <p className={tabButtonLabelClassNames(tab)}>{tab.name}</p>}
              </Link>
            ))}
          </div>
          <div className="px-20 py-16 lg:px-40">
            {accountLoading ? (
              <Skeleton className="h-30" />
            ) : (
              <Button
                onClick={handleLogout}
                variant="secondary"
                className="w-full rounded-md border border-primary px-0 py-8 text-14"
              >
                {translate('account.sign-out')}
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col border-neutral-400 md:border-l lg:items-start">
        <div className="w-full pb-48">
          <div className="mt-20 px-16">
            {contentTitle && (
              <div className="block md:hidden">
                <h2 className="text-18 text-primary">{contentTitle}</h2>
              </div>
            )}

            {contentTitle && (
              <AccountTabsMobile contentTitle={contentTitle} hash={hash} tabs={tabs} className="mt-20" />
            )}
          </div>
          <div key={hash}>{Content && Content}</div>
        </div>
      </div>
    </div>
  );
};
export default AccountDetails;
