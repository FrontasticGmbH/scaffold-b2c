import { NextRequest, NextResponse } from 'next/server';
import Negotiator from 'negotiator';
import { i18nConfig } from './project.config';

export function middleware(request: NextRequest) {
  const headers = Object.fromEntries(request.headers.entries());
  const search = request.nextUrl.searchParams.toString();

  const path = request.nextUrl.pathname + (search ? `?${search}` : '');

  const pathMissingLocale = i18nConfig.locales.every((locale) => !path.startsWith(`/${locale}/`));

  let locale: string;
  let response: NextResponse;

  if (pathMissingLocale) {
    const storedLocale = request.cookies.get('locale')?.value;
    const preferredLocale = new Negotiator({ headers }).language(i18nConfig.locales);

    locale = [storedLocale, preferredLocale, i18nConfig.defaultLocale]
      .filter(Boolean)
      .filter((l) => i18nConfig.locales.includes(l as string))[0] as string;

    response = NextResponse.redirect(new URL(`/${locale}${path}`, request.url));
  } else {
    locale = path.split('/')[1];

    const containsMultipleLocaleOccurrences = new RegExp(`(/${locale}){2,2}`, 'g').exec(path);
    if (containsMultipleLocaleOccurrences) {
      response = NextResponse.redirect(
        new URL(path.replace(new RegExp(`(/${locale}){2,2}`, 'g'), `/${locale}/`), request.url),
      );
    } else {
      response = NextResponse.next();
    }
  }

  response.cookies.set('locale', locale, { maxAge: 60 * 60 * 24 * 7 * 4 * 12 * 100 }); // 100 years expiry

  return response;
}

export const config = {
  matcher:
    '/((?!api|_next|favicon|manifest|locales|storybook|images|sb-assets|sitemap|robots.txt|sw.js|workbox|icons).*)',
};
