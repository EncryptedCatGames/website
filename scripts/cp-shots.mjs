#!/usr/bin/env node
/**
 * Refreshes docs/shots/, the control plane wiki's pictures of the site: every
 * page at desktop width, and every page but the devlog posts at phone width
 * (the posts share one layout).
 *
 *   bun run cp:shots [-- --url <site url>]
 *
 * Without --url it builds the site (analytics off) and serves dist/ itself on
 * a free local port for the drive, then stops. Plain Node, no packages.
 */
import { spawn, spawnSync } from 'node:child_process';
import { createReadStream, existsSync, rmSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const i = process.argv.indexOf('--url');
let url = i >= 0 ? process.argv[i + 1] : null;
const out = join(root, 'docs/shots');
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.wasm': 'application/wasm',
  '.xml': 'application/xml',
};

let server;
if (!url) {
  const env = {
    ...process.env,
    SITE_BASE: '/',
    CUSTOM_DOMAIN: '',
    PUBLIC_GA_ID: 'G-XXXXXXXXXX',
  };
  const b = spawnSync('bun', ['run', 'build'], {
    cwd: root,
    env,
    stdio: 'inherit',
  });
  if (b.status !== 0) process.exit(b.status ?? 1);
  const dist = join(root, 'dist');
  server = createServer((req, res) => {
    let p = normalize(
      decodeURIComponent(new URL(req.url, 'http://x').pathname),
    );
    if (p.endsWith('/')) p += 'index.html';
    const f = join(dist, p);
    if (!f.startsWith(dist) || !existsSync(f) || !statSync(f).isFile()) {
      res.writeHead(404).end('not found');
      return;
    }
    res.writeHead(200, {
      'content-type': TYPES[extname(f)] ?? 'application/octet-stream',
    });
    createReadStream(f).pipe(res);
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  url = `http://127.0.0.1:${server.address().port}/`;
}

let failed = false;
for (const [scenario, extra] of [
  ['desktop', []],
  ['phone', ['--no-posts']],
]) {
  // Async, so this process keeps serving the drive.
  const c = spawn(
    process.execPath,
    [
      join(root, 'scripts/cp-drive.mjs'),
      '--url',
      url,
      '--out',
      out,
      '--scenario',
      scenario,
      '--docs',
      ...extra,
    ],
    { stdio: 'inherit' },
  );
  const r = await new Promise((resolve) => c.on('exit', resolve));
  failed ||= r !== 0;
}
rmSync(join(out, 'result.json'), { force: true });
server?.close();
process.exit(failed ? 1 : 0);
