import { useMemo, useCallback } from 'react';
import { Account, Address } from 'shared/types/account';
import useSWR, { mutate } from 'swr';
import { sdk } from 'sdk';
import { revalidateOptions } from 'frontastic';
import { GetAccountResult, RegisterAccount, UpdateAccount, UseAccountReturn } from './types';

const useAccount = (): UseAccountReturn => {
  const extensions = sdk.composableCommerce;

  const result = useSWR('/action/account/getAccount', extensions.account.getAccount, revalidateOptions);

  const data = useMemo(() => {
    if (result.data?.isError) return { loggedIn: false, accountLoading: false, error: result.error };

    const account = (result.data?.data as GetAccountResult)?.account as Account;

    if (account?.accountId) return { account, loggedIn: true, accountLoading: false };

    return {
      loggedIn: false,
      account: undefined,
      accountLoading: true,
      error: result.error,
    };
  }, [result]);

  const shippingAddresses = useMemo(() => {
    if (!data.account) return [];

    return (data.account.addresses ?? []).filter((address) => address.isShippingAddress);
  }, [data.account]);

  const billingAddresses = useMemo(() => {
    if (!data.account) return [];

    return (data.account.addresses ?? []).filter((address) => address.isBillingAddress);
  }, [data.account]);

  const defaultShippingAddress = useMemo(() => {
    return data.account?.addresses?.find((address) => address.isDefaultShippingAddress);
  }, [data.account]);

  const defaultBillingAddress = useMemo(() => {
    return data.account?.addresses?.find((address) => address.isDefaultBillingAddress);
  }, [data.account]);

  const login = async (email: string, password: string, remember?: boolean): Promise<Account> => {
    const extensions = sdk.composableCommerce;

    const payload = {
      email,
      password,
      remember,
    };

    const res = await extensions.account.login(payload);

    mutate('/action/account/getAccount');
    mutate('/action/cart/getCart');
    mutate('/action/wishlist/getWishlist');

    return res.isError ? ({} as Account) : res.data;
  };

  const logout = useCallback(async () => {
    const extensions = sdk.composableCommerce;

    await extensions.account.logout();

    mutate('/action/account/getAccount');
    mutate('/action/cart/getCart');
    mutate('/action/wishlist/getWishlist');
  }, []);

  const register = useCallback(async (account: RegisterAccount): Promise<Account> => {
    const extensions = sdk.composableCommerce;

    const res = await extensions.account.register(account);

    return res.isError ? ({} as Account) : res.data;
  }, []);

  const confirm = useCallback(async (token: string): Promise<Account> => {
    const extensions = sdk.composableCommerce;

    const res = await extensions.account.confirm({ token });

    mutate('/action/account/getAccount');

    return res.isError ? ({} as Account) : res.data;
  }, []);

  const requestConfirmationEmail = useCallback(async (email: string, password: string): Promise<void> => {
    const extensions = sdk.composableCommerce;

    const payload = {
      email,
      password,
    };

    await extensions.account.requestConfirmationEmail(payload);
  }, []);

  const changePassword = useCallback(async (oldPassword: string, newPassword: string): Promise<Account> => {
    const extensions = sdk.composableCommerce;

    const res = await extensions.account.changePassword({ oldPassword, newPassword });

    return res.isError ? ({} as Account) : res.data;
  }, []);

  const requestPasswordReset = useCallback(async (email: string): Promise<void> => {
    const extensions = sdk.composableCommerce;

    const payload = {
      email,
    };

    await extensions.account.requestResetPassword(payload);
  }, []);

  const resetPassword = useCallback(async (token: string, newPassword: string): Promise<Account> => {
    const extensions = sdk.composableCommerce;

    const res = await extensions.account.resetPassword({ token, newPassword });

    mutate('/action/account/getAccount');

    return res.isError ? ({} as Account) : res.data;
  }, []);

  const update = useCallback(async (account: UpdateAccount): Promise<Account> => {
    const extensions = sdk.composableCommerce;

    const res = await extensions.account.updateAccount(account);

    mutate('/action/account/getAccount');

    return res.isError ? ({} as Account) : res.data;
  }, []);

  const addAddress = useCallback(async (address: Omit<Address, 'addressId'>): Promise<Account> => {
    const extensions = sdk.composableCommerce;

    const res = await extensions.account.addAddress(address);

    mutate('/action/account/getAccount');

    return res.isError ? ({} as Account) : res.data;
  }, []);

  const addShippingAddress = useCallback(async (address: Omit<Address, 'addressId'>): Promise<Account> => {
    const extensions = sdk.composableCommerce;

    const response = await extensions.account.getAccount();

    if (response.isError || !response.data.loggedIn) return {} as Account;

    const res = await sdk.callAction<Account>({
      actionName: 'account/addShippingAddress',
      payload: { account: response.data.account, address },
    });

    mutate('/action/account/getAccount');

    return res.isError ? ({} as Account) : res.data;
  }, []);

  const addBillingAddress = useCallback(async (address: Omit<Address, 'addressId'>): Promise<Account> => {
    const extensions = sdk.composableCommerce;

    const response = await extensions.account.getAccount();

    if (response.isError || !response.data.loggedIn) return {} as Account;

    const res = await sdk.callAction<Account>({
      actionName: 'account/addBillingAddress',
      payload: { account: response.data.account, address },
    });

    mutate('/action/account/getAccount');

    return res.isError ? ({} as Account) : res.data;
  }, []);

  const updateAddress = useCallback(async (address: Address): Promise<Account> => {
    const extensions = sdk.composableCommerce;

    const res = await extensions.account.updateAddress(address);

    mutate('/action/account/getAccount');

    return res.isError ? ({} as Account) : res.data;
  }, []);

  const removeAddress = useCallback(async (addressId: string): Promise<Account> => {
    const extensions = sdk.composableCommerce;

    const res = await extensions.account.removeAddress({ addressId });

    mutate('/action/account/getAccount');

    return res.isError ? ({} as Account) : res.data;
  }, []);

  const setDefaultBillingAddress = useCallback(async (addressId: string): Promise<Account> => {
    const extensions = sdk.composableCommerce;

    const res = await extensions.account.setDefaultBillingAddress({ addressId });

    mutate('/action/account/getAccount');

    return res.isError ? ({} as Account) : res.data;
  }, []);

  const setDefaultShippingAddress = useCallback(async (addressId: string): Promise<Account> => {
    const extensions = sdk.composableCommerce;

    const res = await extensions.account.setDefaultShippingAddress({ addressId });

    mutate('/action/account/getAccount');

    return res.isError ? ({} as Account) : res.data;
  }, []);

  return {
    ...data,
    shippingAddresses,
    billingAddresses,
    defaultShippingAddress,
    defaultBillingAddress,
    login,
    logout,
    register,
    confirm,
    requestConfirmationEmail,
    changePassword,
    requestPasswordReset,
    resetPassword,
    update,
    addAddress,
    addBillingAddress,
    addShippingAddress,
    updateAddress,
    removeAddress,
    setDefaultBillingAddress,
    setDefaultShippingAddress,
  };
};

export default useAccount;
