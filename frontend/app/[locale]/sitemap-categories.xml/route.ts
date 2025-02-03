import { NextRequest } from 'next/server';
import { Category } from 'shared/types/product/Category';
import { generateSiteMap, SiteMapField } from 'helpers/sitemap';
import { i18nConfig } from 'project.config';
import { sdk } from 'sdk';

export async function GET(request: NextRequest, props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  const locale = params.locale ?? i18nConfig.defaultLocale;

  const siteUrl = process.env.SITE_URL;

  sdk.defaultConfigure(locale);

  const fields = [] as SiteMapField[];

  let nextCursor: string | undefined;

  const extensions = sdk.composableCommerce;

  do {
    const response = await extensions.product.queryCategories({ cursor: nextCursor, limit: 500 });

    const items = [] as Category[];

    if (!response.isError && response.data.items != null) {
      items.push(...response.data.items);
    }

    fields.push(
      ...items?.map((category) => ({
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
