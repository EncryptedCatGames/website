---
title: "Building a campaign out of boss fights"
date: "2026-10-27T10:00:00Z"
game: "destruction-cars"
description: "Our first playtest liked one thing: the boss fight. Ten days later the campaign is built around three bosses, a monster truck, a walking harbour crane and a UFO. Here's how they're made, and what didn't work the first time."
image: "/images/devlog/destruction-cars-boss-campaign-1.webp"
---

_Destruction Cars is a codename. The real name will be announced later._

Our first playtest called the game "not fun", except for the boss fight. Yesterday we removed the 20 Challenges levels and the big open map they were built on. The campaign is now a run of boss fights, each on a small map of its own. Three bosses have their own levels: Big Bertha in the Quarry, the UFO in the Village and Crane-Bot in the Harbour. None is in the campaign menu yet. A police boss for the City is planned, but not designed yet.

## Everything a boss needs, built once

Each boss starts in a test level we call the Bosses Lab, and each one is built from the same parts:

- **Weak points.** A boss has no single health bar to chip at. It has parts that take damage, and each part can ask for a direction. Bertha's fuel tanks only count hits from behind, her wheels from the side. A hard hit on armour gives a "clank", which teaches you where not to hit.
- **A hit is your speed into the face.** We measure how fast your car drives into the part, capped at your own speed, so a boss charging into a parked car doesn't hurt itself.
- **Fixed-step and seeded.** No random numbers from the clock. The same seed gives the same fight, which means we can test it, and later one machine can run the fight for everyone in co-op.

So a fix lands on every boss at once. When we found that one rocket into Bertha's middle hit both tanks, all four wheels and the roof, about 69 of her 100 health, we changed the rule for every boss: a blast now hits only the nearest weak point, and only if it faces the blast.

## Three phases, three different jobs

Every boss now has three phases, and each one asks for a different action, not a faster version of the same one. The weak points of each phase add up to exactly a third of the health, so the bar's thirds are the phases. A short cutscene marks each change. During it the boss can't hurt you or be hurt, and you get a free repair.

![Big Bertha's tanks burst as phase 2 begins: "Grab the rockets: blow her wheels off from the side"](/images/devlog/destruction-cars-boss-campaign-1.webp)

**Big Bertha**, a 9-tonne monster truck:

1. **Ram.** Bait her charge into a wall. She's stunned for 5.5 seconds, long enough to swing round and ram a fuel tank from behind.
2. **Rockets.** Rocket crates drop into the arena. Blow her wheels off from the side. If you're slow, she bolts a spare back on.
3. **Stranded.** On her axles, she fires her blower at you. When it overheats, ram the engine head-on.

**Crane-Bot**, a mobile harbour crane that walks:

1. **Legs.** Its legs are shrouded. Get close, and it stomps. The leg it stomped with stands bare for 6 seconds: ram it.
2. **Cells.** Hobbled, it throws containers at you. While it lifts one, its glowing power cells open: that's the moment for a rocket.
3. **Into the sea.** After each swing of its boom it teeters at the quay's edge. Ram it from the land side three times and it goes over.

![Crane-Bot, rebuilt as a walking harbour crane](/images/devlog/destruction-cars-boss-campaign-2.webp)

**The UFO** had a problem the others didn't: you can't ram something in the sky, and "circle and fire rockets" is boring. So the fight brings it down to you. In phase 1 it hunts you and comes down to grab your car with its tractor beam. Its lens only opens while it grabs. Three catches and your car is gone, and a burst of boost breaks you free. In phase 2 you shoot out the pods that hold it up. In phase 3 it's on the ground, and you ram the core on its back when it lands from a hop.

![The UFO's tractor beam closing in on the car over the Village](/images/devlog/destruction-cars-boss-campaign-3.webp)

The rule behind all three: every opening comes after the boss's own attack. Dodge it, then punish it.

## What didn't work

**Bertha was too easy to break and too hard to finish.** She kept driving with all four wheels shot off. Losing a wheel tilted her so far that rams went under her, and her plough could ride up the fence and leave her floating for the whole stun. An outside critique of the real level found that a scripted driver landed no tank rams in 300 seconds and fired no rockets in 150. After two rounds of fixes, 7 of 10 scripted runs win, against 2 of 10 in an earlier round.

**Crane-Bot was one loop, three times.** Break both legs, it sits, ram its core, it stands up, repeat. Its legs were worth 9 of its 100 health. A stomp cost the car 0.2%. In the rebuilt version, the first stomp onto a car under the foot hung the whole level twice. Our autopilot on the real car lost all three of its first runs: a stomp was nearly impossible to dodge from a standstill. After a longer stomp warning, a smaller ring and the fixes from an outside critique, an autopilot on the real car won all three runs, in 61 to 104 seconds.

**The UFO was too easy, then too hard.** The first playtest notes said stealing cows wasn't a mechanic and the homing rockets were nowhere to be found. After the rework the second note was "too easy": grab the homing rockets, done. So the lens and pods are now shielded outside their openings, and its lasers hurt properly: a sweep costs 14% of the car instead of 4.5%. Now a scripted driver with unlimited rockets wins in 3 minutes 50, and loses 63% of its car in phase 1 alone. That may be too much, and only a person playing it can tell us.

**The clock didn't belong.** Bertha's time limit went from 3:00 to 4:00 to 5:00 to 3:30 as we tuned her. As of today boss fights have no time limit, and medals go by par time instead: gold under 2:00 for Bertha, silver under 3:00.

## How we test a boss

A person can't play every change, so we lean on three tools:

- **Scripted runs:** the real boss, faster than real time, against an idealised car that follows the hints.
- **An autopilot on the real car,** in the real level, with real handling and damage.
- **A fight log:** time per phase, and how much of your car each attack took.

None of these replace a playtest. Bertha and the UFO have both changed a lot after people played them. Crane-Bot hasn't been played by a person yet, so every number for it is still a first guess.
