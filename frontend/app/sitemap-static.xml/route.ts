import { SiteMapField, generateSiteMap } from 'helpers/sitemap';
import { sdk } from 'sdk';

export async function GET() {
  const locale = 'en';

  const siteUrl = process.env.SITE_URL;

  sdk.configureForNext(locale);

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
