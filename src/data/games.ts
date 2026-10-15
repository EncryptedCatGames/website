import artwork from './itch.json';
import type { Platform } from './platforms';
export const games = [
  {
    slug: 'episode-01',
    title: 'The Cradle',
    subtitle: 'Episode 01',
    kind: 'Narrative survival horror',
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
].map((game) => ({
  ...game,
  ...artwork.find((item) => item.slug === game.slug)!,
}));

export const gameName = (slug: string) =>
  games.find((game) => game.slug === slug)?.subtitle ?? slug;
