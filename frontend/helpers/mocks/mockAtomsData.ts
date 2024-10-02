import { DropdownProps } from 'components/commercetools-ui/atoms/dropdown';
import { Market } from 'components/commercetools-ui/organisms/header/types';

export const accordionMockItems = [
  {
    title: 'First Title',
    content:
      ' We built Tailwind UI as an HTML-only, bring-your-own-JS product to make it as universal as possible, but many designs are inherently interactive and porting those interactive behaviors between JavaScript frameworks is unfortunately not always very easy.',
  },
  {
    title: 'Second Title',
    content:
      ' We built Tailwind UI as an HTML-only, bring-your-own-JS product to make it as universal as possible, but many designs are inherently interactive and porting those interactive behaviors between JavaScript frameworks is unfortunately not always very easy.',
  },
  {
    title: 'Third Title',
    content:
      ' We built Tailwind UI as an HTML-only, bring-your-own-JS product to make it as universal as possible, but many designs are inherently interactive and porting those interactive behaviors between JavaScript frameworks is unfortunately not always very easy.',
  },
];

export const accordionFAQMockItems = [
  {
    title: 'First Question',
    content:
      ' We built Tailwind UI as an HTML-only, bring-your-own-JS product to make it as universal as possible, but many designs are inherently interactive and porting those interactive behaviors between JavaScript frameworks is unfortunately not always very easy.',
  },
  {
    title: 'Second Question',
    content:
      ' We built Tailwind UI as an HTML-only, bring-your-own-JS product to make it as universal as possible, but many designs are inherently interactive and porting those interactive behaviors between JavaScript frameworks is unfortunately not always very easy.',
  },
  {
    title: 'Third Question',
    content:
      ' We built Tailwind UI as an HTML-only, bring-your-own-JS product to make it as universal as possible, but many designs are inherently interactive and porting those interactive behaviors between JavaScript frameworks is unfortunately not always very easy.',
  },
];

export const dropdownItems: DropdownProps['items'] = Array(5)
  .fill('option')
  .map((val, index) => {
    return {
      label: `${val}  ${index + 1}`,
      value: `${val}-${index + 1}`,
    };
  });

export const dropDownMarket: Market = {
  locale: 'en_US@USD',
  currency: 'USD',
  currencyCode: '£',
  flag: 'GB',
  region: 'United Kingdom',
};

export const dropDownMarkets: Market[] = [
  {
    locale: 'en_US@USD',
    currency: 'USD',
    currencyCode: '£',
    flag: 'GB',
    region: 'United Kingdom',
  },
  {
    locale: 'fr_DE@EUR',
    currency: 'EUR',
    currencyCode: '€',
    flag: 'france',
    region: 'France',
  },
  {
    locale: 'gr_DE@EUR',
    currency: 'EUR',
    currencyCode: '€',
    flag: 'greece',
    region: 'Greece',
  },
  {
    locale: 'it_DE@EUR',
    currency: 'EUR',
    currencyCode: '€',
    flag: 'italy',
    region: 'Italy',
  },
  {
    locale: 'du_DE@EUR',
    currency: 'EUR',
    currencyCode: '€',
    flag: 'netherlands',
    region: 'Netherlands',
  },
  {
    locale: 'du_DE@EUR',
    currency: 'EUR',
    currencyCode: '€',
    flag: 'portugal',
    region: 'Portugal',
  },
  {
    locale: 'du_DE@EUR',
    currency: 'EUR',
    currencyCode: '€',
    flag: 'spain',
    region: 'Spain',
  },
  {
    locale: 'du_DE@EUR',
    currency: 'EUR',
    currencyCode: '€',
    flag: 'sweden',
    region: 'Sweden',
  },
  {
    locale: 'de_DE@EUR',
    currency: 'EUR',
    currencyCode: '€',
    flag: 'DE',
    region: 'Germany',
  },
  {
    locale: 'en_US@USD',
    currency: 'USD',
    currencyCode: '$',
    flag: 'US',
    region: 'United states of America',
  },
];
