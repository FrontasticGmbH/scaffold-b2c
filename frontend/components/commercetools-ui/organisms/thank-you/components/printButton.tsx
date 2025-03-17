import { FC } from 'react';
import { useTranslations } from 'use-intl';
import Button, { ButtonProps } from 'components/commercetools-ui/atoms/button';

type PrintButtonProps = ButtonProps & {
  onPrint: (e: React.FormEvent) => void;
};

const PrintButton: FC<PrintButtonProps> = ({ onPrint, ...props }) => {
  const translate = useTranslations();

  return (
    <Button type="submit" variant="secondary" onClick={onPrint} {...props}>
      {translate('thank-you.print-invoice')}
    </Button>
  );
};

export default PrintButton;
