import { games } from './games';
// The catalogue's top level: each series (or standalone game) with its games.
// The homepage carousel takes turns between them, in this order.
export const series = [
  {
    slug: 'the-cradle',
    name: 'The Cradle',
    genre: 'Narrative horror',
    status: 'Two episodes out now',
    pitch: 'Episodic horror under an abandoned Soviet sanatorium.',
  },
  {
    slug: 'destruction-cars',
    name: 'Destruction Cars',
    genre: 'Car-mayhem action',
    status: 'In development',
    pitch: 'Soft-body cars, physics bosses and online play for up to 8.',
  },
].map((item) => ({
  ...item,
  games: games.filter((game) => game.series === item.slug),
}));
export type Series = (typeof series)[number];
