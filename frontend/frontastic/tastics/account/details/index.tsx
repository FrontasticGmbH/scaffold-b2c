'use client';

import React, { useContext, useEffect } from 'react';
import AccountDetails, { AccountInfo } from 'components/commercetools-ui/organisms/account';
import useOrderFetch from 'components/commercetools-ui/organisms/account/sections/orders/helper-hooks/useOrderFetch';
import { AccountContext } from 'context/account';
import useHash from 'helpers/hooks/useHash';
import useUpdateCartAddresses from 'helpers/hooks/useUpdateCartAddresses';
import Redirect from 'helpers/redirect';
import { TasticProps } from 'frontastic/tastics/types';

const AccountDetailsTastic = ({ data }: TasticProps<AccountInfo>) => {
  const updateCartAddresses = useUpdateCartAddresses();

  const { loggedIn, account, changePassword, deleteAccount, update } = useContext(AccountContext);

  const [hash, id] = useHash();

  const { orders, loading: ordersLoading, shippingMethods } = useOrderFetch();

  useEffect(() => {
    if (loggedIn) updateCartAddresses();
  }, [loggedIn, updateCartAddresses]);

  if (!loggedIn) return <Redirect target="/" />;

  return (
    <AccountDetails
      {...data}
      hash={hash}
      id={id}
      orders={orders}
      ordersLoading={ordersLoading}
      shippingMethods={shippingMethods.data ?? []}
      account={account}
      changePassword={changePassword}
      deleteAccount={deleteAccount}
      update={update}
    />
  );
};

export default AccountDetailsTastic;
