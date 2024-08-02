import { getTranslations } from 'helpers/i18n/get-translations';
import fetchCategories from 'helpers/server/fetch-categories';
import fetchPreview from 'helpers/server/fetch-preview';
import { Providers } from 'providers';
import { sdk } from 'sdk';
import { PageProps } from 'types/next';
import PreviewRenderer from 'frontastic/preview-renderer';

export const fetchCache = 'force-no-store';

export default async function Page({ params, searchParams }: PageProps) {
  const { locale, previewId } = params;

  sdk.defaultConfigure(locale);

  const [page, categoriesResult] = await Promise.all([
    fetchPreview(previewId as string),
    fetchCategories({ format: 'tree' }),
  ]);

  if (page.isError) return <></>;

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
      <Providers translations={translations} page={page}>
        <PreviewRenderer
          data={page.data}
          params={params}
          searchParams={searchParams}
          categories={categoriesResult.isError ? [] : categoriesResult.data.items}
        />
      </Providers>

      <div id="react-modal-custom-portal" />
    </div>
  );
}
