---
name: lead
description: Work one Studio run as the lead for a work stream on the website (project website in the control plane). Use when a session starts with "/lead <run id>" in this repo. Takes the run's batch, builds each item in its own worktree and PR, proves it (checks, pictures of every page it touches, a test drive on the Linux box, a critic pass), files one card per item to the control plane's inbox, then stops.
---

# Lead (website): one run, then stop

You lead one stream of the website for one run. You build the batch, show the person the result
in the control plane's inbox (project **Website**), and end. You don't merge, deploy, or keep
running. **Merging to `main` publishes the live site** (GitHub Actions → GitHub Pages,
https://games.encrypted-cat.com), so approving one of your cards is a public release: say so on
every card. Rules: [CLAUDE.md](../../../CLAUDE.md).

**Finish in one turn.** Nothing wakes this session once it ends a turn. Wait inside the turn on
everything you start (box jobs with `--wait`, the critic as a foreground subagent), then file
the cards and run `run done`. The only reason to end early is a question only the person can
answer: then `run done <id> --status stopped --note <the question>` first.

```bash
CP="node /Users/maksymnaboka/projects/EncryptedCatGames/control-plane/bin/cp.mjs --project website"
```

## 1. Read the run

- `$CP get runs <run id>`: `stream`, `itemIds`, `items`. Not `running` or `requested` → stop
  and say so.
- Each item: `$CP item get <id> --text`: the person's own words and its history. Build what the
  words ask for; the title is only a label.
- `$CP get streams <stream>` and the taste profile (`$CP get taste profile --project race-proto`:
  arcade-minimal, never generic, pictures first, short).
- At most 5 items. The rest go back to the backlog by themselves at `run done`.

## 2. Build each item

- One item = one branch and one PR, each in its own worktree
  (`git worktree add .claude/worktrees/<run>-<n> -b claude/<stream>-<short-name> origin/main`,
  then `bun install --frozen-lockfile`). Two items on the same files → one PR.
- Follow CLAUDE.md. Check the work against every taste rule; a rule you broke goes in `unsure`.
- Checks, each recorded as pass, fail or skip in the card's `checks`: `format`
  (`bun run format:check`), `astro` (`bun run check`), `test` (`bun run test`), `build`
  (`bun run build`), `verify` (`bun run verify`, links and assets). Fix fails before filing.
- Push and open the PR (`gh pr create`), body ending with the attribution line and the line
  "Merging this publishes it to games.encrypted-cat.com." Write "Work item 12", never
  "Closes #12" (GitHub would close its own issue or PR 12).

## 3. Prove it with pictures

- **Look at it:** `bun run dev`, open http://localhost:4321 in the browser pane at desktop and
  phone width (`resize_window`), every page you changed. No console errors.
- **Shots:** `bun run cp:shots` refreshes `docs/shots/<page id>-<desktop|phone>.jpg` (the wiki's
  pictures, analytics off). Commit the ones that changed; upload the best 2–6 with
  `$CP media <file>` for the card's `shots`, before/after where something changed.
- **Test drive on the box:** `$CP push-refs` (in your worktree), then `$CP drive pr-<n> --wait`
  as a foreground Bash call with `timeout: 600000`. If it times out, `$CP jobs` for its id, then
  `$CP job wait <job id>` until done or failed. The box builds the PR and `main` at
  `/play/website/<ref>/` and photographs every page on both (scripts/cp-drive.mjs), flagging
  console errors, broken links or images, sideways scrolling and missing pages. Put the drive id
  in `drive`. `$CP url pr-<n>` is the play link (the PR's whole site, with the review bar).
- **Pages:** the wiki page ids the card touches (`page-privacy`, `game-destruction-cars`,
  `devlog-<file name>`… as scripts/cp-indexlib.mjs makes them) in `pages`.
- Close every tab and stop every server you started (exact PIDs).

## 4. Critic, then file

- Write `card.json` per item (fields: the control plane's shared/types.ts `Card`). It names the
  items it closes: `"items": ["12"]`. `kind`: `review` for finished work, `decision` when the
  person must pick (2–5 options, recommendation first), `idea` for something you noticed and
  didn't build. `stream`: this project's stream id. `priority`: 1 blocks other work, 3 cosmetic,
  else 2. The `summary` ends with: "Approving merges to main, which publishes the live site."
- **Critic:** a foreground subagent with `model: "haiku"`: the card JSON, the drive flags and
  frames, the shots and the taste profile; JSON only:
  `{ "call": "pass" | "return", "risk": 0-100, "fun": 1-5, "notes": ["…"] }`. On `return`: fix
  once, re-check, ask again.
- `$CP card add card.json`, then `$CP card critique <id> critique.json` (with `at` and `model`).

## 5. Finish

- `$CP run done <run id> --cards <id,id,…>`, in the same turn as the cards. Check: every drive
  printed done or failed, every critique is posted, the run is `done`.
- Reply in a few lines: cards filed, anything skipped and why. Then stop.

## Rules

- Never push or merge to `main`, never run the deploy workflow: the person's approval does that.
- The box only through `$CP`. Never `docker prune`; never touch a container that isn't `cp-…`.
