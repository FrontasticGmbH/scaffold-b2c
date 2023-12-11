import useSWR from 'swr';
import { sdk } from 'sdk';

const useCheckoutToken = () => {
  const { data } = useSWR('/action/cart/getCheckoutToken', () =>
    sdk.callAction<{ token: string }>({ actionName: 'cart/getCheckoutToken' }),
  );

  const token = data?.isError ? undefined : data?.data.token;

  return token;
};

export default useCheckoutToken;
