import { games, fullName } from './games';
import { series } from './series';
import { projects } from './projects';
// What a devlog post is about: one of the games, or a side project.
export const subjectSlugs = [
  ...games.map((game) => game.slug),
  ...projects.map((project) => project.slug),
] as [string, ...string[]];
const project = (slug: string) => projects.find((p) => p.slug === slug);
// The short name (the games' subtitles, "Episode 01").
export const subjectName = (slug: string) => {
  const game = games.find((g) => g.slug === slug);
  if (game) return game.subtitle || game.title;
  return project(slug)?.name ?? slug;
};
// The full name ("The Cradle: Episode 01", "gobnative").
export const subjectFullName = (slug: string) => {
  const game = games.find((g) => g.slug === slug);
  if (game) return fullName(game);
  return project(slug)?.name ?? slug;
};
// The page about it, relative to the site root.
export const subjectPath = (slug: string) =>
  project(slug)?.path ?? `games/${slug}/`;
export const isProject = (slug: string) => Boolean(project(slug));
// The series a post belongs to (its game's series, or the side project itself).
export const subjectSeries = (slug: string) =>
  games.find((g) => g.slug === slug)?.series ?? slug;
// A series' page: its only game's page, or its place in the catalogue.
export const seriesPath = (slug: string) => {
  const item = series.find((s) => s.slug === slug);
  if (!item) return subjectPath(slug);
  return item.games.length === 1
    ? `games/${item.games[0].slug}/`
    : `games/#${item.slug}`;
};
