#!/usr/bin/env node
/**
 * One-time backfill for the control plane: a done work item for every merged
 * PR that no item tracks yet, under the PR's stream, so each stream's Items
 * tab shows the work done before the website joined the control plane. Safe
 * to run again: PRs an item already names are skipped.
 *
 *   bun run cp:index            (writes .data/cp-index.json)
 *   bun run cp:backfill [-- --push [url]]
 *
 * Without --push it only prints what it would file. Plain Node, no packages.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const i = args.indexOf('--push');
const push =
  i >= 0
    ? args[i + 1] && !args[i + 1].startsWith('--')
      ? args[i + 1]
      : 'https://192.168.68.52:5700'
    : null;
// The box's certificate is self-signed (LAN only).
if (push) process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const index = JSON.parse(
  readFileSync(join(root, '.data/cp-index.json'), 'utf8'),
);
const api = (path) => new URL(`/api/p/website${path}`, push ?? 'http://x');
async function call(method, path, body) {
  const res = await fetch(api(path), {
    method,
    headers: body ? { 'content-type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${path}: HTTP ${res.status} ${text}`);
  return JSON.parse(text);
}

let tracked = new Set();
if (push) {
  const { docs } = await call('GET', '/c/items');
  for (const d of docs) {
    if (d.data.pr?.number) tracked.add(d.data.pr.number);
    for (const ev of d.data.history ?? []) if (ev.pr) tracked.add(ev.pr);
  }
}
const todo = index.prs
  .filter((p) => p.state === 'merged' && !tracked.has(p.n))
  .sort((a, b) => a.n - b.n);
for (const p of todo) {
  const when = (p.merged ?? '').slice(0, 10);
  if (!push) {
    console.log(`would file: [${p.stream}] ${p.title} (#${p.n}, ${when})`);
    continue;
  }
  const row = await call('POST', '/items', {
    stream: p.stream,
    title: p.title.slice(0, 200),
    words: (p.summary || p.title).slice(0, 4000),
  });
  await call('POST', `/items/${row.id}/events`, {
    kind: 'merged',
    pr: p.n,
    note: `merged ${when}, before the control plane (backfilled)`,
  });
  console.log(`#${row.id} [${p.stream}] ${p.title} → done (PR ${p.n})`);
}
console.log(
  `${todo.length} PRs ${push ? 'filed as done items' : 'to file'}; ${tracked.size} already tracked`,
);
