import artwork from './itch.json';
import type { Platform } from './platforms';
export const games = [
  {
    slug: 'episode-01',
    title: 'The Cradle',
    subtitle: 'Episode 01',
    kind: 'Narrative survival horror',
    genre: 'Horror',
    short: 'The signal stopped. Something underneath is waking up.',
    description:
      'September, 1996. A radio engineer descends beneath an abandoned Soviet sanatorium to restore a silent station. The night shift is missing. The building is listening.',
    status: 'Out now',
    platforms: 'Browser · Windows · Linux · Phone',
    // Announced but not yet released; shown after the platforms as "(coming soon)".
    comingSoon: 'iPhone & iPad app',
    platformTags: ['browser', 'desktop', 'mobile'] as Platform[],
    length: '45-60 minutes',
    languages: 'English & Russian',
    warning:
      'Horror themes, jump scares, disturbing imagery involving children, and flashing lights.',
    features: [
      [
        'Listen. Hide. Hold your breath.',
        'Something hunts by sound. Watch the cameras, move carefully, and find somewhere to hide.',
      ],
      [
        'Bring the station back to life.',
        'Fuses, codes, and frequencies. Solve puzzles woven into a place that has kept its secrets for twenty years.',
      ],
      [
        'Find what was left behind.',
        'Medical cards, duty logs, and old tapes tell a fragmented story. Discover three different endings.',
      ],
    ],
    appStoreUrl: '',
  },
  {
    slug: 'trick-or-treat',
    title: 'The Cradle',
    subtitle: 'Trick-or-Treat',
    kind: 'Halloween horror',
    genre: 'Horror',
    short: 'Twenty doors. Some sweets. One very bad choice.',
    description:
      'A Halloween party at the Swallow sanatorium needs more sweets. Knock on twenty doors, read the clues, and hope a child answers. When Nanny opens, the only way out is through her labyrinth.',
    status: 'Out now',
    platforms: 'Browser · Desktop & mobile',
    comingSoon: '',
    platformTags: ['browser', 'desktop', 'mobile'] as Platform[],
    length: 'Short & replayable',
    languages: 'English & Russian',
    warning:
      'Horror themes, jump scares, chase sequences, and dark environments.',
    features: [
      [
        'Every door is a decision.',
        'A hidden rule changes each game. Read the decorations and remember which doors were safe.',
      ],
      [
        'Follow the music.',
        'Escape Nanny through a changing labyrinth. Getting caught costs every sweet you carry.',
      ],
      [
        'Come back for another round.',
        'Five difficulty levels, an endless mode, daily rules, and sixteen achievements. No need to play Episode 01 first.',
      ],
    ],
    appStoreUrl: '',
  },
  {
    slug: 'destruction-cars',
    // Not the final name: shown with a "Working title" note.
    title: 'Destruction Cars',
    subtitle: '',
    workingTitle: true,
    kind: 'Physics destruction sandbox',
    genre: 'Action',
    short: 'Zombies. Physics. Total chaos.',
    description:
      'A chaotic physics driving game for the browser. Plough through hordes of zombies, smash cars to pieces, bring whole buildings down, and launch off loops, trampolines and skyscraper rooftops. Heavy work in progress: the name, the look and everything else may still change.',
    status: 'In development',
    platforms: 'Browser · Desktop & mobile',
    comingSoon: '',
    platformTags: ['browser', 'desktop', 'mobile'] as Platform[],
    length: 'Open-ended sandbox',
    languages: 'English',
    warning:
      'Cartoon violence against zombies, car crashes, explosions, and flashing lights.',
    features: [
      [
        'Crush the horde.',
        'Zombies, sheep, cows and the odd chicken. Hit them slowly and they topple; hit them fast and they fly.',
      ],
      [
        'Wreck everything.',
        'Cars dent, shed doors, wheels and whole front ends, catch fire and explode. Buildings crack and collapse around you.',
      ],
      [
        'Seven places to ruin.',
        'Downtown, a farm, a raceway, a snowy village, a port, a stunt park, and skyscraper rooftops above the smog.',
      ],
    ],
    appStoreUrl: '',
    // No public page yet: no play link until there is one.
    url: '',
    cover: '/images/destruction-cars-cover.webp',
    screenshots: [
      '/images/destruction-cars-1.webp',
      '/images/destruction-cars-2.webp',
      '/images/destruction-cars-3.webp',
      '/images/destruction-cars-4.webp',
      '/images/destruction-cars-5.webp',
    ],
    trailer: {
      youtubeId: '37PTZaJQYsk',
      poster: '/images/destruction-cars-trailer.webp',
      title: 'Destruction Cars teaser (work in progress)',
    },
  },
].map((game) => ({
  url: '',
  cover: '',
  screenshots: [] as string[],
  ...game,
  ...artwork.find((item) => item.slug === game.slug),
}));

export type Game = (typeof games)[number];

/** "The Cradle: Episode 01", or just the title for a game that isn't part of a series. */
export const fullName = (game: Pick<Game, 'title' | 'subtitle'>) =>
  game.subtitle ? `${game.title}: ${game.subtitle}` : game.title;

export const gameName = (slug: string) => {
  const game = games.find((g) => g.slug === slug);
  return game ? game.subtitle || game.title : slug;
};
