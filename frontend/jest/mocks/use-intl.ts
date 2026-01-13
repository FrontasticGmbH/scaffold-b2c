import React from 'react';

export const useTranslations = () => (key: string, values?: Record<string, any>) => {
  // Map common translation keys to expected values
  const translations: Record<string, string> = {
    'wishlist.wishlist-add-to-cart': 'Move to Cart',
    'product.quick-view': 'Quick view',
    'product.add-to-cart': 'Add to cart',
    'product.sold-out': 'Sold out',
    'product.more-details': 'More details',
    'cart.more-details': 'More details',
    'cart.add-to-cart': 'Add to cart',
    'cart.cart-add': 'Add to cart',
    'product.discount-percentage': values?.percentage ? `${values.percentage}%` : '50%',
  };

  // Handle common.percentage with values
  if (key === 'common.percentage' && values?.value !== undefined) {
    const percentage = Math.round(values.value * 100);
    return `${percentage}%`;
  }

  // Handle discount percentage with values
  if (key === 'product.discount-percentage' && values?.percentage) {
    return `${values.percentage}%`;
  }

  return translations[key] || key;
};

export const useLocale = () => 'en';

export const useMessages = () => ({});

export const useFormatter = () => ({
  dateTime: (date: Date) => date.toISOString(),
  number: (num: number) => num.toString(),
});

export const useNow = () => new Date();

export const useTimeZone = () => 'UTC';

export const IntlProvider = ({ children }: { children: React.ReactNode }) => children;
