import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Option } from 'components/commercetools-ui/atoms/dropdown';
import useCardNumberFormatter from './useFormatCredit';
import usePaymentHelpers from './usePaymentHelpers';
import { payments } from '..';

const useEditPaymentMethods = (paymentId: string) => {
  const router = useRouter();

  const payment = useMemo(() => {
    return payments.find((payment) => payment.id === paymentId);
  }, [paymentId]);
  const cardNumberFormatted = useCardNumberFormatter(payment?.cardNumber ?? '');
  const { hasNumbersAndSpaces } = usePaymentHelpers();
  const [cardNumber, setCardNumber] = useState(cardNumberFormatted);
  const [cardExpMonthDate, setCardExpMonthDate] = useState<Option | undefined>(payment?.cardExpiryMonth);
  const [cardExpYearDate, setCardExpYearDate] = useState<Option | undefined>(payment?.cardExpiryYear);

  useEffect(() => {
    setCardNumber(cardNumberFormatted);
    setCardExpMonthDate(payment?.cardExpiryMonth);
    setCardExpYearDate(payment?.cardExpiryYear);
  }, [paymentId, payment, cardNumberFormatted]);
  const concatCardNumber = useMemo(() => {
    return cardNumber.replaceAll(' ', '');
  }, [cardNumber]);

  const isCardNumber = () => concatCardNumber.length >= 12 && concatCardNumber.length <= 19;

  const handleCardNumberChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (hasNumbersAndSpaces(e.target.value)) {
        if (e.target.value.replaceAll(' ', '').length > 19) {
          e.preventDefault();
          setCardNumber(e.target.value.substring(0, e.target.value.length - 1));
        } else {
          setCardNumber(e.target.value);
        }
      }
    },
    [setCardNumber, hasNumbersAndSpaces],
  );

  const handleExpiryDateMonthChange = useCallback(
    (option: Option) => {
      setCardExpMonthDate(option);
    },
    [setCardExpMonthDate],
  );

  const handleExpiryDateYearChange = useCallback(
    (option: Option) => {
      setCardExpYearDate(option);
    },
    [setCardExpYearDate],
  );

  const handleDeleteClick = () => {
    router.push('/account#payment');
    payments.splice(
      payments.findIndex((payment) => payment.id === paymentId),
      1,
    );
  };

  const handleSaveClick = () => {
    if (!isCardNumber()) return;

    const updatedPaymentIndex = payments.findIndex((payment) => payment.id === paymentId);
    payments[updatedPaymentIndex] = {
      ...payments[updatedPaymentIndex],
      cardNumber: concatCardNumber ?? '',
      cardExpiryMonth: cardExpMonthDate ?? { name: '02', value: '02' },
      cardExpiryYear: cardExpYearDate ?? { name: '69', value: '69' },
    };

    router.push('/account#payment');
  };

  return {
    cardNumber,
    cardExpMonthDate,
    cardExpYearDate,
    isCardNumber,
    handleCardNumberChange,
    handleExpiryDateMonthChange,
    handleExpiryDateYearChange,
    handleDeleteClick,
    handleSaveClick,
  };
};
export default useEditPaymentMethods;
