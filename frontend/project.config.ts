import { Currency } from '@commercetools/frontend-sdk/lib/types/Currency';

interface LocalizationMapping {
  locale: string;
  localeName: string;
  currency: Currency;
  currencyCode: string;
  countryName: string;
  countryCode: string;
  countries: Array<string>;
}

const localizationMapper = {
  en: {
    locale: 'en-US',
    localeName: 'English',
    currency: 'USD',
    currencyCode: '$',
    countryCode: 'US',
    countryName: 'United States',
    countries: ['US'],
  },
  de: {
    locale: 'de-DE',
    localeName: 'German',
    currency: 'EUR',
    currencyCode: '€',
    countryCode: 'DE',
    countryName: 'Germany',
    countries: ['DE'],
  },
} as Record<string, LocalizationMapping>;

const locales = Object.keys(localizationMapper);
const defaultLocale = locales[0];

export const i18nConfig = { locales, defaultLocale };

export const getLocalizationInfo = (locale: string) => {
  if (!(locale in localizationMapper)) {
    console.warn(
      `Invalid locale ${locale} provided. Possible values are ${Object.keys(localizationMapper).join(', ')}`,
    );

    return localizationMapper[defaultLocale];
  }

  return localizationMapper[locale as keyof typeof localizationMapper];
};
