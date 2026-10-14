---
title: "We built our own engine for narrative horror. Here's a level, from a blank page, in 60 seconds."
date: "2026-10-12T01:26:15Z"
game: "episode-01"
description: "Everything in that video is real: the same tools, the same buttons, the same build. A small asylum goes from an empty page to a lit, playable level with a working elevator, and not"
source: "https://0xkot.itch.io/the-cradle-episode-01/devlog/1703015/we-built-our-own-engine-for-narrative-horror-heres-a-level-from-a-blank-page-in-60-seconds"
---

[Watch the video](https://www.youtube.com/embed/uoYc_QS2bSo)

Everything in that video is real: the same tools, the same buttons, the same build. A small asylum goes from an empty page to a lit, playable level with a working elevator, and nothing was faked for the camera.

## Why make our own engine at all?

We make one kind of game: **narrative horror**. Corridors and rooms. Doors that are locked until you find the key. Notes in drawers, a fuse box, a CCTV room. Somewhere to hide when something comes down the hall. A lift that might not take you where you want to go.

General-purpose engines can do all of that, but they start from nothing. Every horror game built on them rebuilds the same pieces first: doors, keys, hiding spots, a creature that hunts by sound, a scripted scare, a power cut that kills the lights. We kept building those pieces, so we made them the starting point instead.

**NHR, the Narrative Horror Runtime,** is not a general game engine, and doesn't try to be. It's an engine and a set of tools for **one genre**, and everything in it is shaped around how these games are made:

-   **Levels are rooms and corridors.** You draw them on a 2D plan in metres, as rectangles, L-shapes, round halls, stairs between floors, and elevators. The map compiler builds the 3D level from that.
-   **The story is data:** "this door needs that key", "when the player reads this note, the lights go out", "the lift only works once the power's back on". The engine already knows what a door, a key, a hiding spot, a hunter and a checkpoint are.
-   **The game runs in the browser,** on a laptop or a phone, straight from itch.io, with no install. The same game also ships as a Windows app and a Steam Deck build.

## How fast is it?

Some real dates, from our own history:

-   **The Cradle: Episode 01,** our first full episode, which runs about an hour or two, went from its first file to playable on itch.io in **under two weeks**.
-   **Trick-or-Treat,** a Halloween side game with a party corridor and a 78-room labyrinth, went from its first file to live on itch in **three days**.
-   **The asylum in the video** was drawn in minutes. Each rebuild of its rooms takes about half a minute, and the final lighting bake, real ray-traced light, takes about two and a half minutes on a GPU.

Here's what the video shows, step by step:

1.  **One command starts a new game.** It creates a blank plan, a story that can't break, and a build setup.
2.  **Draw the level** in the 2D planner. Doors snap where they fit, and if a wall has nothing behind it, the planner offers to add a room there. Stairs and elevators connect the floors.
3.  **Or ask Claude.** Describe a change ("add a morgue off the cellar"), and the AI writes it into the level file. The planner shows exactly what changed, and you accept or reject each change.
4.  **Save & build.** The rooms are built in seconds and open in the 3D editor.
5.  **Dress and light it** in the 3D editor:
    -   "Dress this room" fills a ward with beds, cabinets and clutter. Reroll if you don't like it.
    -   Drag a bed in, stack a mattress and a pillow on it, group them, and lock them.
    -   Swap a poster, re-paper the walls, place a flickering lamp, add a story trigger.
6.  **Bake.** The level's lighting is baked on a GPU, the way bigger engines do it.
7.  **Press P and play it,** right there.

## AI is a tool here, not the author

We use AI the way you'd use any power tool:

-   **For the boring, repetitive parts:** writing level files from a description, dressing a room from rules, and helping write the engine's own code, all reviewed before it's kept.
-   **Everything it produces is plain, readable data**, such as the level's YAML and a list of placements. So every AI change shows up as a diff you can accept or reject.
-   **Anything you've finished can be locked,** and the AI won't touch it.

The game itself is ours: the story, the scares, the pacing, what the Nanny is, why the radio went silent. The AI makes the building faster, so more of our time goes into the parts that make it scary.

## Is it any good?

It's built to look and play like a proper game, not a prototype:

-   **Baked GPU lighting:** real bounced light and soft shadows, plus a colour grade tuned by hand.
-   **Real materials,** hand-placed and AI-dressed props, voiced dialogue in Russian and English, and an original score.
-   **It runs on phones:** it's tested in Safari on an iPhone and in mobile Chrome, as well as on desktop and the Steam Deck.
-   **Every level and every story is checked automatically:**
    -   every key can be reached before its door;
    -   no surfaces flicker against each other;
    -   every room can be walked to.More than 7,000 tests run before a build goes out, plus headless playthroughs of the episodes.

## Why not Unreal or Godot?

Both are excellent engines, and we're not saying ours is "better". It's better _for this one thing_. Here's how it compares for what we make:

Unreal Engine

Godot

NHR (ours)

**Plays in a web browser**

No: HTML5 export was dropped years ago

Yes, though it ships the whole engine first; phone browsers are the tricky part

Yes, web-first, phones included; one zip for itch.io

**What you start with**

Everything, and nothing horror-specific

A clean, general toolkit

Doors, keys, hiding spots, hunters, triggers, notes, CCTV, elevators, power cuts, cutscenes, all as data

**Making a level**

A powerful 3D editor

A good 3D editor

A 2D room planner in metres, then a 3D editor for dressing, lighting and story

**Working with AI**

Mostly binary assets and Blueprints, hard to diff

Text scene files, good

Everything is text (YAML, JSON, Python), checked by the compiler and reviewed as diffs

**Checking the game**

Up to you

Up to you

Built in: every episode is tested on every build

**Visual ceiling**

The highest there is

High

Lower, but more than enough for dark corridors and baked light

**Breadth**

Anything: open worlds, shooters, vehicles

Almost anything

One genre, on purpose

What we gave up: there's no asset marketplace, no open worlds, no general-purpose physics sandbox, and we maintain the engine ourselves. For corridor-and-rooms narrative horror, that trade has paid for itself many times over.

## What's next

**Episode 02**,  will be built entirely with these tools from the first room. **Halloween is live now** in Episode 01, with lit pumpkins and a seasonal title screen, until 1 November.

Play the games on itch: **0xkot.itch.io**. Come and tell us what scared you: **Discord** (discord.gg/ufYtrP3NRk) and **r/TheCradleHorror**.

0xKOT, Encrypted Cat Games
