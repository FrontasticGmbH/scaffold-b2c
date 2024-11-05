import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import GASnippet from 'components/headless/GASnippet';
import { getTranslations } from 'helpers/i18n/get-translations';
import fetchAccount from 'helpers/server/fetch-account';
import fetchCategories from 'helpers/server/fetch-categories';
import fetchPageData from 'helpers/server/fetch-page-data';
import { Providers } from 'providers';
import { sdk } from 'sdk';
import { PageProps } from 'types/next';
import { RedirectResponse } from 'frontastic';
import Renderer from 'frontastic/renderer';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { locale: nextLocale } = params;

  sdk.defaultConfigure(nextLocale);

  const response = await fetchPageData(params, searchParams);

  if (response.isError || !response.data.pageFolder) return {};

  const { seoTitle, seoDescription, seoKeywords } = response.data.pageFolder.configuration;

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: seoKeywords,
  };
}

export default async function Page({ params, searchParams }: PageProps) {
  const { locale } = params;

  sdk.defaultConfigure(locale);

  const [page, accountResult, categoriesResult] = await Promise.all([
    fetchPageData(params, searchParams),
    fetchAccount(),
    fetchCategories({ format: 'tree' }),
  ]);

  if (page.isError) return redirect('/404');

  const redirectResponse = page.data as unknown as RedirectResponse;
  if (typeof redirectResponse.target === 'string') redirect(redirectResponse.target);

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
    <div data-theme={(!page.isError && page.data.pageFolder.configuration.displayTheme) ?? 'default'}>
      <Providers translations={translations} accountResult={accountResult} page={page}>
        <Renderer
          data={page.data}
          params={params}
          searchParams={searchParams}
          categories={categoriesResult.isError ? [] : categoriesResult.data.items}
        />
        <GASnippet />
      </Providers>

      <div id="react-modal-custom-portal" />
    </div>
  );
}
