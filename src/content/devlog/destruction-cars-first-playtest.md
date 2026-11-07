---
title: "Our first playtest said \"not fun\". Except the boss fight"
date: "2026-10-19T10:00:00Z"
game: "destruction-cars"
description: "Two days into Destruction Cars we had a 20-level campaign. The first real playtest called it not fun, with one exception: the boss fight. Here's what the notes said and what we changed the same day."
image: "/images/devlog/destruction-cars-first-playtest-1.webp"
---

_Destruction Cars is a codename. The real name will be announced later._

By 17 October, two days after the project started, Destruction Cars had a full campaign: 20 levels in five chapters, a cash economy with combos, a garage, AI cars and two bosses. On paper it was a game. Then a person sat down and played it.

The verdict, word for word: "Overall, the experience is not fun."

There was one exception: "I really like the boss fight. We should definitely move in this direction."

## What the notes said

The playtest produced twelve items. Most of them were short and specific:

- **Level descriptions were far too long,** and levels 1 and 2 took too long to finish.
- **130 zombies on level 2 was too many.** The same thing for a long time, and it got boring.
- **The money sound sounded cheap,** and the HUD was confusing.
- **Picking a level froze the game,** with no "Loading" shown.
- **Debris from broken wooden things stayed everywhere.** It never disappeared, and you couldn't drive down the road.
- **In the boss fight, the crane's thrown crates left planks everywhere,** which made it impossible to drive.
- **The free music sounded bad,** and the boss fight needed its own track.
- **There weren't enough mechanics.** Hitting zombies is basically one thing, and it gets boring fast.

We turned the notes into four rules and wrote them at the top of the playtest file:

- **Short beats long.** Every objective readable at a glance, every early level done in 1–2 minutes.
- **Variety beats volume.** Don't ask for more of one action. Switch the action.
- **Clear the road.** Destruction should look spectacular for a few seconds, then get out of the way.
- **Bosses are the hook.** Build the game around them.

## Why it wasn't fun

Before changing anything we counted what the 20 levels actually asked for. 16 of the 20 came down to "make a counter reach a number": hit N zombies, wreck N cars, earn N dollars. Only 2 had a boss. The car had one verb, driving into things, and zombies couldn't hurt it, so a cull level carried no risk and asked for no decisions.

The boss fight was different. Big Bertha, a monster truck, revs before she charges. You dodge, she hits the wall and is stunned, and you get a few seconds to ram the fuel tanks on her back. A warning, a dodge, an opening, a place where your hit counts: none of the other levels had any of that.

## What we changed

We build Destruction Cars with AI agents, so we split the list across five sessions working in parallel. All of it was merged the same day.

**Shorter levels.** Every briefing is now two sentences: what to do, and one tip. A test fails the build if any briefing runs past three. Chapter 1 now runs from about one minute to three per level, with a different action in each. Level 2 went from 130 zombies in 4:00 to 35 in 1:30. Level 8, the worst offender, went from 400 zombies in 5:00 to 120 in 2:30 and lost its name, "Five Hundred", since the count was gone.

![The Bosses Lab after a 60-second Crane-Bot fight, before the fix: planks from thrown crates all over the floor](/images/devlog/destruction-cars-first-playtest-1.webp)

**Debris that goes away.** Settled debris used to freeze into a fixed collider and never leave. Smash a pile of 32 crates across a road and you got 220 frozen pieces, and a car driven into them at full throttle stopped dead. Now every piece has a lifetime (2 seconds for glass, 4 for wood, 7 for brick and concrete, 12 for big chunks), then sinks into the ground. Pieces under 80 kg can no longer stop a car. In our crate-pile test, the pieces that could block a car at 3 seconds went from 220 to 0, and nothing was left at 12 seconds.

The boss had its own version of the problem. A 60-second Crane-Bot fight left 155 debris bodies in the arena, 154 of them frozen. Thrown crates now burst into 5 chunky planks that sink after a few seconds. The same 60-second fight now leaves none.

**A loading screen.** Picking a level used to freeze the screen for up to 1.5 seconds on desktop with nothing on it, and in a few runs for over 11 seconds. The physics engine rescanned every collider in the world each time a body was removed, and a change in the number of headlights recompiled every shader. We fixed both, and the loading card now appears 5–17 ms after you pick a level. Levels are ready in about 0.2–0.45 seconds on desktop, against 0.8–1.8 before.

![The new, cleaner HUD on level 2, still with its old target of 130 zombies](/images/devlog/destruction-cars-first-playtest-2.webp)

**A HUD you can read.** The old top bar showed three dollar amounts at once: the level's target, the combo, and your career wallet. The new one shows one objective line, one combo number, and the cash from this run. Damage, repairs and the clock only appear when they matter.

**Sound and music.** The cash sound is now recorded coins over a low punch, climbing in pitch with the combo. The playlist is eight new punk-metal and rock tracks, and boss fights get their own symphonic metal track.

## Moving toward bosses

The bigger ask, "there aren't enough mechanics" and "bosses are the fun part", needed a plan rather than a fix. We wrote one the same day: thirteen new mechanics, each a new verb for the car, and a campaign where every chapter ends on a boss and every level before it teaches one thing that boss will ask of you.

We built four of them straight away: Hot Potato (pass a lit bomb by ramming), Big Ball (bowl a giant ball into a crowd), Getaway (lose the cops) and Nitro. They became a new first chapter of five short levels that ends on Big Bertha. A smaller Bertha Jr. shows up as a roadblock in the Getaway level, so the finale isn't your first meeting with her. The 20 original levels were renamed Challenges, and a locked Campaign entry now waits in the menu for the boss-led one.

## What we learned

All of this came from one player in one session. Our tests were green and our measurements looked fine, and none of that said whether the game was fun. Two days of building gave us a lot of game. One playtest told us which small part of it was worth building on. The next one is about whether the short levels and the new mechanics hold up.
