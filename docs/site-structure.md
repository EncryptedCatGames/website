# Site structure

How the site is organised, and why. Work item 20 (November 2026): the site read as a
horror-only studio while Destruction Cars is in active development, and most visitors arrive
from the studio's Twitter profile.

## Who arrives, and what they need

- **From a social profile link, on a phone.** They give the page a few seconds. In that time
  it has to say what the studio makes (all of it, not one genre), show the games as pictures,
  and offer one obvious way to follow.
- **From a shared link (a post, a devlog, a game).** The share card is the first impression:
  it now shows both series (`public/images/og-studio.jpg`), not the horror-only banner.
- **Returning players and press.** They want the catalogue, the latest news, and support.

Patterns that small multi-genre studios use for this, and that the site now follows:

1. A studio line that names no single genre, with the games right under it as big pictures.
2. A follow action above the fold and in the header on every page, not only at the bottom.
3. Games grouped by series (or standalone game), so an episode never looks like a separate
   studio.
4. News close to the top: an active devlog is the best proof the studio is alive.
5. Side projects and tools kept apart from the games, one click away.

## The hierarchy

```
Home
├── Games            catalogue, grouped by series
│   ├── The Cradle          series: Episode 01, Trick-or-Treat
│   └── Destruction Cars    one game, in development
├── Devlog           every post, filterable by series
├── Projects         side projects (gobnative)
├── Contact
└── Footer: Follow (every channel), Player support, Privacy, Terms, RSS
```

- **Home (minimal):** a full-screen carousel, one slide per game, taking turns between the
  series every 6 seconds (it waits on hover or focus, swipes on phones, and stays put for
  reduced motion). Each slide has one action, "See the game"; the full description lives on
  the game's own page. Under the slides: the game picker and the follow icons (X first). Below
  the fold, only the 3 latest devlog titles. The footer is the follow block.
- **Header:** Games, Devlog, Projects, Contact, and a **Follow** button that jumps to the
  footer's channels on any page. Player support moved to the footer.
- **Series** live in `src/data/series.ts`: the catalogue, the carousel's order and the devlog
  filter all read it. A game's carousel picture is its `hero` in `src/data/games.ts`. A new game joins a series with `series: '<slug>'`; a new
  standalone game gets its own series entry.

## Open questions

- X (https://x.com/encrptcatgames) and Telegram (https://t.me/encryptedcatgames) lead the channels everywhere. Steam or
  Bluesky would go in `site.config.mjs` socials the same way.
- A mailing list would be the strongest "follow" for people who don't use Discord; none
  exists yet.
