'use client';

import React, { useEffect } from 'react';
import AccountDetails, { AccountDetailsProps } from 'components/commercetools-ui/organisms/account';
import useUpdateCartAddresses from 'helpers/hooks/useUpdateCartAddresses';
import { TasticProps } from 'frontastic/tastics/types';

const AccountDetailsTastic = ({ data }: TasticProps<AccountDetailsProps>) => {
  const updateCartAddresses = useUpdateCartAddresses();

  useEffect(() => {
    updateCartAddresses();
  }, [updateCartAddresses]);

  return <AccountDetails {...data} />;
};

export default AccountDetailsTastic;
