import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import site from './site.config.mjs';
// Site-relative images and links in Markdown get the base path; links to
// the standalone project pages load the whole page (no client routing).
function localImages() {
  const base = site.base.replace(/\/$/, '');
  return (tree) => {
    const walk = (node) => {
      if (node.type === 'image' && node.url.startsWith('/images/'))
        node.url = base + node.url;
      if (
        node.type === 'link' &&
        node.url.startsWith('/') &&
        !node.url.startsWith('//')
      ) {
        if (node.url.startsWith('/other-projects/'))
          node.data = {
            ...node.data,
            hProperties: { 'data-astro-reload': true },
          };
        node.url = base + node.url;
      }
      if (node.children) node.children.forEach(walk);
    };
    walk(tree);
  };
}
export default defineConfig({
  markdown: { remarkPlugins: [localImages] },
  site: site.siteUrl,
  base: site.base,
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap()],
  devToolbar: { enabled: false },
});
