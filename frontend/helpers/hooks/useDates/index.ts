import { useCallback } from 'react';
import { useTranslations } from 'use-intl';

const useDates = () => {
  const translate = useTranslations();

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
        return `${Math.floor(years)} ${translate('common.years')}`;
      } else if (Math.floor(months) > 1) {
        return `${Math.floor(months)} ${translate('common.months')}`;
      } else if (Math.floor(weeks) > 1) {
        return `${Math.floor(weeks)} ${translate('common.weeks')}`;
      } else if (Math.floor(days) > 1) {
        return `${Math.floor(days)} ${translate('common.days')}`;
      } else if (Math.floor(hours) > 1) {
        return `${Math.floor(hours)} ${translate('common.hours')}`;
      } else if (Math.floor(minutes) > 1) {
        return `${Math.floor(minutes)} ${translate('common.minutes')}`;
      } else {
        return `${Math.floor(seconds)} ${translate('common.seconds')}`;
      }
    },
    [translate],
  );

  return { representDateDiff };
};

export default useDates;
