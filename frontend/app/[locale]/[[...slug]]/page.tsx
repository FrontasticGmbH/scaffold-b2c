import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { RedirectResponse } from '@commercetools/frontend-sdk';
import GASnippet from 'components/headless/GASnippet';
import { getTranslations } from 'helpers/i18n/get-translations';
import fetchAccount from 'helpers/server/fetch-account';
import fetchCategories from 'helpers/server/fetch-categories';
import fetchPageData from 'helpers/server/fetch-page-data';
import { isRedirectResponse } from 'helpers/server/is-redirect-response';
import { Providers } from 'providers';
import { sdk } from 'sdk';
import { PageProps } from 'types/next';
import Renderer from 'frontastic/renderer';

export const dynamic = 'force-dynamic';

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { locale: nextLocale } = params;

  sdk.defaultConfigure(nextLocale);

  const response = await fetchPageData(params, searchParams);

  if (response.isError || isRedirectResponse(response.data)) {
    return {};
  }

  const { seoTitle, seoDescription, seoKeywords } = response.data.pageFolder?.configuration ?? {};

  return {
    title: seoTitle ?? '',
    description: seoDescription ?? '',
    keywords: seoKeywords ?? '',
  };
}

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { locale } = params;

  sdk.defaultConfigure(locale);

  const [page, accountResult, categoriesResult, flattenedCategoriesResult] = await Promise.all([
    fetchPageData(params, searchParams),
    fetchAccount(),
    fetchCategories({ format: 'tree' }),
    fetchCategories({ format: 'flat' }),
  ]);

  if (page.isError) {
    return redirect('/404');
  }

  if (isRedirectResponse(page.data)) {
    redirect((page.data as RedirectResponse).target);
  }

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
      <Providers
        translations={translations}
        accountResult={accountResult}
        flattenedCategories={flattenedCategoriesResult.isError ? [] : flattenedCategoriesResult.data.items}
        page={{ ...page, data: page.data }}
      >
        <Renderer
          data={page.data}
          params={params}
          searchParams={searchParams}
          categories={categoriesResult.isError ? [] : categoriesResult.data.items}
          flattenedCategories={flattenedCategoriesResult.isError ? [] : flattenedCategoriesResult.data.items}
        />
        <GASnippet />
      </Providers>

      <div id="react-modal-custom-portal" />
    </div>
  );
}
