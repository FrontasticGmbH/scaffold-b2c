export interface SiteMapField {
  loc?: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: string;
}

export const generateSiteMap = (fields: SiteMapField[]) => {
  const sitemap = `
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${fields
      .filter(({ loc, lastmod, changefreq, priority }) => !!loc || !!lastmod || !!changefreq || !priority)
      .map(
        ({ loc, lastmod, changefreq, priority }) =>
          `
                <url>
                    ${loc ? `<loc>${loc}</loc>` : ''}
                    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
                    ${changefreq ? `<changefreq>${changefreq}</changefreq>` : ''}
                    ${priority ? `<priority>${priority}</priority>` : ''}
                </url>
            `,
      )
      .join('\n')}
    </urlset>
    `;

  return sitemap;
};
