'use client';

import React, { useContext, useEffect } from 'react';
import AccountDetails, { AccountInfo } from 'components/commercetools-ui/organisms/account';
import useOrderFetch from 'components/commercetools-ui/organisms/account/sections/orders/helper-hooks/useOrderFetch';
import { AccountContext } from 'context/account';
import useUpdateCartAddresses from 'helpers/hooks/useUpdateCartAddresses';
import Redirect from 'helpers/redirect';
import { TasticProps } from 'frontastic/tastics/types';

const AccountDetailsTastic = ({ data }: TasticProps<AccountInfo>) => {
  const updateCartAddresses = useUpdateCartAddresses();

  const { loggedIn } = useContext(AccountContext);

  const { orders, loading: ordersLoading, shippingMethods } = useOrderFetch();

  useEffect(() => {
    if (loggedIn) updateCartAddresses();
  }, [loggedIn, updateCartAddresses]);

  if (!loggedIn) return <Redirect target="/" />;

  return (
    <AccountDetails
      {...data}
      orders={orders}
      ordersLoading={ordersLoading}
      shippingMethods={shippingMethods.data ?? []}
    />
  );
};

export default AccountDetailsTastic;
