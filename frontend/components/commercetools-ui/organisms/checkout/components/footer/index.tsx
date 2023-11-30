import React from 'react';
import Link from 'components/commercetools-ui/atoms/link';
import { useFormat } from 'helpers/hooks/useFormat';

const Footer = () => {
  const { formatMessage: formatCartMessage } = useFormat({ name: 'cart' });

  return (
    <div className="mt-24 px-16 pb-36 md:mt-26 lg:mt-72">
      <p className="text-center text-12 text-secondary-black">
        {formatCartMessage({ id: 'terms.agree', defaultMessage: 'By placing your order, you agree to the' })}{' '}
        <Link link="#" className="underline decoration-secondary-black underline-offset-2">
          {formatCartMessage({ id: 'terms.and.conditions', defaultMessage: 'Terms & Conditions' })}
        </Link>{' '}
        of The Good Store Home
      </p>
    </div>
  );
};

export default Footer;
