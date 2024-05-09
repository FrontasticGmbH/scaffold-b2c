import { Translations } from 'types/i18n';

export const getTranslations = async (locales: string[], namespaces: string[]) => {
  const translations = {} as Translations;

  await Promise.all(
    locales.map(async (locale) => {
      translations[locale] = {};

      return await Promise.all(
        namespaces.map(async (namespace) => {
          const data = await import(`translations/${locale}/${namespace}.json`).then((m) => m.default);

          translations[locale][namespace] = data;
        }),
      );
    }),
  );

  return translations;
};
