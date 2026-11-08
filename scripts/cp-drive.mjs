#!/usr/bin/env node
/**
 * The website's test drive for the control plane: opens a build of the site
 * and photographs every page (the same list as the wiki, read from the
 * source), at desktop or phone width. The box runs it on a PR's build and on
 * main's and compares them.
 *
 *   node scripts/cp-drive.mjs --url <site url> --out <dir> --scenario desktop|phone [--docs] [--only <id,id>] [--no-posts]
 *
 * Writes <out>/result.json (the control plane's ScenarioResult) and one JPEG
 * per page; `--docs` names them <page id>-<scenario>.jpg (bun run cp:shots
 * keeps docs/shots/ current for the wiki). Console errors, exceptions, broken
 * same-site requests and pages that scroll sideways go in `errors`. Uses
 * $CHROME (else the Mac's Chrome), headless and muted; plain Node, no
 * packages; at most 6 minutes.
 */
import { spawn } from 'node:child_process';
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { shotFile, sitePages } from './cp-indexlib.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const flag = (n, d) => {
  const i = args.indexOf(n);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--')
    ? args[i + 1]
    : d;
};
const siteUrl = flag('--url');
const out = flag('--out');
const scenario = flag('--scenario', 'desktop');
const docs = args.includes('--docs');
const only = flag('--only')?.split(',');
const noPosts = args.includes('--no-posts');
if (!siteUrl || !out || !['desktop', 'phone'].includes(scenario)) {
  console.error(
    'Usage: node scripts/cp-drive.mjs --url <site url> --out <dir> --scenario desktop|phone [--docs] [--only <id,id>] [--no-posts]',
  );
  process.exit(2);
}
mkdirSync(out, { recursive: true });
const SIZE =
  scenario === 'phone'
    ? { width: 390, height: 844, deviceScaleFactor: 2, mobile: true }
    : { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false };
// The wiki's shots (--docs) are committed: smaller.
const QUALITY = docs ? (scenario === 'phone' ? 45 : 60) : 68;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (...a) => console.error(`[drive ${scenario}]`, ...a);
const result = {
  scenario,
  ok: false,
  shots: [],
  errors: [],
  warnings: 0,
  notes: [],
};
const t0 = Date.now();

// ------------------------------------------------------------------ the pages, from the source

// The checkout is mounted without git on the box, so walk it.
function walk(dir, acc = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', 'dist', '.astro', '.claude'].includes(e.name))
      continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else acc.push(relative(root, p).split('\\').join('/'));
  }
  return acc;
}
const files = [
  ...walk(join(root, 'src')),
  ...walk(join(root, 'public', 'images')),
];
let pages = sitePages(files, (f) => readFileSync(join(root, f), 'utf8'));
if (only) pages = pages.filter((p) => only.includes(p.id));
if (noPosts) pages = pages.filter((p) => p.kind !== 'Devlog post');

// ------------------------------------------------------------------ Chrome over DevTools

const exe =
  process.env.CHROME ??
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const port = 9300 + Math.floor(Math.random() * 600);
const profile = mkdtempSync(join(tmpdir(), 'cp-drive-'));
const chrome = spawn(
  exe,
  [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    `--window-size=${SIZE.width},${SIZE.height}`,
    '--ignore-certificate-errors',
    '--mute-audio',
    '--autoplay-policy=user-gesture-required',
    '--no-first-run',
    '--enable-precise-memory-info',
    ...(process.platform === 'linux'
      ? ['--no-sandbox', '--disable-dev-shm-usage']
      : []),
    'about:blank',
  ],
  { stdio: 'ignore' },
);
const stop = () => {
  if (chrome.exitCode === null) chrome.kill('SIGKILL');
  try {
    rmSync(profile, { recursive: true, force: true });
  } catch {
    // Chrome may still hold it for a moment.
  }
};
process.on('exit', stop);
const limit = setTimeout(
  () => finish('timed out after 6 minutes'),
  6 * 60_000 - 15_000,
);

let ws;
let nextId = 1;
let current = '';
const pending = new Map();
const requests = new Map();
const origin = new URL(siteUrl).origin;
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const id = nextId++;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
const evaluate = async (expression) => {
  const r = await send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (r.exceptionDetails)
    throw new Error(
      r.exceptionDetails.exception?.description ?? 'evaluate failed',
    );
  return r.result.value;
};
const error = (text) => {
  const line = `${current}: ${text}`.slice(0, 300);
  if (!result.errors.includes(line)) result.errors.push(line);
};

function onEvent(m) {
  const p = m.params;
  if (m.method === 'Runtime.exceptionThrown')
    error(
      p.exceptionDetails.exception?.description?.split('\n')[0] ??
        p.exceptionDetails.text,
    );
  else if (m.method === 'Runtime.consoleAPICalled') {
    const text = p.args
      .map((a) => a.value ?? a.description ?? '')
      .join(' ')
      .slice(0, 300);
    if (p.type === 'error') error(text);
    else if (p.type === 'warning') result.warnings++;
  } else if (m.method === 'Network.requestWillBeSent')
    requests.set(p.requestId, p.request.url);
  else if (m.method === 'Network.responseReceived') {
    const u = p.response.url;
    // A broken image, script or link on our own site (the 404 page is meant to be one).
    if (
      p.response.status >= 400 &&
      u.startsWith(origin) &&
      !(current === 'page-404' && p.type === 'Document')
    )
      error(`HTTP ${p.response.status} ${u.slice(origin.length)}`);
  } else if (m.method === 'Network.loadingFailed') {
    const u = requests.get(p.requestId) ?? '';
    if (u.startsWith(origin) && !p.canceled)
      error(`failed ${u.slice(origin.length)} (${p.errorText})`);
  }
}

async function connect() {
  for (let i = 0; i < 60; i++) {
    try {
      const list = await (
        await fetch(`http://127.0.0.1:${port}/json/list`)
      ).json();
      const target = list.find((t) => t.type === 'page');
      if (target) {
        ws = new WebSocket(target.webSocketDebuggerUrl);
        await new Promise((r, j) => {
          ws.onopen = r;
          ws.onerror = j;
        });
        ws.onmessage = (ev) => {
          const m = JSON.parse(ev.data);
          if (m.id && pending.has(m.id)) {
            const p = pending.get(m.id);
            pending.delete(m.id);
            m.error
              ? p.reject(new Error(m.error.message))
              : p.resolve(m.result);
          } else if (m.method) onEvent(m);
        };
        return;
      }
    } catch {
      // Not up yet.
    }
    await sleep(250);
  }
  throw new Error('Chrome did not start');
}

/** Waits for the page to load, its fonts and the images in view. */
async function ready(maxMs = 10_000) {
  const end = Date.now() + maxMs;
  while (Date.now() < end) {
    const done = await evaluate(
      `document.readyState === 'complete' && [...document.images].filter((i) => i.getBoundingClientRect().top < innerHeight && i.loading !== 'lazy').every((i) => i.complete)`,
    ).catch(() => false);
    if (done) {
      await evaluate('document.fonts.ready.then(() => true)').catch(() => {});
      return true;
    }
    await sleep(200);
  }
  return false;
}

async function shoot(id) {
  await sleep(300); // transitions
  const wide = await evaluate(
    'document.documentElement.scrollWidth - window.innerWidth',
  );
  if (wide > 1) error(`layout: scrolls sideways by ${wide}px`);
  const { data } = await send('Page.captureScreenshot', {
    format: 'jpeg',
    quality: QUALITY,
  });
  const file = docs
    ? shotFile(id, scenario)
    : `${String(result.shots.length + 1).padStart(2, '0')}-${id}.jpg`;
  writeFileSync(join(out, file), Buffer.from(data, 'base64'));
  result.shots.push({ name: id, file });
}

function finish(failure) {
  clearTimeout(limit);
  if (failure) result.notes.push(failure);
  result.ok = !failure && result.shots.length >= pages.length;
  writeFileSync(join(out, 'result.json'), JSON.stringify(result, null, 2));
  log(
    `${result.ok ? 'ok' : 'failed'} in ${Math.round((Date.now() - t0) / 1000)} s, ${result.shots.length}/${pages.length} pages, ${result.errors.length} errors`,
  );
  try {
    ws?.close();
  } catch {
    // Already closed.
  }
  stop();
  process.exit(0);
}

// ------------------------------------------------------------------ the run

try {
  await connect();
  await send('Runtime.enable');
  await send('Page.enable');
  await send('Network.enable');
  await send('Emulation.setDeviceMetricsOverride', SIZE);
  if (SIZE.mobile)
    await send('Emulation.setTouchEmulationEnabled', {
      enabled: true,
      maxTouchPoints: 5,
    });
  const base = new URL(siteUrl);
  base.hash = '';
  if (!base.pathname.endsWith('/')) base.pathname += '/';
  result.notes.push(`${pages.length} pages`);
  for (const p of pages) {
    if (Date.now() - t0 > 5 * 60_000) {
      result.notes.push(`stopped at 5 minutes, before ${p.id}`);
      break;
    }
    current = p.id;
    const u = new URL(p.path, base);
    u.search = base.search;
    const started = Date.now();
    await send('Page.navigate', { url: u.href });
    await sleep(150);
    if (!(await ready())) result.notes.push(`${p.id} still loading after 10 s`);
    if (p.id === 'page-home') result.loadMs = Date.now() - started;
    await shoot(p.id);
  }
  result.memoryMB = Math.round(
    (await evaluate(
      'performance.memory ? performance.memory.usedJSHeapSize : 0',
    )) / 1048576,
  );
  finish();
} catch (err) {
  try {
    await shoot('failed');
  } catch {
    // No page to photograph.
  }
  finish(String(err?.message ?? err));
}
