import useSWR from 'swr';
import { sdk } from 'sdk';

const useCheckoutToken = () => {
  const { data } = useSWR('/action/cart/getCheckoutToken', () =>
    sdk.callAction<{ token: string }>({ actionName: 'cart/getCheckoutToken' }),
  );

  const accessToken = data?.isError ? undefined : data?.data.token;

  const isExpired =
    data?.isError &&
    data?.error.message === 'Error: The checkout token has expired and can not be refreshed. Please login again.';

  return { accessToken, isExpired };
};

export default useCheckoutToken;
