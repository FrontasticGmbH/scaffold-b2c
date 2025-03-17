import { FC } from 'react';
import Link from 'components/commercetools-ui/atoms/link';
import Button from '../../../atoms/button';
import { CheckoutButtonProps } from '../types';

const CheckoutButton: FC<CheckoutButtonProps> = ({ className, link, disabled, text, onClick }) => {
  return (
    <div className={className}>
      <Link link={link}>
        <Button disabled={disabled} size="full" onClick={onClick}>
          {text}
        </Button>
      </Link>
    </div>
  );
};

export default CheckoutButton;
