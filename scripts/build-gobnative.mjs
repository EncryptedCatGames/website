// Download the pinned gobnative release and package its runtime, licences and matching source.
import { spawnSync } from 'node:child_process';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import {
  readRelease,
  releaseUrls,
  sha256,
  tarCommitId,
  versionMatches,
} from './gobnative-release.mjs';

const release = await readRelease();
const urls = releaseUrls(release);
const cache = resolve('node_modules/.cache/gobnative', release.tag);
const output = resolve('public/other-projects/gobnative/play');

async function download(url, file, check) {
  const path = join(cache, file);
  try {
    const cached = await readFile(path);
    if (check(cached)) return cached;
  } catch {}
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  const data = Buffer.from(await response.arrayBuffer());
  if (!check(data))
    throw new Error(`${url}: does not match the pinned release`);
  await mkdir(cache, { recursive: true });
  await writeFile(path, data);
  return data;
}

await download(
  urls.web,
  release.webAsset,
  (data) => sha256(data) === release.webSha256,
);
// GitHub's tag archive is not guaranteed byte-stable, so check its embedded commit.
const source = await download(
  urls.source,
  'gobnative-source.tar.gz',
  (data) => tarCommitId(data) === release.commit,
);

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
const unzip = spawnSync(
  'unzip',
  ['-q', join(cache, release.webAsset), '-d', output],
  { stdio: 'inherit' },
);
if (unzip.error) throw unzip.error;
if (unzip.status !== 0) throw new Error(`unzip failed (${unzip.status})`);

// The downloadable source must match the engine being served.
const version = await readFile(join(output, 'VERSION.txt'), 'utf8');
if (!versionMatches(version, release))
  throw new Error(
    `gobnative ${release.tag} web build reports VERSION.txt "${version.trim()}", not ${release.commit}`,
  );
await writeFile(join(output, 'gobnative-source.tar.gz'), source);
await writeFile(
  join(output, 'BUILD.txt'),
  `gobnative ${release.tag} ${release.commit}\nBinary: ${urls.web}\nBinary SHA-256: ${release.webSha256}\nSource: gobnative-source.tar.gz (${urls.source})\nRepository: ${urls.tree}\n`,
);
// Adapt the shell for hosting without changing the engine or its import flow.
const shellPath = join(output, 'index.html');
let shell = await readFile(shellPath, 'utf8');
for (const [from, to] of [
  ['Module.canvas.focus();', 'Module.canvas.focus({ preventScroll: true });'],
  [
    '<title>gobnative</title>',
    '<title>gobnative — Play in your browser</title>\n<meta name="description" content="Play the Goblins trilogy with your own GOG installers. Game files and saves stay in your browser.">\n<meta name="robots" content="noindex">',
  ],
  [
    '</footer>',
    '<a href="../">Project page</a> <a href="gobnative-source.tar.gz">Engine source (GPL v3+)</a> <a href="LICENSE.txt">License</a>\n</footer>',
  ],
]) {
  if (!shell.includes(from))
    throw new Error(`gobnative index.html no longer contains ${from}`);
  shell = shell.replace(from, to);
}
await writeFile(shellPath, shell);
console.log(`Packaged gobnative ${release.tag} at ${output}`);
