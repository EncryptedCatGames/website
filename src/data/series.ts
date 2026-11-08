import { games } from './games';
// The catalogue's top level: each series (or standalone game) with its games.
// The homepage hero shows one tile per series, in this order.
export const series = [
  {
    slug: 'the-cradle',
    name: 'The Cradle',
    genre: 'Narrative horror',
    status: 'Two episodes out now',
    pitch: 'Episodic horror under an abandoned Soviet sanatorium.',
    image: '/images/episode-01-1.webp',
    imageAlt: 'A dim sanatorium corridor under a single lamp.',
  },
  {
    slug: 'destruction-cars',
    name: 'Destruction Cars',
    genre: 'Car-mayhem action',
    status: 'In development',
    pitch: 'Soft-body cars, physics bosses and online play for up to 8.',
    image: '/images/destruction-cars-cover.webp',
    imageAlt: 'A car explodes on a city crossing.',
  },
].map((item) => ({
  ...item,
  games: games.filter((game) => game.series === item.slug),
}));
export type Series = (typeof series)[number];
