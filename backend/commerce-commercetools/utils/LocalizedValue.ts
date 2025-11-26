import { LocalizedString, TypedMoney } from '@commercetools/platform-sdk';
import { Money } from '@Types/product/Money';
import { Locale } from '@Commerce-commercetools/interfaces/Locale';

export default class LocalizedValue {
  static getLocalizedValue = (locale: Locale, defaultLocale: Locale, productValue?: LocalizedString): string => {
    if (!productValue) {
      return '';
    }

    if (productValue[locale.language]) {
      return productValue[locale.language];
    }

    if (productValue[defaultLocale.language]) {
      return productValue[defaultLocale.language];
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
