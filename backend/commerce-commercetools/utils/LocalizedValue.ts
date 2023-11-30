import { Locale } from '../Locale';
import { LocalizedString } from '@commercetools/platform-sdk';

export default class LocalizedValue {
  static getLocalizedValue = (locale: Locale, defaultLocale: string, productValue?: LocalizedString): string => {
    if (!productValue) {
      return '';
    }
    if (productValue[locale.language]) {
      return productValue[locale.language];
    }
    if (productValue[locale.language]) {
      return productValue[locale.language];
    }
    if (productValue[defaultLocale]) {
      return productValue[defaultLocale];
    }

    return productValue[0];
  };
}
