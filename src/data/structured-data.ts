// schema.org JSON-LD for search engines, built from the same data as the pages.
import site from '../../site.config.mjs';
import { url } from '../lib';
import { games, gameName } from './games';

type Game = (typeof games)[number];
const absolute = (path = '') => new URL(url(path), site.siteUrl).href;
const languages: Record<string, string> = { English: 'en', Russian: 'ru' };

export const studio = {
  '@type': 'Organization',
  '@id': absolute('#studio'),
  name: site.name,
  url: absolute(),
  logo: absolute('images/avatar.webp'),
  email: site.email,
  sameAs: site.socials.map((social) => social.url),
};

export const homeData = {
  '@context': 'https://schema.org',
  '@graph': [
    studio,
    {
      '@type': 'WebSite',
      '@id': absolute('#website'),
      name: site.name,
      url: absolute(),
      publisher: { '@id': studio['@id'] },
    },
  ],
};

export const gameData = (game: Game) => ({
  '@context': 'https://schema.org',
  '@graph': [
    studio,
    {
      '@type': 'VideoGame',
      '@id': absolute(`games/${game.slug}/#game`),
      name: `${game.title}: ${game.subtitle}`,
      url: absolute(`games/${game.slug}/`),
      description: game.description,
      image: [game.cover, ...game.screenshots].map(absolute),
      genre: ['Horror', game.kind],
      gamePlatform: game.platforms.split('·').map((name) => name.trim()),
      inLanguage: game.languages
        .split('&')
        .map((name) => languages[name.trim()])
        .filter(Boolean),
      isPartOf: { '@type': 'VideoGameSeries', name: game.title },
      author: { '@id': studio['@id'] },
      publisher: { '@id': studio['@id'] },
      sameAs: [game.url],
    },
  ],
});

export const postData = (post: {
  id: string;
  data: {
    title: string;
    description: string;
    date: Date;
    game: string;
    image?: string;
  };
}) => ({
  '@context': 'https://schema.org',
  '@graph': [
    studio,
    {
      '@type': 'BlogPosting',
      headline: post.data.title,
      description: post.data.description,
      datePublished: post.data.date.toISOString(),
      url: absolute(`devlog/${post.id}/`),
      image: absolute(
        post.data.image || `/images/${post.data.game}-cover.webp`,
      ),
      about: {
        '@id': absolute(`games/${post.data.game}/#game`),
        name: `The Cradle: ${gameName(post.data.game)}`,
      },
      author: { '@id': studio['@id'] },
      publisher: { '@id': studio['@id'] },
    },
  ],
});
