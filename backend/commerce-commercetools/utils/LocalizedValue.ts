import { LocalizedString, TypedMoney } from '@commercetools/platform-sdk';
import { Money } from '@Types/product/Money';
import { Locale } from '../Locale';

export default class LocalizedValue {
  static getLocalizedValue = (locale: Locale, defaultLocale: string, productValue?: LocalizedString): string => {
    if (!productValue) {
      return '';
    }
    if (productValue[locale.language]) {
      return productValue[locale.language];
    }
    if (productValue[defaultLocale]) {
      return productValue[defaultLocale];
    }

    return Object.values(productValue)[0];
  };

  static getLocalizedCurrencyValue(locale: Locale, money: TypedMoney[]): Money | undefined {
    if (money.length === 0) {
      return undefined;
    }

    for (const value of money) {
      if (value.currencyCode === locale.currency) {
        return value;
      }
    }
    return money[0];
  }
}
