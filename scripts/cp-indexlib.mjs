/**
 * The control plane adapter's pure pieces (tested in cp-indexlib.test.mjs):
 * which stream a file belongs to, the site's pages read from the source
 * (one wiki page each), and the links between them. scripts/cp-index.mjs and
 * scripts/cp-drive.mjs feed them files. Plain Node, no packages.
 */

/** Which control plane stream a changed file belongs to. */
export function streamOfFile(file) {
  if (/(^|\/)(privacy|terms|support)\.astro$/.test(file)) return 'legal';
  if (
    file.startsWith('src/content/devlog/') ||
    file.startsWith('src/pages/devlog/') ||
    file.startsWith('public/images/devlog/') ||
    file === 'scripts/import-itch.mjs'
  )
    return 'devlog';
  if (
    file.startsWith('.github/') ||
    file.startsWith('.claude/') ||
    file.startsWith('scripts/') ||
    /^(package\.json|bun\.lock|astro\.config\.mjs|site\.config\.mjs|tsconfig\.json|README\.md|CLAUDE\.md|\.prettier.*|\.git\w*|\.env\.example)$/.test(
      file,
    )
  )
    return 'deploy';
  if (
    /^src\/data\/(games|projects|itch|platforms|subjects)/.test(file) ||
    /^src\/pages\/(games|playtest|other-projects)\//.test(file) ||
    /^src\/components\/(GameCard|GameStoreLink|ProjectCard|Trailer)/.test(
      file,
    ) ||
    /gobnative/.test(file) ||
    /^public\/images\/(?!devlog\/)/.test(file)
  )
    return 'games';
  return 'pages';
}

/** Ties go to the more specific stream. */
const TIE_ORDER = ['legal', 'devlog', 'games', 'deploy', 'pages'];

/**
 * A PR's stream: named by its title ("Devlog: …", "Privacy …"), else the one
 * most of its files are in.
 */
export function streamOfFiles(files, title = '') {
  if (/\bdevlog\b/i.test(title)) return 'devlog';
  if (/\b(privacy|terms|support|legal)\b/i.test(title)) return 'legal';
  const n = {};
  for (const f of files) {
    const s = streamOfFile(f);
    n[s] = (n[s] ?? 0) + 1;
  }
  const best = Object.entries(n).sort(
    (a, b) => b[1] - a[1] || TIE_ORDER.indexOf(a[0]) - TIE_ORDER.indexOf(b[0]),
  )[0];
  return best ? best[0] : 'pages';
}

/** The first paragraph of a PR body or a Markdown file, as plain text. */
export const firstPara = (body) =>
  (body ?? '')
    .split(/\n\s*\n/)
    .map((p) =>
      p
        .replace(/[*_`#>]/g, '')
        .replace(/\s+/g, ' ')
        .trim(),
    )
    .find((p) => p && !p.startsWith('🤖') && !p.startsWith('---')) ?? '';

/** A Markdown file's frontmatter (flat `key: value` lines only). */
export function frontmatter(src) {
  const m = /^---\n([\s\S]*?)\n---/.exec(src);
  const out = {};
  if (!m) return out;
  for (const line of m[1].split('\n')) {
    const kv = /^([A-Za-z]\w*):\s*(.*)$/.exec(line);
    if (!kv) continue;
    let v = kv[2].trim();
    if (/^".*"$/.test(v)) {
      try {
        v = JSON.parse(v);
      } catch {
        v = v.slice(1, -1);
      }
    } else if (/^'.*'$/.test(v)) v = v.slice(1, -1).replace(/''/g, "'");
    out[kv[1]] = v;
  }
  return out;
}

/** One string field (`key: '…'` or `"…"`) in a block of TS source. */
const field = (block, key) => {
  const m = new RegExp(
    `\\b${key}:\\s*(?:'((?:[^'\\\\]|\\\\.)*)'|"((?:[^"\\\\]|\\\\.)*)")`,
  ).exec(block);
  return m ? (m[1] ?? m[2]).replace(/\\(.)/g, '$1') : '';
};

/** The objects of a data file (src/data/games.ts, projects.ts), split at each `slug:`. */
export function entriesOf(src) {
  const parts = src.split(/\n\s*slug:\s*/).slice(1);
  return parts.map((p) => {
    const block = `slug: ${p.split(/\n\s{2}\},?\s*\n\s{2}\{|\n\];/)[0]}`;
    return {
      slug: field(block, 'slug'),
      title: field(block, 'title'),
      subtitle: field(block, 'subtitle'),
      name: field(block, 'name'),
      short: field(block, 'short'),
      tagline: field(block, 'tagline'),
      description: field(block, 'description'),
      status: field(block, 'status'),
      path: field(block, 'path'),
    };
  });
}

/** The `description="…"` an .astro page gives its layout. */
export const astroDescription = (src) =>
  /\bdescription="([^"]+)"/.exec(src)?.[1] ?? '';

/** The site paths a source links to: `url('games/')` in .astro, `](/games/…)` in Markdown. */
export function linksOf(src) {
  const out = new Set();
  for (const m of src.matchAll(/\burl\(\s*['`]([^'`$#?]*)/g)) out.add(m[1]);
  for (const m of src.matchAll(/\]\(\/([^)#?\s]*)/g)) out.add(m[1]);
  return [...out].map((p) => (p === '' || p.endsWith('/') ? p : `${p}/`));
}

const STATIC = {
  'index.astro': [
    'page-home',
    'Home',
    '',
    'The front page: the games, side projects and the latest devlog posts.',
  ],
  'contact.astro': ['page-contact', 'Contact', 'contact/'],
  'support.astro': ['page-support', 'Support', 'support/'],
  'privacy.astro': ['page-privacy', 'Privacy policy', 'privacy/'],
  'terms.astro': ['page-terms', 'Terms of service', 'terms/'],
  '404.astro': [
    'page-404',
    'Not found (404)',
    '404.html',
    'What a visitor sees on a broken link.',
  ],
  'studio/index.astro': ['page-studio', 'Encrypted Cat Studio', 'studio/'],
  'devlog/index.astro': ['page-devlog', 'Devlog', 'devlog/'],
  'games/index.astro': ['page-games', 'Games catalogue', 'games/'],
  'other-projects/index.astro': [
    'page-other-projects',
    'Projects',
    'other-projects/',
  ],
};

/**
 * Every page of the site, from the source: `files` is the repo's file list,
 * `read(path)` its text. Each: { id, kind, name, path, stream, summary,
 * source, files (the files that make it), facts, image? }. `path` is relative
 * to the site's base ('' is the home page).
 */
export function sitePages(files, read) {
  const pages = [];
  const has = (f) => files.includes(f);
  const exists = (f) => (has(f) ? f : undefined);
  for (const [f, [id, name, path, about]] of Object.entries(STATIC)) {
    const source = `src/pages/${f}`;
    if (!has(source)) continue;
    const src = read(source);
    pages.push({
      id,
      kind: 'Page',
      name,
      path,
      stream: streamOfFile(source),
      summary: astroDescription(src) || about || `The ${name} page.`,
      source,
      files: [source],
      links: linksOf(src),
    });
  }
  if (has('src/data/games.ts')) {
    for (const g of entriesOf(read('src/data/games.ts'))) {
      const own = `src/pages/games/${g.slug}.astro`;
      const source = has(own) ? own : 'src/pages/games/[slug].astro';
      pages.push({
        id: `game-${g.slug}`,
        kind: 'Game',
        name: [g.title, g.subtitle].filter(Boolean).join(': '),
        path: `games/${g.slug}/`,
        stream: 'games',
        summary: g.short || g.description,
        source,
        files: files.filter(
          (f) => f === source || (f.includes(g.slug) && !f.includes('devlog')),
        ),
        image: exists(`public/images/${g.slug}-cover.webp`),
        facts: g.status ? { status: g.status } : undefined,
        links: has(own) ? linksOf(read(own)) : [],
      });
    }
  }
  if (has('src/data/projects.ts')) {
    for (const p of entriesOf(read('src/data/projects.ts'))) {
      const path = p.path || `other-projects/${p.slug}/`;
      const source = files.find((f) => f === `src/pages/${path}index.astro`);
      pages.push({
        id: `project-${p.slug}`,
        kind: 'Side project',
        name: p.name || p.slug,
        path,
        stream: 'games',
        summary: p.description || p.tagline,
        source,
        files: files.filter(
          (f) =>
            f === source ||
            (f.includes(p.slug) &&
              !f.includes('devlog') &&
              !f.startsWith('public/other-projects/')),
        ),
        facts: p.status ? { status: p.status } : undefined,
        links: [],
      });
    }
  }
  for (const source of files.filter((f) =>
    /^src\/pages\/playtest\/[^/[]+\.astro$/.test(f),
  )) {
    const slug = source.split('/').pop().replace('.astro', '');
    const src = read(source);
    pages.push({
      id: `playtest-${slug}`,
      kind: 'Playtest',
      name: `Playtest: ${slug.replace(/-/g, ' ')}`,
      path: `playtest/${slug}/`,
      stream: 'games',
      summary: astroDescription(src) || `The ${slug} playtest page.`,
      source,
      files: [source],
      facts: { listed: false },
      tags: ['unlisted'],
      links: linksOf(src),
    });
  }
  for (const source of files.filter((f) =>
    /^src\/content\/devlog\/[^/]+\.md$/.test(f),
  )) {
    const slug = source.split('/').pop().replace(/\.md$/, '');
    const src = read(source);
    const fm = frontmatter(src);
    const image = fm.image ? `public${fm.image}` : undefined;
    pages.push({
      id: `devlog-${slug}`,
      kind: 'Devlog post',
      name: fm.title || slug,
      path: `devlog/${slug}/`,
      stream: 'devlog',
      summary: fm.description || firstPara(src.replace(/^---[\s\S]*?---/, '')),
      source,
      files: [source, ...(image && has(image) ? [image] : [])],
      image: image && has(image) ? image : undefined,
      facts: {
        ...(fm.date ? { date: String(fm.date).slice(0, 10) } : {}),
        ...(fm.game ? { about: fm.game } : {}),
      },
      about: fm.game,
      links: linksOf(src),
    });
  }
  return pages;
}

/** "What uses what" between site pages: links, the post → its game, lists. */
export function pageEdges(pages) {
  const byPath = new Map(pages.map((p) => [p.path, p.id]));
  const ids = new Set(pages.map((p) => p.id));
  const edges = [];
  const seen = new Set();
  const add = (from, to, rel) => {
    const k = `${from}>${to}`;
    if (from === to || seen.has(k) || !ids.has(from) || !ids.has(to)) return;
    seen.add(k);
    edges.push({ from, to, rel });
  };
  for (const p of pages) {
    if (p.about) {
      add(p.id, `game-${p.about}`, 'about');
      add(p.id, `project-${p.about}`, 'about');
    }
    for (const l of p.links ?? [])
      if (byPath.has(l)) add(p.id, byPath.get(l), 'links to');
  }
  for (const p of pages) {
    if (p.kind === 'Game' || p.kind === 'Side project') {
      add('page-games', p.id, 'lists');
      add('page-home', p.id, 'features');
    }
    if (p.kind === 'Side project') add('page-other-projects', p.id, 'lists');
    if (p.kind === 'Devlog post') add('page-devlog', p.id, 'lists');
    if (p.kind === 'Playtest')
      add(p.id, `game-${p.id.replace(/^playtest-/, '')}`, 'plays');
  }
  return edges;
}

/** A shot's file name for a page and a width: docs/shots/<id>-<desktop|phone>.jpg. */
export const shotFile = (id, scenario) => `${id}-${scenario}.jpg`;
