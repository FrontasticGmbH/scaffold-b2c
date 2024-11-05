import { useCallback } from 'react';
import { useFormat } from '../useFormat';

const useDates = () => {
  const { formatMessage } = useFormat({ name: 'common' });

  const representDateDiff = useCallback(
    (smallerDate: Date, largerDate: Date) => {
      const diff = Math.abs(smallerDate.getTime() - largerDate.getTime());
      const seconds = diff / 1000;
      const minutes = seconds / 60;
      const hours = minutes / 60;
      const days = hours / 24;
      const weeks = days / 7;
      const months = days / 30.44;
      const years = days / 365.25;

      if (Math.floor(years) > 1) {
        return `${Math.floor(years)} ${formatMessage({ id: 'years', defaultMessage: 'years' })}`;
      } else if (Math.floor(months) > 1) {
        return `${Math.floor(months)} ${formatMessage({ id: 'months', defaultMessage: 'months' })}`;
      } else if (Math.floor(weeks) > 1) {
        return `${Math.floor(weeks)} ${formatMessage({ id: 'weeks', defaultMessage: 'weeks' })}`;
      } else if (Math.floor(days) > 1) {
        return `${Math.floor(days)} ${formatMessage({ id: 'days', defaultMessage: 'days' })}`;
      } else if (Math.floor(hours) > 1) {
        return `${Math.floor(hours)} ${formatMessage({ id: 'hours', defaultMessage: 'hours' })}`;
      } else if (Math.floor(minutes) > 1) {
        return `${Math.floor(minutes)} ${formatMessage({ id: 'minutes', defaultMessage: 'minutes' })}`;
      } else {
        return `${Math.floor(seconds)} ${formatMessage({ id: 'seconds', defaultMessage: 'seconds' })}`;
      }
    },
    [formatMessage],
  );

  return { representDateDiff };
};

export default useDates;
