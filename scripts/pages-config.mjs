import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Use GitHub's published URL as the source of truth for project paths and domains.
export function resolvePagesConfig(publishedUrl) {
  const url = new URL(publishedUrl);
  if (
    url.protocol !== 'https:' ||
    url.username ||
    url.password ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      'Pages URL must be an HTTPS URL without credentials, query, or fragment',
    );
  }
  const base = url.pathname.endsWith('/') ? url.pathname : url.pathname + '/';
  return { siteUrl: url.origin, base };
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const { siteUrl, base } = resolvePagesConfig(process.argv[2]);
  console.log(`site_url=${siteUrl}\nsite_base=${base}`);
}
