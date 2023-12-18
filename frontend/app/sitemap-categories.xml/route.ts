import { Category } from 'shared/types/product/Category';
//import { Result } from 'shared/types/product/Result';
import { SiteMapField, generateSiteMap } from 'helpers/sitemap';
import { sdk } from 'sdk';

export async function GET() {
  const locale = 'en';

  const siteUrl = process.env.SITE_URL;

  sdk.defaultConfigure(locale);

  const fields = [] as SiteMapField[];

  let nextCursor: string | undefined;

  const extensions = sdk.composableCommerce;

  do {
    /*const response = await sdk.callAction<Result>({
          actionName: 'product/queryCategories',
          payload: { cursor: nextCursor, limit: 12 },
        });*/

    const response = await extensions.product.queryCategories({ cursor: nextCursor, limit: 12 });

    const items = ((response.isError ? [] : response.data.items) ?? []) as Category[];

    fields.push(
      ...items.map((category) => ({
        loc: `${siteUrl}/${locale}${category._url}`,
        lastmod: new Date().toISOString(),
        changefreq: 'daily' as const,
      })),
    );

    nextCursor = (!response.isError && response.data.nextCursor) as string;
  } while (nextCursor);

  return new Response(generateSiteMap(fields), {
    headers: {
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate',
      'Content-Type': 'application/xml',
    },
  });
}
