import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import site from './site.config.mjs';
function localImages() {
  return (tree) => {
    const walk = (node) => {
      if (node.type === 'image' && node.url.startsWith('/images/'))
        node.url = site.base.replace(/\/$/, '') + node.url;
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
