import { Result } from 'shared/types/product/Result';
import { getTranslations } from 'helpers/i18n/get-translations';
import getServerOptions from 'helpers/server/get-server-options';
import { Providers } from 'providers';
import { sdk } from 'sdk';
import { PageProps } from 'types/next';
import PreviewRenderer from 'frontastic/preview-renderer';

export const fetchCache = 'force-no-store';

export default async function Page({ params, searchParams }: PageProps) {
  const { locale, previewId } = params;

  sdk.defaultConfigure(locale);

  const response = await sdk.page.getPreview({ previewId: previewId as string });

  if (response.isError) return <></>;

  const categoriesResult = await sdk.callAction<Result>({
    actionName: 'product/queryCategories',
    query: { format: 'tree', limit: 99 },
    ...getServerOptions(),
  });

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
    <Providers translations={translations}>
      <PreviewRenderer
        data={response.data}
        params={params}
        searchParams={searchParams}
        categories={categoriesResult.isError ? [] : categoriesResult.data.items}
      />
    </Providers>
  );
}
