import React from 'react';
import { useFormat } from 'helpers/hooks/useFormat';

const Secure = () => {
  const { formatMessage: formatCheckoutMessage } = useFormat({ name: 'checkout' });

  return (
    <div className="my-24 hidden border-b border-b-neutral-400 bg-neutral-200 pb-24 lg:block">
      <p className="text-22 capitalize">
        {formatCheckoutMessage({ id: 'secure.checkout', defaultMessage: 'Secure checkout' })}
      </p>
    </div>
  );
};

export default Secure;
