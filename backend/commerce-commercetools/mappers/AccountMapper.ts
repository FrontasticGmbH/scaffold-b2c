import { BaseAddress, Customer as commercetoolsCustomer } from '@commercetools/platform-sdk';
import { Locale } from '../Locale';
import { Account } from '@Types/account/Account';
import { Address } from '@Types/account/Address';
import { Guid } from '@Commerce-commercetools/utils/Guid';

export class AccountMapper {
  static commercetoolsCustomerToAccount: (commercetoolsCustomer: commercetoolsCustomer, locale: Locale) => Account = (
    commercetoolsCustomer: commercetoolsCustomer,
    locale: Locale,
  ) => {
    return {
      accountId: commercetoolsCustomer.id,
      email: commercetoolsCustomer.email,
      salutation: commercetoolsCustomer?.salutation,
      firstName: commercetoolsCustomer?.firstName,
      lastName: commercetoolsCustomer?.lastName,
      birthday: commercetoolsCustomer?.dateOfBirth ? new Date(commercetoolsCustomer.dateOfBirth) : undefined,
      confirmed: commercetoolsCustomer.isEmailVerified,
      addresses: AccountMapper.commercetoolsCustomerToAddresses(commercetoolsCustomer, locale),
    } as Account;
  };

  static commercetoolsCustomerToAddresses: (commercetoolsCustomer: commercetoolsCustomer, locale: Locale) => Address[] =
    (commercetoolsCustomer: commercetoolsCustomer, locale: Locale) => {
      const addresses: Address[] = [];

      commercetoolsCustomer.addresses.forEach((commercetoolsAddress) => {
        addresses.push({
          addressId: commercetoolsAddress.id,
          salutation: commercetoolsAddress.salutation ?? undefined,
          firstName: commercetoolsAddress.firstName ?? undefined,
          lastName: commercetoolsAddress.lastName ?? undefined,
          streetName: commercetoolsAddress.streetName ?? undefined,
          streetNumber: commercetoolsAddress.streetNumber ?? undefined,
          additionalStreetInfo: commercetoolsAddress.additionalStreetInfo ?? undefined,
          additionalAddressInfo: commercetoolsAddress.additionalAddressInfo ?? undefined,
          postalCode: commercetoolsAddress.postalCode ?? undefined,
          city: commercetoolsAddress.city ?? undefined,
          country: commercetoolsAddress.country ?? undefined,
          state: commercetoolsAddress.state ?? undefined,
          phone: commercetoolsAddress.phone ?? undefined,
          isDefaultBillingAddress: commercetoolsAddress.id === commercetoolsCustomer.defaultBillingAddressId,
          isBillingAddress: commercetoolsCustomer.billingAddressIds.includes(commercetoolsAddress.id),
          isDefaultShippingAddress: commercetoolsAddress.id === commercetoolsCustomer.defaultShippingAddressId,
          isShippingAddress: commercetoolsCustomer.shippingAddressIds.includes(commercetoolsAddress.id),
        } as Address);
      });

      return addresses;
    };

  static addressToCommercetoolsAddress: (address: Address) => BaseAddress = (address: Address) => {
    return {
      id: address.addressId,
      key: Guid.newGuid(),
      salutation: address.salutation,
      firstName: address.firstName,
      lastName: address.lastName,
      streetName: address.streetName,
      streetNumber: address.streetNumber,
      additionalStreetInfo: address.additionalStreetInfo,
      additionalAddressInfo: address.additionalAddressInfo,
      postalCode: address.postalCode,
      city: address.city,
      country: address.country,
      state: address.state,
      phone: address.phone,
    } as BaseAddress;
  };
}
