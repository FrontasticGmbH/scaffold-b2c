import { NextRequest, NextResponse } from 'next/server';
import Negotiator from 'negotiator';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
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
    const containsMultipleLocaleOccurrences = new RegExp(`^/${locale}/.*(/${locale}/)`, 'g').test(path);
    if (containsMultipleLocaleOccurrences) {
      const correctedPath = path.replace(new RegExp(`^/${locale}/.*(/${locale}/)`), `/${locale}/`);
      response = NextResponse.redirect(new URL(correctedPath, request.url));
    } else {
      response = NextResponse.next();
    }
  }

  response.cookies.set('locale', locale, { maxAge: 60 * 60 * 24 * 7 * 4 * 12 * 100 }); // 100 years expiry

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next|favicon|manifest|storybook|images|sb-assets|sitemap\\.xml|robots\\.txt|sw\\.js|workbox|icons).*)',
  ],
};

export default createMiddleware(routing);
