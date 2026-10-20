import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import site from '../../../site.config.mjs';
import { subjectFullName } from '../../data/subjects';
import { url } from '../../lib';

export async function GET() {
  const posts = (await getCollection('devlog')).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );
  return rss({
    title: `${site.name} devlog`,
    description:
      'Development notes, updates, and behind-the-scenes stories from The Cradle and our other projects.',
    site: new URL(url(), site.siteUrl).href,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: url(`devlog/${post.id}/`),
      categories: [subjectFullName(post.data.game)],
    })),
    customData: '<language>en</language>',
  });
}
