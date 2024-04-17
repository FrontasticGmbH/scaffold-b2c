import useSWR from 'swr';
import { sdk } from 'sdk';

const useCheckout = () => {
  const { data } = useSWR('/action/cart/getCheckoutSessionToken', () =>
    sdk.composableCommerce.cart.getCheckoutSessionToken(),
  );

  const session = data?.isError ? null : data?.data;

  const isExpired = data?.isError;

  return { session, isExpired };
};

export default useCheckout;
