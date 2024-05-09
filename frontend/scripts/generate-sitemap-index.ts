import fs from 'fs';
import dotenv from 'dotenv';
import { i18nConfig } from 'project.config';

dotenv.config();

const host = process.env.SITE_URL;

const sitemaps = ['sitemap-categories.xml', 'sitemap-products.xml', 'sitemap-static.xml'];

const sitemapLocations = sitemaps
  .map((sitemap) => i18nConfig.locales.map((locale) => `${host}/${locale}/${sitemap}`))
  .flat();

const sitemapIndexContent = (() => {
  const now = new Date().toISOString();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  sitemapLocations.forEach((location) => {
    xml += `  <sitemap>\n    <loc>${location}</loc>\n    <lastmod>${now}</lastmod>\n  </sitemap>\n`;
  });

  xml += `</sitemapindex>`;

  return xml;
})();

fs.writeFileSync('./public/sitemap.xml', sitemapIndexContent);
