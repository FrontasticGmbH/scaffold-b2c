import { Translations } from 'types/i18n';

export const getTranslations = async (locales: string[], namespaces: string[]) => {
  const translations = {} as Translations;

  await Promise.all(
    locales.map(async (locale) => {
      translations[locale] = {};

      return await Promise.all(
        namespaces.map(async (namespace) => {
          const data = await import(`translations/${locale}/${namespace}.json`)
            .then((m) => m.default)
            .catch(async () => {
              if (locale.indexOf('-') >= 0) {
                const [language] = locale.split('-');
                return await import(`translations/${language}/${namespace}.json`)
                  .then((m) => m.default)
                  .catch(() =>
                    console.log(
                      `Cannot find either translations/${locale}/${namespace}.json or translations/${language}/${namespace}.json`,
                    ),
                  );
              } else {
                console.log(`Cannot find translations/${locale}/${namespace}.json`);
              }
            });
          if (data) {
            translations[locale][namespace] = data;
          }
        }),
      );
    }),
  );

  return translations;
};
