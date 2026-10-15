// Verify the built artifact: every internal link and asset must resolve on a static host.
import { readdir, readFile, stat } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { load } from 'cheerio';
import site from '../site.config.mjs';
import { execFileSync } from 'node:child_process';
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((e) =>
        e.isDirectory() ? walk(join(dir, e.name)) : join(dir, e.name),
      ),
    )
  ).flat();
}
const root = resolve('dist');
const files = await walk(root);
const errors = [];
const origin = new URL(site.siteUrl).origin;
const base = site.base.replace(/\/$/, '');
let links = 0;
// This runtime is rebuilt, rather than committed; verify its executable and source.
const runtime = join(root, 'other-projects/gobnative/play');
for (const name of [
  'gobnative.js',
  'gobnative.wasm',
  'manifest.webmanifest',
  'sw.js',
  'icon-192.png',
  'icon-512.png',
  'gobnative-source.tar.gz',
  'LICENSE.txt',
  'BUILD.txt',
  'licences/imgui.txt',
  'licences/Nunito-OFL.txt',
  'licences/SDL2.txt',
]) {
  try {
    if ((await stat(join(runtime, name))).size === 0)
      errors.push(`Empty runtime artifact: ${name}`);
  } catch {
    errors.push(`Missing runtime artifact: ${name}`);
  }
}
try {
  const wasm = await readFile(join(runtime, 'gobnative.wasm'));
  if (!wasm.subarray(0, 8).equals(Buffer.from([0, 97, 115, 109, 1, 0, 0, 0])))
    errors.push('Invalid gobnative WebAssembly binary');
  const revision = execFileSync(
    'git',
    ['-C', 'vendor/gobnative', 'rev-parse', 'HEAD'],
    { encoding: 'utf8' },
  ).trim();
  if (!(await readFile(join(runtime, 'BUILD.txt'), 'utf8')).includes(revision))
    errors.push('Runtime source revision does not match the submodule');
} catch (error) {
  errors.push(`Cannot verify gobnative: ${error.message}`);
}
if (files.some((file) => /\.(exe|stk|tot)$/i.test(file)))
  errors.push('Game data or installers must not be packaged in the website');
for (const file of files.filter((f) => f.endsWith('.html'))) {
  const html = await readFile(file, 'utf8');
  const $ = load(html);
  if ($('h1').length !== 1) errors.push(`${file}: expected one h1`);
  if (!$('title').text() || !$('meta[name="description"]').attr('content'))
    errors.push(`${file}: missing metadata`);
  const path = file.slice(root.length).replace(/index\.html$/, '');
  for (const el of $('[href], [src]').toArray()) {
    const value = $(el).attr('href') || $(el).attr('src');
    if (!value || /^(mailto:|tel:|data:|#|javascript:)/.test(value)) continue;
    const target = new URL(value, origin + base + path);
    if (target.origin !== origin) continue;
    let pathname = decodeURIComponent(target.pathname);
    if (base && !pathname.startsWith(base + '/')) {
      errors.push(`${file}: missing base prefix: ${value}`);
      continue;
    }
    pathname = pathname.slice(base.length);
    let local = join(root, pathname);
    try {
      if ((await stat(local)).isDirectory()) local = join(local, 'index.html');
      await stat(local);
      links++;
    } catch {
      errors.push(`${file}: missing ${value}`);
    }
  }
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(
  `Verified ${files.filter((f) => f.endsWith('.html')).length} static pages and ${links} internal links/assets.`,
);
