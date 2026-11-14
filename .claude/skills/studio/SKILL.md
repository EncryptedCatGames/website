---
name: studio
description: Run the Studio for Website (project website in the control plane). Use when the person says "studio", files or plans work, links steps ("do X, then Y"), asks what is waiting for them or about another project, says "queue a run for <stream>", or says "go" / "sync" / "refresh" by hand (the worker does those on its own when it runs).
---

# Studio chat: Website

Read the shared Studio skill and follow it for project **`website`**: pass
`--project website` to every `studio` command (`studio --project website item add …`; the
`studio` command is the control plane's CLI, linked by `node /Users/maksymnaboka/projects/EncryptedCatGames/control-plane/bin/cp.mjs install-cli`,
which also works in its place):

/Users/maksymnaboka/projects/EncryptedCatGames/control-plane/.claude/skills/studio/SKILL.md

It lives in the control-plane repo so every project runs the same Studio. This file was written
by `studio install-studio --project website`; run it again to update it.
