import React from 'react';

const router = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  prefetch: jest.fn(),
};

export const routing = {
  locales: ['en', 'de'],
  defaultLocale: 'en',
};

export const Link: React.FC<any> = ({ children, href, locale, ...props }) => {
  const defaultLocale = 'en';
  // Don't prepend locale for absolute URLs, relative paths, query params, or hrefs that already have locale
  const isAbsoluteUrl = href?.startsWith('http://') || href?.startsWith('https://') || href?.startsWith('//');
  const isQueryParams = href?.startsWith('?');
  const isRelativePath = href && !href.startsWith('/');
  const alreadyHasLocale = href?.startsWith(`/${defaultLocale}/`) || href?.startsWith(`/${locale}/`);

  let finalHref = href;
  if (!isAbsoluteUrl && !isQueryParams && !isRelativePath && !alreadyHasLocale && href && href.startsWith('/')) {
    const prependLocale = locale || defaultLocale;
    finalHref = `/${prependLocale}${href}`;
  }

  return (
    <a href={finalHref} {...props}>
      {children}
    </a>
  );
};

Link.displayName = 'Link';

export const redirect = (href: string) => {};

export const usePathname = () => '/en';

export const useRouter = () => router;

export const getPathname = () => '/en';
