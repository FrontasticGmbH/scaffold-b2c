import { NextRequest, NextResponse } from 'next/server';
import Negotiator from 'negotiator';
import i18nConfig from './i18n.config';

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

    locale = storedLocale || preferredLocale || i18nConfig.defaultLocale;

    response = NextResponse.redirect(new URL(`/${locale}${path}`, request.url));
  } else {
    locale = path.split('/')[1];

    response = NextResponse.next();
  }

  response.cookies.set('locale', locale, { maxAge: 60 * 60 * 24 * 7 * 4 * 12 * 100 }); // 100 years expiry

  return response;
}

export const config = {
  matcher: '/((?!api|_next|favicon|manifest|locales|storybook|images|sitemap|robots.txt|sw.js|workbox|icons).*)',
};
