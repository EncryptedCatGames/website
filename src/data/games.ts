import artwork from './itch.json';
import type { Platform } from './platforms';
export const games = [
  {
    slug: 'episode-01',
    series: 'the-cradle',
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
    // The homepage carousel's picture for this game.
    hero: {
      image: '/images/episode-01-1.webp',
      alt: 'A dim sanatorium corridor under a single lamp.',
    },
  },
  {
    slug: 'trick-or-treat',
    series: 'the-cradle',
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
    hero: {
      image: '/images/trick-or-treat-4.webp',
      alt: 'Nanny waits in a doorway under paper bats.',
    },
  },
  {
    slug: 'destruction-cars',
    series: 'destruction-cars',
    // A codename, not the final name: shown with a "Codename" note.
    title: 'Destruction Cars',
    subtitle: '',
    workingTitle: true,
    kind: 'Car-mayhem action',
    genre: 'Action',
    short: 'Soft-body cars. Big bosses. Total wreckage.',
    description:
      'A car-mayhem game for the browser and phones. Cars crumple where you hit them, weapons rip doors off, and bosses (a monster truck, a UFO and a walking harbour crane) are beaten with physics. Campaign, free roam and online play for up to 8. "Destruction Cars" is only a codename: the real name will be announced later.',
    status: 'In development',
    platforms: 'Browser · Desktop & mobile',
    comingSoon: '',
    platformTags: ['browser', 'desktop', 'mobile'] as Platform[],
    length: 'Campaign, free roam & online',
    languages: 'English',
    warning:
      'Cartoon violence against zombies, car crashes, explosions, and flashing lights.',
    features: [
      [
        'Metal that really bends.',
        'Soft-body cars dent exactly where they are hit and shed doors, bonnets, bumpers and glass.',
      ],
      [
        'Bosses you beat with physics.',
        'Bait a monster truck into a wall, shoot the pods off a UFO, shove a walking crane into the sea.',
      ],
      [
        'Five places to ruin.',
        'A village with a car-crushing cider press, a quarry, a harbour, a city and an old town.',
      ],
    ],
    appStoreUrl: '',
    hero: {
      image: '/images/destruction-cars-cover.webp',
      alt: 'A car explodes on a city crossing.',
    },
    // No public page yet: no play link until there is one.
    url: '',
    cover: '/images/destruction-cars-cover.webp',
    screenshots: [
      '/images/destruction-cars/shots/chain-reaction.webp',
      '/images/destruction-cars/shots/village-ufo-b.webp',
      '/images/destruction-cars/shots/bertha-tanks.webp',
      '/images/destruction-cars/shots/horde.webp',
      '/images/destruction-cars/shots/quarry-dusk.webp',
    ],
    trailer: {
      youtubeId: 'JILZZJzn_6c',
      poster: '/images/destruction-cars/video/JILZZJzn_6c.webp',
      title: 'Destruction Cars: car deformation trailer',
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
