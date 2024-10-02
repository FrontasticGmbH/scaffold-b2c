import { useCallback } from 'react';
import { useParams } from 'next/navigation';
import { TranslationOptions } from './types';
import { useI18n } from '../..';

const useTranslation = () => {
  const { translations } = useI18n();

  const { locale } = useParams();

  const translate = useCallback(
    (token: string, { values = {}, defaultMessage = '' }: TranslationOptions = {}) => {
      // Token will be like this {namespace}.{c1}.{c2}... (.eg: common.say.hi)

      const fallbackMessage = defaultMessage || token || '';

      if (!translations) return fallbackMessage;

      const firstDotIndex = token.indexOf('.');

      if (firstDotIndex === -1) return fallbackMessage;

      const [namespace, key] = [token.substring(0, firstDotIndex), token.substring(firstDotIndex + 1)];

      let message = translations[locale]?.[namespace]?.[key] ?? fallbackMessage;

      for (const placeholder of Object.keys(values)) {
        message = message.replace(new RegExp(`{${placeholder}}`, 'g'), (values[placeholder] ?? '').toString());
      }

      return message;
    },
    [translations, locale],
  );

  return { translate };
};

export default useTranslation;
