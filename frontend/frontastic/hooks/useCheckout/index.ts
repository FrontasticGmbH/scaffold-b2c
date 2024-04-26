import { useEffect, useState } from 'react';
import { Token } from 'shared/types/Token';
import { sdk } from 'sdk';

const useCheckout = () => {
  const [session, setSession] = useState<Token>();
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    sdk.composableCommerce.cart.getCheckoutSessionToken().then((res) => {
      if (!res.isError) setSession(res.data);
      else setIsExpired(true);
    });
  }, []);

  return { session, isExpired };
};

export default useCheckout;
