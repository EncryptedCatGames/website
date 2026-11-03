// The pinned gobnative release and the checks that tie its binary to its source.
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';

export async function readRelease(path = 'gobnative.release.json') {
  const release = JSON.parse(await readFile(path, 'utf8'));
  for (const key of ['repository', 'tag', 'commit', 'webAsset', 'webSha256'])
    if (typeof release[key] !== 'string' || !release[key])
      throw new Error(`${path}: missing ${key}`);
  if (!/^[0-9a-f]{40}$/.test(release.commit))
    throw new Error(`${path}: commit must be a full 40-character SHA`);
  return release;
}

export function releaseUrls(release) {
  const repo = `https://github.com/${release.repository}`;
  return {
    web: `${repo}/releases/download/${release.tag}/${release.webAsset}`,
    source: `${repo}/archive/refs/tags/${release.tag}.tar.gz`,
    tree: `${repo}/tree/${release.commit}`,
  };
}

export function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

// GitHub and `git archive` record the commit in the tarball's pax global header,
// the same value `git get-tar-commit-id` reads.
export function tarCommitId(gzipped) {
  const tar = gunzipSync(gzipped);
  if (tar.length < 512 || String.fromCharCode(tar[156]) !== 'g') return null;
  const size = parseInt(tar.subarray(124, 136).toString().trim(), 8);
  const header = tar.subarray(512, 512 + size).toString();
  return header.match(/^\d+ comment=([0-9a-f]{40})$/m)?.[1] ?? null;
}

// VERSION.txt comes from `git describe --always --dirty` in gobnative's build.
export function versionMatches(version, release) {
  const value = version.trim();
  if (!value || value.endsWith('-dirty')) return false;
  return (
    value === release.tag ||
    (value.length >= 7 && release.commit.startsWith(value))
  );
}
