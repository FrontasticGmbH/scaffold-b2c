import { Product } from 'shared/types/product/Product';
import { SiteMapField, generateSiteMap } from 'helpers/sitemap';
import { sdk } from 'sdk';

export async function GET() {
  const locale = 'en';

  const siteUrl = process.env.SITE_URL;

  sdk.defaultConfigure(locale);

  const fields = [] as SiteMapField[];

  let nextCursor: string | undefined;

  do {
    const extensions = sdk.composableCommerce;

    const response = await extensions.product.query({ cursor: nextCursor, limit: 12 });

    const items = (response.isError ? [] : response.data.items) as Product[];

    fields.push(
      ...items.map((product) => ({
        loc: `${siteUrl}/${locale}${product._url}`,
        lastmod: new Date().toISOString(),
        changefreq: 'daily' as const,
      })),
    );

    nextCursor = !response.isError ? response.data.nextCursor : undefined;
  } while (nextCursor);

  return new Response(generateSiteMap(fields), {
    headers: {
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate',
      'Content-Type': 'application/xml',
    },
  });
}
