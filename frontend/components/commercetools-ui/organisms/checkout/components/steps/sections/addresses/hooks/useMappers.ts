import { useCallback, useContext } from 'react';
import { Address as AccountAddress } from 'shared/types/account';
import { AccountContext } from 'context/account';
import { Address } from '../types';

const useMappers = () => {
  const { account } = useContext(AccountContext);

  const accountAddressToAddress = useCallback(
    (address: AccountAddress) => {
      return {
        addressId: address.addressId,
        firstName: address.firstName,
        lastName: address.lastName,
        email: account?.email ?? '',
        phone: address.phone,
        country: address.country,
        streetNumber: address.streetNumber ?? '',
        streetName: address.streetName ?? '',
        apartment: address.apartment ?? '',
        line2: address.additionalAddressInfo,
        postalCode: address.postalCode ?? '',
        city: address.city ?? '',
        state: address.state,
      } as Address;
    },
    [account],
  );

  const addressToAccountAddress = useCallback((address: Address) => {
    return {
      firstName: address.firstName,
      lastName: address.lastName,
      phone: address.phone,
      streetName: address.streetName,
      streetNumber: address.streetNumber,
      apartment: address.apartment,
      additionalAddressInfo: address.line2,
      postalCode: address.postalCode,
      city: address.city,
      country: address.country,
      state: address.state,
    } as AccountAddress;
  }, []);

  return { addressToAccountAddress, accountAddressToAddress };
};

export default useMappers;
