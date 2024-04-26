import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import GASnippet from 'components/headless/GASnippet';
import { getTranslations } from 'helpers/i18n/get-translations';
import fetchAccount from 'helpers/server/fetch-account';
import fetchCategories from 'helpers/server/fetch-categories';
import fetchPageData from 'helpers/server/fetch-page-data';
import { getLocalizationInfo } from 'project.config';
import { Providers } from 'providers';
import { sdk } from 'sdk';
import { PageProps } from 'types/next';
import Renderer from 'frontastic/renderer';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { locale: nextLocale, slug } = params;

  sdk.defaultConfigure(nextLocale);

  const response = await fetchPageData(slug as string[], searchParams);

  if (response.isError) return {};

  const { seoTitle, seoDescription, seoKeywords } = response.data.pageFolder.configuration;

  const { locale } = getLocalizationInfo(nextLocale);

  return {
    title: seoTitle?.[locale],
    description: seoDescription?.[locale],
    keywords: seoKeywords?.[locale],
  };
}

export default async function Page({ params, searchParams }: PageProps) {
  const { locale, slug } = params;

  sdk.defaultConfigure(locale);

  const [page, accountResult, categoriesResult] = await Promise.all([
    fetchPageData(slug as string[], searchParams),
    fetchAccount(),
    fetchCategories({ format: 'tree' }),
  ]);

  if (page.isError) return redirect('/404');

  const translations = await getTranslations(
    [locale],
    [
      'common',
      'cart',
      'product',
      'payment',
      'checkout',
      'account',
      'customer-support',
      'error',
      'success',
      'wishlist',
      'newsletter',
      'orders',
      'thank-you',
    ],
  );

  return (
    <Providers translations={translations} accountResult={accountResult} tracing={page.tracing}>
      <Renderer
        data={page.data}
        params={params}
        searchParams={searchParams}
        categories={categoriesResult.isError ? [] : categoriesResult.data.items}
      />
      <GASnippet />
    </Providers>
  );
}
