import { games, fullName } from './games';
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
