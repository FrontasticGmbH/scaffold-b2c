import { LocalizedString } from '@commercetools/platform-sdk';
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

    return productValue[0];
  };
}
