import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  entriesOf,
  frontmatter,
  linksOf,
  pageEdges,
  sitePages,
  streamOfFile,
  streamOfFiles,
} from './cp-indexlib.mjs';

test('files map to streams', () => {
  assert.equal(streamOfFile('src/pages/privacy.astro'), 'legal');
  assert.equal(streamOfFile('src/content/devlog/a.md'), 'devlog');
  assert.equal(streamOfFile('public/images/devlog/a.webp'), 'devlog');
  assert.equal(streamOfFile('src/data/games.ts'), 'games');
  assert.equal(streamOfFile('public/images/episode-01-cover.webp'), 'games');
  assert.equal(streamOfFile('scripts/build-gobnative.mjs'), 'deploy');
  assert.equal(streamOfFile('.github/workflows/deploy.yml'), 'deploy');
  assert.equal(streamOfFile('src/layouts/Layout.astro'), 'pages');
});

test("a PR's stream: its title first, then most files, ties to the specific one", () => {
  assert.equal(
    streamOfFiles(['src/data/games.ts'], 'Devlog: a post'),
    'devlog',
  );
  assert.equal(
    streamOfFiles(['src/pages/studio/index.astro'], 'App page, terms, privacy'),
    'legal',
  );
  assert.equal(
    streamOfFiles(['src/pages/privacy.astro', 'src/data/games.ts']),
    'legal',
  );
  assert.equal(
    streamOfFiles([
      'src/layouts/Layout.astro',
      'src/styles/global.css',
      'src/data/games.ts',
    ]),
    'pages',
  );
  assert.equal(streamOfFiles([]), 'pages');
});

test('frontmatter reads quoted and plain values', () => {
  assert.deepEqual(
    frontmatter(
      '---\ntitle: "Say \\"hi\\""\ndate: 2026-01-02\ngame: \'x\'\n---\nbody',
    ),
    { title: 'Say "hi"', date: '2026-01-02', game: 'x' },
  );
  assert.deepEqual(frontmatter('no frontmatter'), {});
});

test('data entries are read from a TS array', () => {
  const src = `export const games = [
  {
    slug: 'a',
    title: 'The A',
    subtitle: 'One',
    short: "It's short.",
    features: [{ title: 'not this' }],
  },
  {
    slug: 'b',
    title: 'B',
  },
];`;
  const e = entriesOf(src);
  assert.deepEqual(
    e.map((x) => [x.slug, x.title, x.subtitle, x.short]),
    [
      ['a', 'The A', 'One', "It's short."],
      ['b', 'B', '', ''],
    ],
  );
});

test('links from .astro url() calls and Markdown', () => {
  assert.deepEqual(linksOf("<a href={url('terms/')}>x</a> url('')"), [
    'terms/',
    '',
  ]);
  assert.deepEqual(linksOf('see [this](/games/a) and [x](/devlog/b/#top)'), [
    'games/a/',
    'devlog/b/',
  ]);
});

test('pages and edges from a small site', () => {
  const src = {
    'src/pages/index.astro': "<a href={url('games/')}>",
    'src/pages/games/index.astro': 'description="All games."',
    'src/pages/games/[slug].astro': '',
    'src/pages/privacy.astro': "url('studio/')",
    'src/pages/studio/index.astro': "url('privacy/')",
    'src/data/games.ts': "[\n  {\n    slug: 'g1',\n    title: 'G',\n  },\n];",
    'src/content/devlog/p1.md':
      '---\ntitle: "Post"\ngame: "g1"\nimage: "/images/devlog/p1.webp"\n---\nHi',
    'public/images/devlog/p1.webp': '',
  };
  const files = Object.keys(src);
  const pages = sitePages(files, (f) => src[f]);
  assert.deepEqual(
    pages.map((p) => [p.id, p.path]),
    [
      ['page-home', ''],
      ['page-privacy', 'privacy/'],
      ['page-studio', 'studio/'],
      ['page-games', 'games/'],
      ['game-g1', 'games/g1/'],
      ['devlog-p1', 'devlog/p1/'],
    ],
  );
  assert.equal(pages.find((p) => p.id === 'page-games').summary, 'All games.');
  assert.equal(
    pages.find((p) => p.id === 'devlog-p1').image,
    'public/images/devlog/p1.webp',
  );
  const edges = pageEdges(pages).map((e) => `${e.from} ${e.rel} ${e.to}`);
  assert.deepEqual(edges.sort(), [
    'devlog-p1 about game-g1',
    'page-games lists game-g1',
    'page-home features game-g1',
    'page-home links to page-games',
    'page-privacy links to page-studio',
    'page-studio links to page-privacy',
  ]);
});
