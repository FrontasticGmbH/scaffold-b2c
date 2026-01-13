import React from 'react';

export const NextIntlClientProvider = ({ children }: { children: React.ReactNode }) => children;

export const useTranslations = () => (key: string, values?: Record<string, any>) => key;

export const useLocale = () => 'en';

export const useMessages = () => ({});

export const useFormatter = () => ({
  dateTime: (date: Date) => date.toISOString(),
  number: (num: number) => num.toString(),
});

export const useNow = () => new Date();

export const useTimeZone = () => 'UTC';

// Mock for next-intl/routing
export const defineRouting = (config: any) => config;

export const createNavigation = (routing: any) => ({
  Link: ({ children, href, locale, ...props }: any) => {
    const finalHref = locale ? `/${locale}${href}` : href;
    return (
      <a href={finalHref} {...props}>
        {children}
      </a>
    );
  },
  redirect: (href: string) => {},
  usePathname: () => '/en',
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  getPathname: () => '/en',
});

export const usePathname = () => '/en';

export const useRouter = () => ({
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  prefetch: jest.fn(),
});
