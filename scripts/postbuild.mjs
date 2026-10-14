import { writeFile, rm } from 'node:fs/promises';
import site from '../site.config.mjs';
if (site.customDomain) {
  if (!/^[a-z0-9]+(?:[.-][a-z0-9]+)+$/i.test(site.customDomain))
    throw new Error('customDomain must be a hostname without protocol or path');
  const host = new URL(site.siteUrl).hostname;
  if (host !== site.customDomain)
    throw new Error('siteUrl and customDomain must use the same hostname');
  await writeFile('dist/CNAME', site.customDomain + '\n');
} else {
  await rm('dist/CNAME', { force: true });
}
await writeFile('dist/.nojekyll', '');
const root = new URL(
  site.base.replace(/^\//, ''),
  site.siteUrl.replace(/\/$/, '') + '/',
);
await writeFile(
  'dist/robots.txt',
  `User-agent: *\nAllow: /\nSitemap: ${root}sitemap-index.xml\n`,
);
