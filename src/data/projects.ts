import type { Platform } from './platforms';
// Side projects shown on the homepage and the Projects page.
export const projects = [
  {
    slug: 'gobnative',
    name: 'gobnative',
    kind: 'Open source · Browser, desktop and TV',
    status: 'Open source',
    tagline: 'OLD GAMES. NEW HOME.',
    icon: 'other-projects/gobnative/play/apple-touch-icon.png',
    description:
      'Play Gobliiins, Gobliins 2, and Goblins Quest 3 in your browser, on a phone, natively on macOS and Windows, or on an LG webOS TV. Bring your own GOG copy; your game files stay on your device.',
    path: 'other-projects/gobnative/',
    platformTags: ['browser', 'mobile', 'desktop', 'tv'] as Platform[],
    // The project page is a standalone document outside the site layout.
    reload: true,
  },
  {
    slug: 'openwhisp',
    name: 'OpenWhisp',
    kind: 'Open source · macOS app',
    status: 'Open source',
    tagline: 'SPEAK. IT’S TYPED.',
    icon: 'other-projects/openwhisp/icon.png',
    description:
      'Realtime dictation for macOS that runs entirely on your Mac: words appear as you speak. It doubles as a local MCP server, so AI coding agents can hear you too. Free, no account.',
    path: 'other-projects/openwhisp/',
    platformTags: ['desktop'] as Platform[],
    // Its own site has everything; this page points there.
    site: 'https://openwhisp.app/',
  },
];
