---
title: "Game traps: when Gobliiins quietly makes a level unwinnable"
date: "2026-10-20T07:00:00Z"
game: "gobnative"
description: "In the last level of Gobliiins, standing one step too far left makes the game impossible to finish, and the game never tells you. gobnative now spots it and says so."
image: "/images/devlog/gobnative-trap-card.webp"
---

Old adventure games had a cruel habit: you could make a level impossible to win without knowing it. No message, no game over. You just keep trying things that can't work anymore.

We found one of these in the very last level of Gobliiins while playing through it with gobnative's new hints.

## Freeing the wizard

In the bird's skeleton, the evil wizard keeps grabbing goblins. To get the picker back, the fighter climbs up and waits at the far right end of the bird's wing, and then the wizard casts a spell. The picker is freed, but the creature grabs the wizard instead and lands right next to the fighter:

![The fighter waiting at the far right end of the wing](/images/devlog/gobnative-trap-waiting.webp)

![The creature lands with the wizard, right next to the fighter](/images/devlog/gobnative-trap-landed.webp)

Then the fighter hits it and the wizard is free.

## One step too far left

If the fighter is standing a little further left when the creature lands, his blow does nothing. And once the creature is there, he can never walk past it to the right spot.

We tested it carefully. Waiting at the far end, or one or two steps short of it, works. Three steps short (cell 13 of the level's grid) and the fighter is cut off for good. We left him there for a full minute of game time and he still just shrugged. If the wizard casts before the fighter has climbed up at all, he can't even get onto the wing.

The level can't be finished from there, and the game gives no sign of it.

## Telling you, before you waste an evening

gobnative's hints already know what happened in the level: they follow the game's own state. So we taught them to recognise traps too. A trap is just a description of a state the level can't be won from: here, "the creature has the wizard, and the fighter is at cell 13 or further left".

When that state happens, and hints are on, a red card appears without you asking:

![The Game trap card](/images/devlog/gobnative-trap-card.webp)

It says plainly that this is a trap in the game itself, not something you did wrong, and how to get out: start the level again from the Levels tab, and walk the fighter to the far right end of the wing before the wizard casts.

The hints for that level now say up front that the fighter has to be in place first, so with hints on you shouldn't fall into it at all.

While taking the screenshot for this post, we found that loading a quick save made inside the trap didn't bring the card back. That fix is on its way.
