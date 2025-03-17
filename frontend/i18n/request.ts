import { cookies } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

const loadMessageBundleWithFallback = async (locale: string) => {
  const data = await import(`../messages/${locale}.json`)
    .then((m) => m.default)
    .catch(async () => {
      if (locale.indexOf('-') >= 0) {
        const [language] = locale.split('-');
        return await import(`../messages/${language}.json`)
          .then((m) => m.default)
          .catch(() => console.log(`Cannot find either ../messages/${locale}.json or ../messages/${language}.json`));
      } else {
        console.log(`Cannot find ../messages/${locale}.json`);
      }
    });

  return data || {};
};

export default getRequestConfig(async () => {
  let locale = (await cookies()).get('locale')?.value;

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale)) {
    locale = routing.defaultLocale as string;
  }

  return {
    locale,
    messages: await loadMessageBundleWithFallback(locale),
  };
});
