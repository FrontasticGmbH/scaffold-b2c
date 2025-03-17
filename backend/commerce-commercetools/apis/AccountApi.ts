import { Account } from '@Types/account/Account';
import {
  BaseAddress,
  CartResourceIdentifier,
  CustomerDraft,
  CustomerUpdate,
  CustomerUpdateAction,
} from '@commercetools/platform-sdk';
import { Cart } from '@Types/cart/Cart';
import { Address } from '@Types/account/Address';
import { AccountToken } from '@Types/account/AccountToken';
import { AccountMapper } from '../mappers/AccountMapper';
import { Guid } from '../utils/Guid';
import { AccountEmailDuplicatedError } from '../errors/AccountEmailDuplicatedError';
import { AccountAuthenticationError } from '../errors/AccountAuthenticationError';
import { BaseApi } from './BaseApi';
import { ExternalError } from '@Commerce-commercetools/errors/ExternalError';
import { ValidationError } from '@Commerce-commercetools/errors/ValidationError';
import { CartMapper } from '@Commerce-commercetools/mappers/CartMapper';

export class AccountApi extends BaseApi {
  create: (account: Account, cart: Cart | undefined) => Promise<Account> = async (
    account: Account,
    cart: Cart | undefined,
  ) => {
    const {
      commercetoolsAddresses,
      billingAddresses,
      shippingAddresses,
      defaultBillingAddress,
      defaultShippingAddress,
    } = this.extractAddresses(account);

    const customerDraft: CustomerDraft = {
      key: Guid.newGuid(),
      email: account.email,
      password: account.password,
      salutation: account?.salutation,
      firstName: account?.firstName,
      lastName: account?.lastName,
      dateOfBirth: account?.birthday
        ? account.birthday.getFullYear() + '-' + account.birthday.getMonth() + '-' + account.birthday.getDate()
        : undefined,
      isEmailVerified: account?.confirmed,
      addresses: commercetoolsAddresses.length > 0 ? commercetoolsAddresses : undefined,
      defaultBillingAddress: defaultBillingAddress,
      defaultShippingAddress: defaultShippingAddress,
      billingAddresses: billingAddresses.length > 0 ? billingAddresses : undefined,
      shippingAddresses: shippingAddresses.length > 0 ? shippingAddresses : undefined,
      anonymousCart:
        cart !== undefined
          ? ({
              typeId: 'cart',
              id: cart.cartId,
            } as CartResourceIdentifier)
          : undefined,
    };

    account = await this.requestBuilder()
      .customers()
      .post({
        body: customerDraft,
      })
      .execute()
      .then((response) => {
        return AccountMapper.commercetoolsCustomerToAccount(response.body.customer);
      })
      .catch((error) => {
        if (error.code === 400) {
          if (error instanceof ExternalError && error?.errorName === ExternalError.DUPLICATED_FIELD_ERROR_NAME) {
            throw new AccountEmailDuplicatedError({ message: `The account ${account.email} does already exist.` });
          }

          /*
           * The cart might already belong to another user, so we try to create tje account without the cart.
           */
          if (cart) {
            return this.create(account, undefined);
          }
        }

        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
      });

    if (!account.confirmed) {
      account.confirmationToken = await this.getConfirmationToken(account);
    }

    return account;
  };

  confirmEmail: (token: string) => Promise<Account> = async (token: string) => {
    return await this.requestBuilder()
      .customers()
      .emailConfirm()
      .post({
        body: {
          tokenValue: token,
        },
      })
      .execute()
      .then((response) => {
        return AccountMapper.commercetoolsCustomerToAccount(response.body);
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
      });
  };

  login: (account: Account, cart: Cart | undefined) => Promise<{ account: Account; cart: Cart | undefined }> = async (
    account: Account,
    cart: Cart | undefined,
  ) => {
    const locale = await this.getCommercetoolsLocal();
    const defaultLocale = this.defaultLocale;

    const { account: loggedInAccount, cart: loggedInCart } = await this.requestBuilder()
      .login()
      .post({
        body: {
          email: account.email,
          password: account.password,
          anonymousCart:
            cart !== undefined
              ? ({
                  typeId: 'cart',
                  id: cart.cartId,
                } as CartResourceIdentifier)
              : undefined,
        },
      })
      .execute()
      .then((response) => {
        return {
          account: AccountMapper.commercetoolsCustomerToAccount(response.body.customer),
          cart: response.body.cart
            ? CartMapper.commercetoolsCartToCart(response.body.cart, locale, defaultLocale)
            : undefined,
        };
      })
      .catch((error) => {
        if (error.code && error.code === 400) {
          if (error.body && error.body?.errors?.[0]?.code === 'InvalidCredentials') {
            throw new AccountAuthenticationError({
              message: 'Failed to login account with the given credentials',
            });
          }

          /*
           * The cart might already belong to another user, so we try to log in without the cart.
           */
          if (cart) {
            return this.login(account, undefined);
          }
        }

        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
      });

    if (!loggedInAccount.confirmed) {
      loggedInAccount.confirmationToken = await this.getConfirmationToken(loggedInAccount);
    }

    return { account: loggedInAccount, cart: loggedInCart };
  };

  updatePassword: (account: Account, oldPassword: string, newPassword: string) => Promise<Account> = async (
    account: Account,
    oldPassword: string,
    newPassword: string,
  ) => {
    const accountVersion = await this.fetchAccountVersion(account);

    account = await this.requestBuilder()
      .customers()
      .password()
      .post({
        body: {
          id: account.accountId,
          version: accountVersion,
          currentPassword: oldPassword,
          newPassword: newPassword,
        },
      })
      .execute()
      .then((response) => {
        return AccountMapper.commercetoolsCustomerToAccount(response.body);
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
      });

    return account;
  };

  generatePasswordResetToken: (email: string) => Promise<AccountToken> = async (email: string) => {
    return await this.requestBuilder()
      .customers()
      .passwordToken()
      .post({
        body: {
          email: email,
          ttlMinutes: 2 * 24 * 60,
        },
      })
      .execute()
      .then((response) => {
        return {
          email: email,
          token: response.body.value,
          tokenValidUntil: new Date(response.body.expiresAt),
        };
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
      });
  };

  resetPassword: (token: string, newPassword: string) => Promise<Account> = async (
    token: string,
    newPassword: string,
  ) => {
    return await this.requestBuilder()
      .customers()
      .passwordReset()
      .post({
        body: {
          tokenValue: token,
          newPassword: newPassword,
        },
      })
      .execute()
      .then((response) => {
        return AccountMapper.commercetoolsCustomerToAccount(response.body);
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
      });
  };

  update: (account: Account) => Promise<Account> = async (account: Account) => {
    const customerUpdateActions: CustomerUpdateAction[] = [];

    if (account.firstName) {
      customerUpdateActions.push({ action: 'setFirstName', firstName: account.firstName });
    }

    if (account.lastName) {
      customerUpdateActions.push({ action: 'setLastName', lastName: account.lastName });
    }

    if (account.email) {
      customerUpdateActions.push({ action: 'changeEmail', email: account.email });
    }

    if (account.salutation) {
      customerUpdateActions.push({ action: 'setSalutation', salutation: account.salutation });
    }

    if (account.birthday) {
      customerUpdateActions.push({
        action: 'setDateOfBirth',
        dateOfBirth:
          account.birthday.getFullYear() + '-' + account.birthday.getMonth() + '-' + account.birthday.getDate(),
      });
    }

    // TODO: should we also update addresses in this method?

    account = await this.updateAccount(account, customerUpdateActions);

    if (!account.confirmed) {
      account.confirmationToken = await this.getConfirmationToken(account);
    }

    return account;
  };

  addAddress: (account: Account, address: Address) => Promise<Account> = async (account: Account, address: Address) => {
    const customerUpdateActions: CustomerUpdateAction[] = [];

    let addressData = AccountMapper.addressToCommercetoolsAddress(address);

    if (addressData.id !== undefined) {
      addressData = {
        ...addressData,
        id: undefined,
      };
    }

    if (address.isDefaultBillingAddress || address.isDefaultShippingAddress) {
      addressData = {
        ...addressData,
        key: Guid.newGuid(),
      };
    }

    customerUpdateActions.push({ action: 'addAddress', address: addressData });

    if (address.isDefaultBillingAddress) {
      customerUpdateActions.push({ action: 'setDefaultBillingAddress', addressKey: addressData.key });
    }

    if (address.isDefaultShippingAddress) {
      customerUpdateActions.push({ action: 'setDefaultShippingAddress', addressKey: addressData.key });
    }

    return await this.updateAccount(account, customerUpdateActions);
  };

  addShippingAddress: (account: Account, address: Address) => Promise<Account> = async (
    account: Account,
    address: Address,
  ) => {
    const customerUpdateActions: CustomerUpdateAction[] = [];

    let addressData = AccountMapper.addressToCommercetoolsAddress(address);

    if (addressData.id !== undefined) {
      addressData = {
        ...addressData,
        id: undefined,
      };
    }

    customerUpdateActions.push({ action: 'addAddress', address: addressData });
    customerUpdateActions.push({ action: 'addShippingAddressId', addressKey: addressData.key });

    if (address.isDefaultShippingAddress) {
      customerUpdateActions.push({ action: 'setDefaultShippingAddress', addressKey: addressData.key });
    }

    return await this.updateAccount(account, customerUpdateActions);
  };

  addBillingAddress: (account: Account, address: Address) => Promise<Account> = async (
    account: Account,
    address: Address,
  ) => {
    const customerUpdateActions: CustomerUpdateAction[] = [];

    let addressData = AccountMapper.addressToCommercetoolsAddress(address);

    if (addressData.id !== undefined) {
      addressData = {
        ...addressData,
        id: undefined,
      };
    }

    customerUpdateActions.push({ action: 'addAddress', address: addressData });
    customerUpdateActions.push({ action: 'addBillingAddressId', addressKey: addressData.key });

    if (address.isDefaultBillingAddress) {
      customerUpdateActions.push({ action: 'setDefaultBillingAddress', addressKey: addressData.key });
    }

    return await this.updateAccount(account, customerUpdateActions);
  };

  updateAddress: (account: Account, address: Address) => Promise<Account> = async (
    account: Account,
    address: Address,
  ) => {
    const customerUpdateActions: CustomerUpdateAction[] = [];

    let addressData = AccountMapper.addressToCommercetoolsAddress(address);

    if (addressData.id !== undefined) {
      addressData = {
        ...addressData,
        id: undefined,
      };
    }

    if (address.isDefaultBillingAddress || address.isDefaultShippingAddress) {
      addressData = {
        ...addressData,
        key: Guid.newGuid(),
      };
    }

    customerUpdateActions.push({ action: 'changeAddress', addressId: address.addressId, address: addressData });

    if (address.isDefaultBillingAddress) {
      customerUpdateActions.push({ action: 'setDefaultBillingAddress', addressKey: addressData.key });
    }

    if (address.isDefaultShippingAddress) {
      customerUpdateActions.push({ action: 'setDefaultShippingAddress', addressKey: addressData.key });
    }

    return await this.updateAccount(account, customerUpdateActions);
  };

  removeAddress: (account: Account, address: Address) => Promise<Account> = async (
    account: Account,
    address: Address,
  ) => {
    const customerUpdateActions: CustomerUpdateAction[] = [];

    const addressData = AccountMapper.addressToCommercetoolsAddress(address);

    if (addressData.id === undefined) {
      throw new ValidationError({ message: `The address passed doesn't contain an id.` });
    }

    customerUpdateActions.push({ action: 'removeAddress', addressId: address.addressId });

    return await this.updateAccount(account, customerUpdateActions);
  };

  setDefaultBillingAddress: (account: Account, address: Address) => Promise<Account> = async (
    account: Account,
    address: Address,
  ) => {
    const customerUpdateActions: CustomerUpdateAction[] = [];

    const addressData = AccountMapper.addressToCommercetoolsAddress(address);

    customerUpdateActions.push({ action: 'setDefaultBillingAddress', addressId: addressData.id });

    return await this.updateAccount(account, customerUpdateActions);
  };

  setDefaultShippingAddress: (account: Account, address: Address) => Promise<Account> = async (
    account: Account,
    address: Address,
  ) => {
    const customerUpdateActions: CustomerUpdateAction[] = [];

    const addressData = AccountMapper.addressToCommercetoolsAddress(address);

    customerUpdateActions.push({ action: 'setDefaultShippingAddress', addressId: addressData.id });

    return await this.updateAccount(account, customerUpdateActions);
  };

  protected extractAddresses(account: Account) {
    const commercetoolsAddresses: BaseAddress[] = [];
    const billingAddresses: number[] = [];
    const shippingAddresses: number[] = [];
    let defaultBillingAddress: number | undefined;
    let defaultShippingAddress: number | undefined;

    account.addresses.forEach((address, key) => {
      const addressData = AccountMapper.addressToCommercetoolsAddress(address);

      commercetoolsAddresses.push(addressData);

      if (address.isDefaultBillingAddress) {
        billingAddresses.push(key);
        defaultBillingAddress = key;
      }

      if (address.isDefaultShippingAddress) {
        shippingAddresses.push(key);
        defaultShippingAddress = key;
      }
    });

    return {
      commercetoolsAddresses,
      billingAddresses,
      shippingAddresses,
      defaultBillingAddress,
      defaultShippingAddress,
    };
  }

  protected async fetchAccountVersion(account: Account): Promise<number | undefined> {
    const commercetoolsAccount = await this.requestBuilder()
      .customers()
      .withId({ ID: account.accountId })
      .get()
      .execute()
      .catch((error) => {
        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
      });

    return commercetoolsAccount.body?.version;
  }

  protected async updateAccount(account: Account, customerUpdateActions: CustomerUpdateAction[]) {
    const accountVersion = await this.fetchAccountVersion(account);

    const customerUpdate: CustomerUpdate = {
      version: accountVersion,
      actions: customerUpdateActions,
    };

    return await this.requestBuilder()
      .customers()
      .withId({ ID: account.accountId })
      .post({
        body: customerUpdate,
      })
      .execute()
      .then((response) => {
        return AccountMapper.commercetoolsCustomerToAccount(response.body);
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
      });
  }

  protected async getConfirmationToken(account: Account): Promise<AccountToken> {
    return await this.requestBuilder()
      .customers()
      .emailToken()
      .post({
        body: {
          id: account.accountId,
          ttlMinutes: 2 * 7 * 24 * 60,
        },
      })
      .execute()
      .then((response) => {
        const accountToken: AccountToken = {
          email: account.email,
          token: response.body.value,
          tokenValidUntil: new Date(response.body.expiresAt),
        };

        return accountToken;
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
      });
  }

  async delete(account: Account) {
    return this.requestBuilder()
      .customers()
      .withId({ ID: account.accountId })
      .delete({
        queryArgs: {
          version: account.version,
          dataErasure: true,
        },
      })
      .execute()
      .then((response) => response.body)
      .catch((error) => {
        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
      });
  }
}
