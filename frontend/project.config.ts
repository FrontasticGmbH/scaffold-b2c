import { Currency } from '@commercetools/frontend-sdk/lib/types/Currency';

interface LocalizationMapping {
  locale: string;
  currency: Currency;
  currencyCode: string;
  countryName: string;
  countryCode: string;
}

const localizationMapper = {
  en: {
    locale: 'en_US',
    currency: 'USD',
    currencyCode: '$',
    countryCode: 'US',
    countryName: 'United States',
  },
  de: {
    locale: 'de_DE',
    currency: 'EUR',
    currencyCode: '€',
    countryCode: 'DE',
    countryName: 'Germany',
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
