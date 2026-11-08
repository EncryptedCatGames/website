#!/usr/bin/env node
/**
 * The website's index for the control plane (project `website`): its PRs,
 * docs, and a wiki page per site page (with its screenshots from docs/shots/,
 * made by `bun run cp:shots`), plus "what uses what" between pages.
 *
 *   node scripts/cp-index.mjs [--offline] [--push [url]] [--out .data/cp-index.json]
 *
 * PRs come from `gh` (cached in .data/cp-prs.json for --offline). Plain Node,
 * no packages, so it runs without `bun install`.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { request } from 'node:https';
import { request as httpRequest } from 'node:http';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  firstPara,
  pageEdges,
  shotFile,
  sitePages,
  streamOfFiles,
} from './cp-indexlib.mjs';

const PROJECT = 'website';
const REPO = 'EncryptedCatGames/website';
// The streams (the control plane's projects/website.json has the same ids).
const STREAMS = [
  { id: 'pages', name: 'Pages', goal: 'The home page, layout and own pages' },
  { id: 'devlog', name: 'Devlog', goal: 'Posts about each game' },
  { id: 'games', name: 'Games catalogue', goal: 'Game and project pages' },
  { id: 'legal', name: 'Legal & support', goal: 'Privacy, terms, support' },
  { id: 'deploy', name: 'Build & deploy', goal: 'Build, checks, deploy' },
];
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const flag = (n, d) => {
  const i = args.indexOf(n);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--')
    ? args[i + 1]
    : d;
};
const offline = args.includes('--offline');
const push = args.includes('--push')
  ? flag('--push', 'https://192.168.68.52:5700')
  : null;
const outFile = join(root, flag('--out', '.data/cp-index.json'));
const sh = (cmd, a) =>
  execFileSync(cmd, a, { cwd: root, encoding: 'utf8', maxBuffer: 64 << 20 });
const read = (f) => readFileSync(join(root, f), 'utf8');

// ------------------------------------------------------------------ PRs

const cache = join(root, '.data/cp-prs.json');
let raw;
if (offline && existsSync(cache)) raw = JSON.parse(readFileSync(cache, 'utf8'));
else {
  raw = JSON.parse(
    sh('gh', [
      'pr',
      'list',
      '--repo',
      REPO,
      '--state',
      'all',
      '--limit',
      '500',
      '--json',
      'number,title,headRefName,state,createdAt,mergedAt,closedAt,url,additions,deletions,body,files',
    ]),
  );
  mkdirSync(dirname(cache), { recursive: true });
  writeFileSync(cache, JSON.stringify(raw));
}
const prs = raw
  .map((p) => {
    const paths = (p.files ?? []).map((f) => f.path).slice(0, 300);
    return {
      n: p.number,
      title: p.title,
      branch: p.headRefName,
      state:
        p.state === 'MERGED'
          ? 'merged'
          : p.state === 'OPEN'
            ? 'open'
            : 'closed',
      created: p.createdAt,
      merged: p.mergedAt ?? null,
      closed: p.closedAt ?? null,
      url: p.url,
      add: p.additions,
      del: p.deletions,
      stream: streamOfFiles(paths, p.title),
      summary: firstPara(p.body).slice(0, 400),
      dirs: [...new Set(paths.map((f) => f.split('/')[0]))],
      files: paths.length,
      paths,
      docs: paths.filter((f) => f.endsWith('.md') && !f.includes('/content/')),
      images: paths.filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).slice(0, 12),
      refs: [
        ...new Set(
          [...(p.body ?? '').matchAll(/(?:^|[^\w/#])#(\d{1,4})\b/g)].map((m) =>
            Number(m[1]),
          ),
        ),
      ],
    };
  })
  .sort((a, b) => b.n - a.n);
const prsTouching = (files) =>
  prs.filter((p) => p.paths.some((f) => files.includes(f))).map((p) => p.n);

// ------------------------------------------------------------------ files

const files = sh('git', ['ls-files']).split('\n').filter(Boolean);
const head = sh('git', ['rev-parse', 'HEAD']).trim();
const changed = (f) => {
  try {
    return sh('git', ['log', '-1', '--format=%cI', '--', f]).trim();
  } catch {
    return '';
  }
};

// ------------------------------------------------------------------ docs

const docs = files
  .filter(
    (f) =>
      f.endsWith('.md') &&
      !f.startsWith('.claude/') &&
      !f.startsWith('src/content/') &&
      !f.startsWith('public/'),
  )
  .map((f) => {
    const src = read(f);
    return {
      path: f,
      title: /^#\s+(.+)$/m.exec(src)?.[1] ?? f,
      kind: f === 'CLAUDE.md' ? 'agents' : 'readme',
      stream: 'deploy',
      summary: firstPara(src.replace(/^#.*$/gm, '')).slice(0, 300),
      changed: changed(f),
      prs: prsTouching([f]),
      words: src.split(/\s+/).length,
    };
  });

// ------------------------------------------------------------------ wiki pages and edges

const shots = (id) =>
  ['desktop', 'phone']
    .map((s) => `docs/shots/${shotFile(id, s)}`)
    .filter((f) => existsSync(join(root, f)));
const site = sitePages(files, read);
const pages = site.map((p) => ({
  id: p.id,
  kind: p.kind,
  name: p.name,
  stage: 'in game',
  ...(p.tags?.includes('unlisted')
    ? { stageNote: 'Live but unlisted: shared by direct link only' }
    : {}),
  summary: p.summary,
  stream: p.stream,
  tags: p.tags,
  source: p.source,
  images: [...shots(p.id), ...(p.image ? [p.image] : [])],
  prs: prsTouching(p.files),
  docs: [],
  facts: {
    ...(p.facts ?? {}),
    url: `https://games.encrypted-cat.com/${p.path}`,
    ...(p.source ? { changed: changed(p.source).slice(0, 10) } : {}),
  },
}));
const edges = pageEdges(site);

const index = {
  meta: {
    refreshedAt: new Date().toISOString(),
    commit: head.slice(0, 8),
    streams: STREAMS,
    counts: {
      prs: prs.length,
      docs: docs.length,
      notes: 0,
      pages: pages.length,
      edges: edges.length,
    },
  },
  prs,
  docs,
  notes: [],
  pages,
  edges,
};
mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, JSON.stringify(index));
const kinds = {};
for (const p of pages) kinds[p.kind] = (kinds[p.kind] ?? 0) + 1;
console.log(
  `✔ ${outFile}: ${prs.length} PRs · ${docs.length} docs · ${pages.length} pages · ${edges.length} edges`,
);
console.log(
  '  ' +
    Object.entries(kinds)
      .map(([k, n]) => `${k} ${n}`)
      .join(' · '),
);

if (push) {
  const url = new URL(`/api/p/${PROJECT}/import`, push);
  const body = JSON.stringify(index);
  const res = await new Promise((resolve, reject) => {
    const r = (url.protocol === 'https:' ? request : httpRequest)(
      url,
      {
        method: 'POST',
        rejectUnauthorized: false, // the box's self-signed certificate, LAN only
        headers: {
          'content-type': 'application/json',
          'content-length': Buffer.byteLength(body),
        },
      },
      (res) => {
        let t = '';
        res.on('data', (c) => (t += c));
        res.on('end', () => resolve({ status: res.statusCode, text: t }));
      },
    );
    r.on('error', reject);
    r.end(body);
  });
  if (res.status !== 200) {
    console.error(`push failed: HTTP ${res.status} ${res.text}`);
    process.exit(1);
  }
  console.log(`✔ pushed to ${push}`);
}
