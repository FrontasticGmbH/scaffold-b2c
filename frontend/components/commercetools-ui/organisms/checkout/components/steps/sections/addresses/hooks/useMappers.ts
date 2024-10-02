import { useCallback, useContext } from 'react';
import { Address as AccountAddress } from 'shared/types/account';
import { AccountContext } from 'context/account';
import useI18n from 'helpers/hooks/useI18n';
import { Address } from '../types';

const useMappers = () => {
  const { account } = useContext(AccountContext);
  const { country } = useI18n();

  const accountAddressToAddress = useCallback(
    (address: AccountAddress) => {
      return {
        addressId: address.addressId,
        firstName: address.firstName,
        lastName: address.lastName,
        email: account?.email ?? '',
        phone: address.phone,
        line1: address.streetName ?? '',
        line2: address.additionalAddressInfo,
        postalCode: address.postalCode ?? '',
        city: address.city ?? '',
        state: address.state,
      } as Address;
    },
    [account],
  );

  const addressToAccountAddress = useCallback(
    (address: Address) => {
      return {
        firstName: address.firstName,
        lastName: address.lastName,
        phone: address.phone,
        streetName: address.line1,
        additionalAddressInfo: address.line2,
        postalCode: address.postalCode,
        city: address.city,
        country,
        state: address.state,
      } as AccountAddress;
    },
    [country],
  );

  return { addressToAccountAddress, accountAddressToAddress };
};

export default useMappers;
