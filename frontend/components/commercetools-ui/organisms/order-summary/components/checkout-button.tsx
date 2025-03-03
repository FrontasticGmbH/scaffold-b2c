import { FC } from 'react';
import Link from 'components/commercetools-ui/atoms/link';
import { CheckoutButtonProps } from '../types';

const CheckoutButton: FC<CheckoutButtonProps> = ({ className, link, disabled, text, onClick }) => {
  return (
    <div className={className}>
      <Link link={link}>
        <button
          disabled={disabled}
          className="w-full rounded-md bg-primary py-12 font-medium text-white transition hover:bg-gray-500 disabled:cursor-not-allowed disabled:bg-neutral-400"
          onClick={onClick}
        >
          {text}
        </button>
      </Link>
    </div>
  );
};

export default CheckoutButton;
