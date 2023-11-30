import { FC } from 'react';
import Button, { ButtonProps } from 'components/commercetools-ui/atoms/button';
import { useFormat } from 'helpers/hooks/useFormat';

type PrintButtonProps = ButtonProps & {
  onPrint: (e: React.FormEvent) => void;
};

const PrintButton: FC<PrintButtonProps> = ({ onPrint, ...props }) => {
  const { formatMessage } = useFormat({ name: 'thank-you' });

  return (
    <Button type="submit" variant="secondary" onClick={onPrint} {...props}>
      {formatMessage({ id: 'print.invoice', defaultMessage: 'Print invoice' })}
    </Button>
  );
};

export default PrintButton;
