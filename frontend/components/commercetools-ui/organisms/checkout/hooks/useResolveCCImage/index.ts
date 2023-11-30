import { useCallback } from 'react';
import ccType from 'credit-card-type';

const useResolveCCImage = () => {
  const resolveCCImage = useCallback((number: string) => {
    const types = ccType(number);

    if (!number || types.length == 0) return '';

    return (
      {
        visa: '/images/visa.svg',
        mastercard: '/images/mc.svg',
      }[types[0].type] ?? ''
    );
  }, []);

  return resolveCCImage;
};

export default useResolveCCImage;
