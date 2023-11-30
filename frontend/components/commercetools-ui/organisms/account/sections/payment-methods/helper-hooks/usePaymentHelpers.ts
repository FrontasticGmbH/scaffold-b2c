import { useCallback, useMemo } from 'react';
import { Option } from 'components/commercetools-ui/atoms/dropdown';

const usePaymentHelpers = () => {
  const expiryDateMonthOptions = useMemo(() => {
    let month = 1;

    const options = [{ name: 'MM', value: 'MM' }] as Option[];

    while (month <= 12) {
      options.push({
        name: `${month}`.padStart(2, '0'),
        value: `${month}`.padStart(2, '0'),
      });

      month += 1;
    }
    return options;
  }, []);

  const expiryDateYearOptions = useMemo(() => {
    const now = new Date();
    let year = now.getFullYear();

    const options = [{ name: 'YY', value: 'YY' }] as Option[];

    while (year < now.getFullYear() + 10) {
      options.push({
        name: `${year.toString().slice(2)}`,
        value: `${year}`,
      });

      year += 1;
    }

    return options;
  }, []);

  const hasNumbersAndSpaces = useCallback((text: string) => {
    const numAndSpaceRegex = /^ *[0-9][0-9 ]*$/;

    if (text.length > 0 && !numAndSpaceRegex.test(text)) return false;
    else return true;
  }, []);

  return {
    hasNumbersAndSpaces,
    expiryDateMonthOptions,
    expiryDateYearOptions,
  };
};
export default usePaymentHelpers;
