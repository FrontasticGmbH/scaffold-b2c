import { useEffect, useState } from 'react';
import { sdk } from 'sdk';
import { Token } from 'shared/types/Token';

const useSession = () => {
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

export default useSession;
