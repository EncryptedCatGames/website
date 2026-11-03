import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { test } from 'node:test';
import { gzipSync } from 'node:zlib';
import {
  readRelease,
  releaseUrls,
  tarCommitId,
  versionMatches,
} from './gobnative-release.mjs';

test('the pinned release is complete', async () => {
  const release = await readRelease();
  assert.match(releaseUrls(release).web, /\/releases\/download\/v[\d.]+\//);
});
test('source archives report the commit they were made from', () => {
  const head = execFileSync('git', ['rev-parse', 'HEAD'], {
    encoding: 'utf8',
  }).trim();
  const archive = execFileSync('git', [
    'archive',
    '--format=tar.gz',
    'HEAD',
    'package.json',
  ]);
  assert.equal(tarCommitId(archive), head);
  assert.equal(tarCommitId(gzipSync(Buffer.alloc(1024))), null);
});
test('web builds must come from the pinned commit and a clean tree', () => {
  const release = { tag: 'v1.0.0', commit: 'abcdef0123'.padEnd(40, '0') };
  assert.ok(versionMatches('abcdef0\n', release));
  assert.ok(versionMatches('v1.0.0', release));
  assert.ok(!versionMatches('abcdef0-dirty', release));
  assert.ok(!versionMatches('abc', release));
  assert.ok(!versionMatches('1234567', release));
});
