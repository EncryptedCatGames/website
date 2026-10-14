---
title: "We're replacing every borrowed asset with our own"
date: "2026-10-01T03:02:13Z"
game: "episode-01"
description: "A behind-the-scenes update today, about what the game is made of."
source: "https://0xkot.itch.io/the-cradle-episode-01/devlog/1684738/were-replacing-every-borrowed-asset-with-our-own"
image: "/images/devlog/232511f9d7c3.webp"
---

A behind-the-scenes update today, about what the game is made of.

**Where we started**

Until now, The Cradle used a lot of free third-party assets: beds, chairs, desks, lamps, radios, about 44 props in all, plus some textures. They're great, generously shared under CC0 by Poly Haven and ambientCG, and they helped me ship the game fast. But I want The Cradle, and every episode after it, to be **entirely our own work**.

**What we built**

So the next step is replacing all of them. Every prop is now **generated from scratch in Blender by code**: shapes, materials, wear and labels, with no downloaded models or textures at all.

The first batch is done: **58 assets in four groups.**

-   **Hospital furniture:** iron beds, a bunk bed, bentwood chairs, a wheelchair, crutches, shelves.
-   **Office and storage:** steel desks, cabinets, a Soviet sideboard, crates, jerrycans, «тушёнка» tins, a first-aid box.
-   **Electronics:** a station radio, a portable TV, a CCTV camera, cassette recorders, a film projector, a «Слава»-style alarm clock, a wall telephone.
-   **Lamps and paperwork:** bulkhead lamps, a milk-glass globe, a green desk lamp, «Дело №» folders, a GP-5 gas mask… and a rubber duck.

[Watch the video](https://www.youtube.com/embed/D49SJgCL4Hw)

Each one matches the size of the prop it replaces, so it drops straight into the existing rooms. They're also light enough to run on phones.

**The machine behind it**

Generating and baking all of this takes a lot of computing power, so I set up a spare Linux box with an RTX 3090 as a render machine. Four builds ran on it in parallel, each baking its own group of props, while I kept working on the game.

![Development screenshot](/images/devlog/232511f9d7c3.webp)\

It also made the map itself much faster to rebuild: the lighting bake went from about 6 minutes to about 20 seconds.

**What's next**

1.  **A grit pass.** Right now some of the new props look a little too clean. They're getting a shared layer of rust, dirt, scratches and faded paint, so they fit the decaying 1996 sanatorium.
2.  **Swapping them into The Cradle.** Once they look right, they replace the third-party props in the game.
3.  **Giving them away.** I'll publish the whole set **for free on Sketchfab** under CC BY 4.0: use them in anything you like, as long as you credit _The Cradle by Encrypted Cat (0xKOT)_.

Future episodes will be built from this library, so every new location will be 100% made for this world.

Questions about the process? Ask in the comments. I'm happy to show more of how it works. 🛠️
