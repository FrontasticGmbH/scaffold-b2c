import { FC } from 'react';
import Link from 'components/commercetools-ui/atoms/link';
import Button from '../../../atoms/button';
import { CheckoutButtonProps } from '../types';
import { Tooltip } from 'react-tooltip';
import { useTranslations } from 'next-intl';

const CheckoutButton: FC<CheckoutButtonProps> = ({ className, link, disabled, text, onClick, hasOutOfStockItems }) => {
  const translate = useTranslations();

  return (
    <div className={className}>
      <Link link={link}>
        <Button
          data-tooltip-id="checkout-button"
          data-tooltip-content={translate('cart.remove-sold-item')}
          data-tooltip-place="left"
          disabled={disabled}
          size="full"
          onClick={onClick}
        >
          {text}
        </Button>
      </Link>
      {hasOutOfStockItems && <Tooltip id="checkout-button" style={{ whiteSpace: 'pre-line' }} />}
    </div>
  );
};

export default CheckoutButton;
