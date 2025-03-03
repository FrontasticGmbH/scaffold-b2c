import { FC } from 'react';
import Image from 'components/commercetools-ui/atoms/image';
import { useFormat } from 'helpers/hooks/useFormat';
import { PaymentMethodsProps } from '../types';

const PaymentMethods: FC<PaymentMethodsProps> = ({ paymentMethods }) => {
  const { formatMessage: formatCartMessage } = useFormat({ name: 'cart' });

  return (
    <div className="mt-20 md:mt-24 lg:mt-16">
      <div className="hidden lg:block">
        <p className="text-14 leading-[20px] text-gray-600">
          {formatCartMessage({ id: 'we.accept', defaultMessage: 'We accept' })}
        </p>
      </div>
      <div className="mt-26 flex items-center justify-start gap-14 md:justify-center lg:mt-16 lg:justify-start">
        {paymentMethods.map(({ name, image }) => (
          <div key={name} className="relative size-30">
            <Image {...image} fill style={{ objectFit: 'contain' }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethods;
