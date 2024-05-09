import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const rules = [{ userAgent: '*', allow: ['/'], disallow: ['/api/', '/__preview/'] }];

const host = process.env.SITE_URL;

let robotsTxtContent = '';

for (const rule of rules) {
  robotsTxtContent += `User-agent: ${rule.userAgent}\n`;

  for (const allowedUrl of rule.allow ?? []) {
    robotsTxtContent += `Allow: ${allowedUrl}\n`;
  }

  for (const disallowedUrl of rule.disallow ?? []) {
    robotsTxtContent += `Disallow: ${disallowedUrl}\n`;
  }

  robotsTxtContent += '\n';
}

robotsTxtContent += `Sitemap: ${host}/sitemap.xml`;

fs.writeFileSync('./public/robots.txt', robotsTxtContent);
