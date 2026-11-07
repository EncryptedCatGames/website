---
title: "We built a 1.6 km open world, then retired it for small maps"
date: "2026-10-28T10:00:00Z"
game: "destruction-cars"
description: "Destruction County was one connected map with eight areas and 22 levels. Two weeks in, we removed it and its levels and went with five small hand-made maps. Here's what the County was, what it cost, and what we kept."
image: "/images/devlog/destruction-cars-retiring-the-open-world-1.webp"
---

For most of its first two weeks, Destruction Cars was built around one big map: Destruction County. On October 26 we took it out of the game, along with the 22 levels we called Challenges. The game is now a boss-led campaign and online play on small maps: City, Village, Harbour, Quarry and Old Town.

_Destruction Cars is a codename. The real name will be announced later._

## What the County was

The plan was approved on October 16, the day after the project started, and built in two phases. It was one map, 1.6 × 1.6 km, with eight areas joined by 54 roads:

- **Midtown**, a 6 × 6 city grid, with the **Skyline** above it: a ten-level parking garage and five towers you could drive up and across on steel bridges.
- **Hollow Creek Farm**, with a corn maze, a creek and a covered bridge.
- **Frostpeak**, an alpine village with a frozen lake and switchbacks up to a summit.
- **The Quarry**, with the **Old Mine** underneath it: tunnels and a 40 × 200 m cavern.
- **Rustwater Docks** and the **Ironworks**, with a ship you could drive aboard.
- **Destruction Speedway**, a 2 km circuit, and **Boneyard Airfield**, a stunt field with a loop and a runway.

It was big, and it was full of things. At the last count it had 3,372 static pieces, 3,749 destructible pieces, 10,511 decoration items and 1,150 creatures in 85 zones. On top of it we built 22 levels: rampages, races, getaways, derbies, a bowling level with giant balls, a king-of-the-hill in the quarry, a time trial down the mountain. Thirteen of them lived on the County itself.

![A farm area in the Countryside map, which was cut from the County: open fields, a farmyard and silos in the haze](/images/devlog/destruction-cars-retiring-the-open-world-2.webp)

## What it cost

**Frame rate.** We compared the County with one of our small test maps, the Industrial District, on the same machine, at the same settings and at phone screen size:

| | Destruction County | Industrial District |
| --- | --- | --- |
| Frame time (Medium) | 8.4 ms | 4.5 ms |
| Simulation per tick | 3.0–3.3 ms | 0.7–0.9 ms |
| Physics bodies | 5,561 | 598 |
| Instanced objects | 10,053 | 451 |
| JS heap | 257 MB | 146 MB |

Every cost that walked "all bodies" or "all objects" was 5 to 20 times bigger on the County. Its busiest spot, the Midtown plaza, missed our budget for the lowest quality tier (220 draws and 80,000 triangles) when we first measured it. We fixed a lot: one round of work took the County's frame at phone size from 8.4 ms to 2.9 ms.

Our first iPhone readings said 2–3 fps. Part of that was our mistake: we'd tested over plain http, where iOS runs JavaScript and WebAssembly without a JIT. Over https the phone was far faster. The size problem was real either way.

**Loading.** On an M1 Pro MacBook, the County took 2.8 s from Play to driving. The Industrial District took 1.6 s. With the CPU slowed 4× to stand in for a mid-range phone, it was 8.3 s against 3.8 s. Just generating the County's layout took about half a second on desktop, and 2 s at 4×.

## What the playtests said

Not much good, and not much at all. Our first human playtest, on October 17, said the levels were "not fun", except the boss fight. Two more playtests gave notes on a handful of levels. Every other number we had on the Challenges came from scripted drivers, not people.

What we did hear pointed the same way. The rooftop and metro routes were "fine but empty". Our own review of the final level, County Rally, called it a 6:30 commute with nothing to destroy, guided only by an arrow. A big map spreads things out. In a car-combat game, spread out means minutes of driving between the moments you're playing for.

## The small map that changed our minds

On October 22 we built Old Town as a test of a new look: a single 320 × 320 m map, a loop of streets round a foundry, a car park and a rail embankment to jump. It passed review the next day: no pop-in, 60 fps on the iPhone, about 120 fps on a Pixel 6 Pro.

![Old Town's Main Street, the small map that set the size and look for the rest](/images/devlog/destruction-cars-retiring-the-open-world-1.webp)

So on October 23 we decided not to remaster the whole County. Its areas would become about five compact maps, each brought up to Old Town's quality one at a time. Three days later we went further: the County was too big for the game we were making, so it and the Challenges came out completely.

The rule for every map now is about Old Town's size, with a dense core where cars keep meeting and a loop around it. Eight cars should run into each other all the time.

| Map | Drivable area |
| --- | --- |
| Old Town | 68,700 m² |
| Quarry | 85,450 m² |
| Village | 98,700 m² |
| City (the upper limit) | 195,200 m² |

![The City, cut from the County's Midtown and Skyline, brought up to the new look](/images/devlog/destruction-cars-retiring-the-open-world-3.webp)

## What survived

Less was thrown away than it sounds.

- **The County's builder still runs.** The City, the Village and the Harbour are cut out of it at build time: the City from Midtown, the Skyline and the metro, the Harbour from the Docks and the Ironworks, the Village from the farm, cut down to Old Town's size. Then each gets its own look pass. The Quarry was authored fresh. The County is no longer a map you can play, but our map editor can still open it to edit what those maps are cut from.
- **The level machinery stays.** The level runner, the objective types, the mechanics, the AI behaviours, cash, bounties and the garage are all still in the game for the boss campaign. Big Bertha's boss level stayed, on the City.
- **The levels are written down.** Before deleting anything, we wrote up every Challenge: its map, its objective rules, its medals, its playtest verdict, and what it would need to come back on a small map. Eleven of them sit on maps that still exist and could come back almost as they were. The code is in git.

The removal itself touched 117 files: 1,079 lines added, 2,582 removed. The County's navigation and light bakes, 3.7 MB of data, went with it.

## What we learned

We built the County because a big connected world sounded like the obvious thing to want. It took us two weeks to see that the game is in the crashes, the fights and the bosses, and that all of those happen where cars are close together. A smaller map loads faster, runs better on phones, and is easier to make look good. Most of all, you spend your time in it doing the thing the game is about.
