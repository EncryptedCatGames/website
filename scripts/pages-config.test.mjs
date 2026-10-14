import assert from 'node:assert/strict';
import { test } from 'node:test';
import { resolvePagesConfig } from './pages-config.mjs';

test('GitHub project sites use the repository prefix', () => {
  assert.deepEqual(
    resolvePagesConfig('https://encryptedcatgames.github.io/website/'),
    {
      siteUrl: 'https://encryptedcatgames.github.io',
      base: '/website/',
    },
  );
});
test('custom domains use root paths', () => {
  assert.deepEqual(resolvePagesConfig('https://games.encrypted-cat.com/'), {
    siteUrl: 'https://games.encrypted-cat.com',
    base: '/',
  });
});
test('organization sites can be hosted at the root', () => {
  assert.equal(
    resolvePagesConfig('https://encryptedcatgames.github.io/').base,
    '/',
  );
});
test('base paths have a trailing slash', () => {
  assert.equal(
    resolvePagesConfig('https://encryptedcatgames.github.io/website').base,
    '/website/',
  );
});
test('invalid deployment URLs are rejected', () => {
  for (const url of [
    'http://example.com/',
    'https://user:pass@example.com/',
    'https://example.com/?x=1',
    'https://example.com/#test',
  ]) {
    assert.throws(() => resolvePagesConfig(url));
  }
});
