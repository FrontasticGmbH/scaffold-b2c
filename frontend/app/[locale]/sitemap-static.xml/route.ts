import { NextRequest } from 'next/server';
import { SiteMapField, generateSiteMap } from 'helpers/sitemap';
import { i18nConfig } from 'project.config';
import { sdk } from 'sdk';

export async function GET(request: NextRequest, props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  const locale = params.locale ?? i18nConfig.defaultLocale;

  const siteUrl = process.env.SITE_URL;

  sdk.defaultConfigure(locale);

  const fields = [] as SiteMapField[];

  const path = '/';
  const depth = 1;

  const res = await sdk.page.getPages({ path, depth });

  if (res.isError) return new Response(null, { status: 500 });

  const data = res.data;

  if (data?.pageFolderStructure) {
    fields.push(
      ...data.pageFolderStructure?.map((pageFolderStructureValue) => ({
        loc: `${siteUrl}/${locale}${(pageFolderStructureValue as any)._url}`, //eslint-disable-line
        lastmod: new Date().toISOString(),
        changefreq: 'daily' as const,
      })),
    );
  }

  return new Response(generateSiteMap(fields), {
    status: 200,
    headers: {
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate',
      'Content-Type': 'application/xml',
    },
  });
}
