---
title: "From pan-hit crashes to rendered engines: how we rebuilt the sound"
date: "2026-10-31T10:00:00Z"
game: "destruction-cars"
description: "Our first playtest called the money sound cheap and the free music bad. Here's how we rebuilt the sound of Destruction Cars: engines rendered in Engine Simulator, layered crashes, a mix with rooms, and a sound board for notes."
image: "/images/devlog/destruction-cars-sound-overhaul-1.webp"
---

_Destruction Cars is a codename. The real name will be announced later._

If a crash sounds like a spoon on a pan, it doesn't matter how good the dents look. Two weeks ago ours did. Here's how we rebuilt the sound.

![A chain reaction of exploding barrels on the farm](/images/devlog/destruction-cars-sound-overhaul-1.webp)

## Where we started

On day two the game had 127 sounds, 1.7 MB in total, all free CC0 recordings. We wrote an audit before changing anything, and it wasn't kind:

- **Four engine recordings for twelve cars.** The small four-cylinder hatchbacks played an Aston Martin. Two of the old Soviet sedans had no entry at all and fell back to the same Aston Martin. The electric pickup played a diesel truck.
- **Two half-second loops per engine**, pitched up to 4× to cover the rev range. Past about ±30% a recording turns chipmunky at the top and muddy at the bottom.
- **The tyre squeal was one narrow whistle** around 1–2 kHz, and it played almost at full level on every launch and every brake tap.
- **Crashes were 0.2–0.45 s impact clips.** A real car crash lasts 1–3 seconds: a body slam, crumpling metal, glass, then parts settling.
- **No reverb at all.** Everything sounded like it happened in a vacuum.

The target: punchy and arcade, in the spirit of Burnout and FlatOut. Crashes bigger than life, engines with character, tyres as a cue, not a constant noise. Budget: free.

## Engines rendered, not recorded

No free source has a full engine set for one car: steady loops at many RPMs, on and off the throttle. So we rendered our own with [Engine Simulator](https://github.com/ange-yaghi/engine-sim) by AngeTheGreat, which models real engines. A headless build holds each engine on a dyno at a list of RPMs and writes seamless loops.

It's Windows-only, so it runs on our Windows PC over SSH. Each car got its own engine: a Honda VTEC for the small Japanese hatch, a BMW inline-six for the German sedan, a Chrysler 440 for the muscle car, a GM LS V8 for the police car, a Chevy 454 for the pickup, and the real VAZ, ZMZ and UMZ fours for the Soviet cars. Each bank is 7 RPM points × 3 throttle levels.

Not everything worked:

- Some community engine scripts gave full throttle quieter than coasting. We swapped them.
- Our first boss, Big Bertha, got a bored and stroked 454 of her own. Her first render idled at 2,025 rpm, and every RPM row below that collapsed onto it. Closing down the idle air fixed it. Engine Simulator has no supercharger, so a sampled blower whine sits on top.

For the two electric cars, our synth whistled at 2.7–4 kHz, so they play a real recording of a rally car's electric launch instead, pitched per car.

## Crashes, tyres and a mix with rooms

- **Tyres** go in stages: a scrub at the grip limit, a squeal only for real sideways slides, a chirp when the wheels suddenly spin or lock.
- **Crashes** are layered by strength: a thump, a metal crunch sized by the hit, a sub, a debris tail, glass only when a window breaks. Every car makes them now, not just yours. Most of it came from the free Sonniss GDC bundles.
- **Rooms.** Each map has a reverb generated in code: street slaps in the city, a long tail at the port, almost dry on the farm.
- **Ducking.** A nearby explosion pulls the engines down by up to 10 dB.

![The sound board: one crash entry with its six takes, where they're used, and Keep / Change / Remove](/images/devlog/destruction-cars-sound-overhaul-2.webp)

## What the first playtest said

On 17 October a real person played the game for the first time. Three of the notes were about sound:

| Note | What we did |
|---|---|
| "The money sound when you kill a zombie sounds cheap." | Recorded coins over a low punch, with the pitch climbing up to a fifth as the multiplier goes from ×1 to ×10. The bank is a metal hit, a coin pour and two bell strikes. |
| "The free music sounds really bad." | A new 8-track punk-metal and rock playlist (David KBD, Kevin MacLeod and others, CC BY), loudness-matched. It had also been mixed about 5 dB under the engine. |
| "The boss fight needs its own music track." | A symphonic metal track with choir and brass, so a boss sounds like an event. |

The same tester found two bugs. The countdown had no sound. And the engine drone at the end of a level "doesn't end": the game paused under the results card, but nothing stopped the loops. Now the world's sounds fade over 0.4 s and stop, and a registry counts every running loop. Our check watches it drop from 23 to 0 within about a second.

Then the zombies: "they sound like water bubbles." Most of the old splats rang on for up to 0.6 s with a wobbling envelope, which is a bubbling sound. They're now bone crunches, thuds and pain yelps, capped so a horde doesn't turn to mush. Farm animals never get the gore layers, and a test checks that.

## Small enough to load on a phone

At one point all sound was one 7.45 MB file, fetched on the first tap. We split it into a core pack (3.46 MB at the time), one pack of about 300 KB per engine, and lazy packs for weapons, explosions and the boss that load when first needed. In multiplayer you hear the nearest three other cars, for under 0.1 ms per frame on a Mac.

## Listening with notes

![The Audio Check page: each step plays a moment from the game, with an A/B against the old sound](/images/devlog/destruction-cars-sound-overhaul-3.webp)

We build Destruction Cars with AI agents, and agents test with the sound muted. Every change above was checked by measurement: levels, lengths, loop counts. That says nothing about whether it sounds good. So we built two pages for human ears:

- **Audio Check** plays scripted moments from the game, from a countdown to everything exploding at once, each with an A/B against the old sound.
- **The sound board** lists every sound straight from the code, shows where each is used, and plays it the way the game does: a crash at three strengths, an engine at any RPM. Each entry has **Keep**, **Change** and **Remove**. A click writes a note, and agents pick up the open ones as work.

One note said ramming Bertha's fuel tank made a weird sound. Every metal crash take got remade as a real crunch. Once a choice had been heard, we deleted the losers: the old synth sounds, squeal and crash set are gone.

Engine Simulator is by AngeTheGreat, and he's credited in the game.
