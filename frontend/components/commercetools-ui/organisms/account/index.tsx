import React, { useCallback, useContext, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Skeleton from 'react-loading-skeleton';
import Button from 'components/commercetools-ui/atoms/button';
import Link from 'components/commercetools-ui/atoms/link';
import Typography from 'components/commercetools-ui/atoms/typography';
import { AccountContext } from 'context/account';
import useClassNames from 'helpers/hooks/useClassNames';
import { useFormat } from 'helpers/hooks/useFormat';
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

  const { formatMessage: formatAccountMessage } = useFormat({ name: 'account' });

  const handleLogout = () => {
    logout?.().then(() => router.push('/login'));
  };

  const tabs = useMemo<AccountTab[]>(() => {
    return [
      {
        name: formatAccountMessage({ id: 'my.account', defaultMessage: 'My Account' }),
        href: '?',
        isActive: hash === '',
      },
      //   {
      //     name: formatAccountMessage({ id: 'addresses', defaultMessage: 'Addresses' }),
      //     href: '?hash=addresses',
      //     isActive: hash === 'addresses',
      //   },
      {
        name: formatAccountMessage({ id: 'orders', defaultMessage: 'Orders' }),
        href: '?hash=orders',
        isActive: hash === 'orders',
      },
      //   {
      //     name: formatAccountMessage({ id: 'payment.methods', defaultMessage: 'Payment methods' }),
      //     href: '?hash=payment',
      //     isActive: hash === 'payment',
      //   },
      {
        name: formatAccountMessage({ id: 'customer.support', defaultMessage: 'Customer support' }),
        href: '?hash=support',
        isActive: hash === 'support',
      },
    ];
  }, [formatAccountMessage, hash]);

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

  //   const addresses = useMemo(() => {
  //     return id?.startsWith('address') ? <AddressForm editedAddressId={id?.split('_')[1]} /> : <Addresses />;
  //   }, [id]);

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

  //   const paymentPagesRef = useMemo(() => {
  //     return { add: <PaymentAdd />, edit: <PaymentEdit /> };
  //   }, []);

  //   const Payment = useMemo(
  //     () => paymentPagesRef[id?.split('-')[0] as keyof typeof paymentPagesRef] ?? <PaymentMethods />,
  //     [id, paymentPagesRef],
  //   );

  const mapping = {
    '': AccountSection,
    // addresses: addresses,
    orders: OrdersSection,
    // payment: Payment,
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
      return `hover:underline ${tab.isActive ? 'text-primary-black font-medium' : 'text-secondary-black'}`;
    },

    [],
  );

  return (
    <div className="relative flex bg-neutral-100">
      <div className="sticky top-175 w-0 self-start md:h-[calc(100vh-200px)] md:w-1/4">
        <div className="hidden size-full flex-col justify-between pt-24 md:flex lg:pt-44">
          <div className="grid gap-36 px-28 lg:px-56">
            {tabs.map((tab) => (
              <Link link={accountLoading ? '' : tab.href} key={tab.name} className={tabButtonClassNames}>
                {accountLoading ? (
                  <Skeleton />
                ) : (
                  <Typography className={tabButtonLabelClassNames(tab)}>{tab.name}</Typography>
                )}
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
                className="w-full rounded-md border border-primary-black px-0 py-8 text-14"
              >
                {formatAccountMessage({ id: 'sign.out', defaultMessage: 'Sign out' })}
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
                <Typography as="h2" className="text-18 text-primary-black">
                  {contentTitle}
                </Typography>
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
