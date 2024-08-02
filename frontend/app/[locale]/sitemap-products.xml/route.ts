import { NextRequest } from 'next/server';
import { Product } from 'shared/types/product/Product';
import { generateSiteMap, SiteMapField } from 'helpers/sitemap';
import { i18nConfig } from 'project.config';
import { sdk } from 'sdk';

export async function GET(request: NextRequest, { params }: { params: { locale: string } }) {
  const locale = params.locale ?? i18nConfig.defaultLocale;

  const siteUrl = process.env.SITE_URL;

  sdk.defaultConfigure(locale);

  const fields = [] as SiteMapField[];

  let nextCursor: string | undefined;

  do {
    const extensions = sdk.composableCommerce;

    const response = await extensions.product.query({ cursor: nextCursor, limit: 500 });

    const items = [] as Product[];

    if (!response.isError && response.data.items != null) {
      items.push(...response.data.items);
    }

    fields.push(
      ...items?.map((product) => ({
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
