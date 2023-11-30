import { useMemo } from 'react';

const useCardNumberFormatter = (cardNumber: string) => {
  const cardNumberFormatted = useMemo(() => {
    const spaceCheckerRegex = /\s+/g;
    const nonDigitCheckerRegex = /[^0-9]/gi;
    const inputString = cardNumber.replace(spaceCheckerRegex, '').replace(nonDigitCheckerRegex, '').substring(0, 19);
    const parts = [];

    for (let i = 0; i < inputString.length; i += 4) {
      parts.push(inputString.substring(i, i + 4));
    }

    return parts.length > 1 ? parts.join(' ') : cardNumber;
  }, [cardNumber]);

  return cardNumberFormatted;
};
export default useCardNumberFormatter;
