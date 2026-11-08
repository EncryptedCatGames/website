# Working on the website

The public Encrypted Cat Games site (https://games.encrypted-cat.com): static Astro, built with
Bun, deployed to GitHub Pages by GitHub Actions. Start with [README.md](README.md). It is a
project in the control plane (project `website`), so work goes through its inbox, wiki and
streams: `/studio` runs the Studio, `/lead <run id>` leads a run.

## Rules for agents

- **Merging to `main` publishes the live site.** The workflow builds and deploys every push to
  `main`. Never push or merge to `main` yourself; a card's approval is a public release, and
  every card and PR says so.
- **Keep replies and reports short.** Lead with the outcome, then a few bullets.
- **Work in a worktree** (`.claude/worktrees/<name>`, a `claude/<topic>` branch from
  `origin/main`, then `bun install --frozen-lockfile`). Never touch the main checkout (it has an
  untracked `vendor/`).
- **Checks before reporting:** `bun run format:check`, `bun run check`, `bun run test`,
  `bun run build`, `bun run verify`. A page change: look at it (`bun run dev`, desktop and phone
  width), then `bun run cp:shots` and commit the changed `docs/shots/`.
- **Content:** imported devlog text stays as written; screenshots and articles belong to
  Encrypted Cat Games. Privacy, terms and support must stay true for every game and app: change
  them only with the facts, and update their dates.
- **No secrets** in the repo: Actions variables are public site configuration only.
- **Previews never count as visits:** the box's builds and `cp:shots` turn analytics off
  (`PUBLIC_GA_ID=G-XXXXXXXXXX`) and drop the CNAME.

## The control plane adapter

- `scripts/cp-index.mjs` (`bun run cp:index [-- --push]`): PRs, docs, a wiki page per site page
  (from the source: pages, games, side projects, playtests, devlog posts) with its shots, and
  "what uses what" (links, a post's game, lists). Pure parts in `scripts/cp-indexlib.mjs`, tested.
- `scripts/cp-drive.mjs`: the box's test drive, every page at desktop or phone width.
- `scripts/cp-shots.mjs` (`bun run cp:shots`): builds, serves `dist/`, refreshes `docs/shots/`.
- `scripts/cp-backfill.mjs` (`bun run cp:backfill [-- --push]`): one-time done items for PRs
  merged before the control plane; skips PRs an item already names.
- Streams (ids in the control plane's `projects/website.json`): `pages`, `devlog`, `games`,
  `legal`, `deploy`.
