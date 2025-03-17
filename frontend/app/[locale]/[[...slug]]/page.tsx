import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { RedirectResponse } from '@commercetools/frontend-sdk';
import GASnippet from 'components/headless/GASnippet';
import fetchAccount from 'helpers/server/fetch-account';
import fetchCategories from 'helpers/server/fetch-categories';
import fetchPageData from 'helpers/server/fetch-page-data';
import fetchProjectSettings from 'helpers/server/fetch-project-settings';
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

  const [page, accountResult, projectSettings, categoriesResult, flattenedCategoriesResult] = await Promise.all([
    fetchPageData(params, searchParams),
    fetchAccount(),
    fetchProjectSettings(),
    fetchCategories({ format: 'tree' }),
    fetchCategories({ format: 'flat' }),
  ]);

  if (page.isError) {
    return redirect('/404');
  }

  if (isRedirectResponse(page.data)) {
    redirect((page.data as RedirectResponse).target);
  }

  return (
    <div data-theme={(!page.isError && page.data.pageFolder.configuration.displayTheme) ?? 'default'}>
      <Providers
        accountResult={accountResult}
        flattenedCategories={flattenedCategoriesResult.isError ? [] : flattenedCategoriesResult.data.items}
        page={{ ...page, data: page.data }}
        projectSettings={projectSettings}
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
