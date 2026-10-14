// Owner-authorized import of Encrypted Cat Games' itch.io artwork and articles.
import { load } from 'cheerio';
import TurndownService from 'turndown';
import sharp from 'sharp';
import { mkdir, writeFile, readFile, readdir, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const td = new TurndownService({ headingStyle: 'atx', bulletListMarker: '-' });
td.addRule('lineBreak', {
  filter: 'br',
  replacement: () => '\\' + '\n',
});
td.addRule('video', {
  filter: 'iframe',
  replacement: (_, node) => {
    const src = node.getAttribute('src');
    return src
      ? `\n\n[Watch the video](${src.startsWith('//') ? 'https:' + src : src})\n\n`
      : '';
  },
});
await mkdir('public/images/devlog', { recursive: true });
await mkdir('src/content/devlog', { recursive: true });
let sources = [];
try {
  sources = JSON.parse(await readFile('src/data/asset-sources.json', 'utf8'));
} catch {}
async function html(url) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const r = await fetch(url);
    if (r.status === 429 && attempt < 3) {
      console.log('Rate limited; pausing import for 30 seconds.');
      await new Promise((resolve) => setTimeout(resolve, 30000));
      continue;
    }
    if (!r.ok) throw new Error(`${r.status}: ${url}`);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    return load(await r.text());
  }
}
async function download(url, target, width = 1600) {
  try {
    await access('public' + target);
    sources.push({ file: target, source: url });
    return target;
  } catch {}
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${r.status}: ${url}`);
  await sharp(Buffer.from(await r.arrayBuffer()))
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile('public' + target);
  sources.push({ file: target, source: url });
  return target;
}
const games = [];
for (const [slug, sourceSlug] of [
  ['episode-01', 'the-cradle-episode-01'],
  ['trick-or-treat', 'the-cradle-trick-or-treat'],
]) {
  const url = `https://0xkot.itch.io/${sourceSlug}`;
  const $ = await html(url);
  const cover = await download(
    $('meta[property="og:image"]').attr('content'),
    `/images/${slug}-cover.webp`,
    1200,
  );
  const screenshots = [];
  for (const [i, el] of $('.screenshot_list a').toArray().slice(0, 6).entries())
    screenshots.push(
      await download($(el).attr('href'), `/images/${slug}-${i + 1}.webp`),
    );
  games.push({
    slug,
    url,
    cover,
    screenshots,
    widgetId: $('[data-game_id]').first().attr('data-game_id'),
  });
  await writeFile('src/data/itch.json', JSON.stringify(games, null, 2));
  const log = await html(`${url}/devlog`);
  const links = [
    ...new Set(
      [...$('a'), ...log('a')]
        .map((el) => el.attribs?.href)
        .filter((h) => h?.includes(`${sourceSlug}/devlog/`)),
    ),
  ];
  for (const postUrl of links) {
    const postId = postUrl.split('/').slice(-2, -1)[0];
    if (
      (await readdir('src/content/devlog')).some((file) =>
        file.startsWith(postId + '-'),
      )
    )
      continue;
    const p = await html(postUrl);
    const json = JSON.parse(
      p('script[type="application/ld+json"]').first().text(),
    );
    const body = p('.post_body');
    if (!body.length || !json.headline)
      throw new Error(`Missing article: ${postUrl}`);
    body.find('script,style').remove();
    let image;
    for (const img of body.find('img').toArray()) {
      const src = p(img).attr('src');
      if (!src) continue;
      const name = createHash('sha256').update(src).digest('hex').slice(0, 12);
      const local = await download(
        src.startsWith('//') ? 'https:' + src : src,
        `/images/devlog/${name}.webp`,
        1400,
      );
      p(img)
        .attr('src', local)
        .attr('alt', p(img).attr('alt') || 'Development screenshot');
      image ||= local;
    }
    const title = json.headline
      .replace(/[🎃🎮📻]/gu, '')
      .trim()
      .replace(/[—–]/g, ':');
    const slugPart =
      postUrl.split('/').slice(-2, -1)[0] +
      '-' +
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 85);
    const markdown = td
      .turndown(body.html())
      .replace(/[—–]/g, '-')
      .replace(
        /\n- 0xKOT, Encrypted Cat Games/g,
        '\n0xKOT, Encrypted Cat Games',
      );
    const description =
      body
        .find('p')
        .toArray()
        .map((el) => p(el).text())
        .find((t) => t.trim().length > 50)
        ?.replace(/[—–]/g, '-')
        .slice(0, 180) || title;
    const meta = {
      title,
      date: json.datePublished,
      game: slug,
      description,
      source: postUrl,
      ...(image ? { image } : {}),
    };
    await writeFile(
      `src/content/devlog/${slugPart}.md`,
      `---\n${Object.entries(meta)
        .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
        .join('\n')}\n---\n\n${markdown}\n`,
    );
    console.log(`Imported ${title}`);
  }
}
await writeFile('src/data/itch.json', JSON.stringify(games, null, 2));
await writeFile(
  'src/data/asset-sources.json',
  JSON.stringify(
    [...new Map(sources.map((item) => [item.file, item])).values()],
    null,
    2,
  ),
);
