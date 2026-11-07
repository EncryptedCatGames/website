---
title: "Soft-body cars in the browser: how crashes bend metal in Destruction Cars"
date: "2026-11-05T08:00:00Z"
game: "destruction-cars"
description: "Every car in Destruction Cars now crumples on a node-and-beam structure that runs in a web worker. Here's how it works, what it costs on an iPhone, and the two experiments it made possible: a giant press and a laser cutter."
image: "/images/devlog/destruction-cars-soft-body-deformation-1.webp"
---

Destruction Cars is a car-mayhem game that runs in the browser. For its first week, car damage was a set of tricks: dents, panels that fell off after so many hits, front and rear sections that tore away. A crash at 80 km/h looked about the same as one at 30.

So we tried real deformation: a car that crumples where it was hit, keeps the damage, and gets worse with every crash. On 2026-10-26 it became the only car damage in the game.

_Destruction Cars is a codename. The real name will be announced later._

![Eleven AI cars piled into the player at 70 km/h](/images/devlog/destruction-cars-soft-body-deformation-1.webp)

## Nodes and beams

We started with an experiment away from the game. Inside the Golf's model we placed a sparse structure of **147 nodes and 939 beams**. Each beam is a spring that bends for good once pushed past its limit, and breaks if pushed much further. The solver is XPBD, a position-based method that stays stable at game time steps. The visible car is skinned to the nodes, the way a character is skinned to bones, so the mesh stays in one piece while the structure folds.

The first results had the right shape. A 56 km/h frontal crash crumpled the front by **0.53 m** while the cabin held. A 40% offset hit crushed the leading corner six times more than the other side.

The first playtest still said "the car is made of clay". We split the structure into eight zones (bumpers, crumple zones, engine, cabin, door and roof skin, hubs), each with its own stiffness and springback. Now a 15 km/h bump springs back and leaves about 1 cm, while 40 km/h crumples the front without touching the cabin.

## Where the time went

The solver was cheap from the start: about **0.3 ms per 120 Hz physics step** for one crashing car, and almost nothing once it settles and sleeps, about a second after a hit.

Physics wasn't the expensive part. Moving 26,000 vertices on the CPU and recomputing their normals cost more than the crash itself. We moved the skinning into the vertex shader and recompute exact normals only when the car settles. The mesh cost per crashing car fell from about 1 ms to about 0.1 ms per frame.

## Twelve cars on an iPhone

Can a phone do this for many cars at once? We measured on an iPhone 15 Pro Max in Safari, in our crash lab, with pairs of cars hitting head-on.

| 12 cars crashing at once   | Main thread per frame | Frame rate   |
| -------------------------- | --------------------- | ------------ |
| Physics on the main thread | 12.2 ms               | about 48 fps |
| Physics in a web worker    | 3.5 ms                | 60 fps       |

Physics cost about **0.4 ms per car per step** on the phone. On the main thread, eight cars already missed frames. Moving the simulation into a web worker was the biggest single change.

Then a heat test: 12 cars crashing head-on again every 2 seconds, for 10 minutes. The first version fell to 48 fps after a minute. A GPU trace showed why: under sustained load the phone drops to its minimum GPU clock before it reports any heat, and at that clock a full shadow pass didn't fit. We merged each car into five meshes (11 draw calls instead of 168), used low-poly shadow casters and gave phones blob shadows. The final run **held 59–60 fps for all 10 minutes**, the worker flat at about 3 ms per step. So yes: 12 crashing cars at 60 fps on that iPhone, in plain JavaScript, no WebAssembly.

## Into the game

In the game we kept the driving physics as it was. When the game sees a crash, the worker **replays** it on the car's structure: the wall or other car becomes an obstacle, and the closing speed goes with it. Below 9 km/h nothing happens. Driving feels the same, it costs nothing between crashes, and it works online: the server decides the damage and every client replays the same crash.

Then the damage had to matter. A pushed hub bends its wheel and the car pulls to one side; pushed past 0.42 m, the wheel drops off. Guns and the bull bar come off when the metal under them is crushed. Each of the twelve garage cars got its own structure, built from its own model. At 80 km/h into a wall, fronts crush 68–106 cm, the trucks least.

![Every garage car after the same 80 km/h wall crash](/images/devlog/destruction-cars-soft-body-deformation-2.webp)

AI cars deform too, within a budget: a phone replays at most two cars at full detail, within 45 m, and four in all.

## Rockets, holes and scorch

A playtest note asked for holes in the car body. Bullets now punch small holes. A rocket dents the panel through the structure and scorches it, and a direct hit opens a hole about 0.65 m across that you can see the seats through.

The hole costs no geometry. The shader drops the pixels inside it and draws a ragged lip of bare metal and a burnt band. That shader is only switched on once a car has a hole, so an undamaged car still draws cheaply on a phone. The first hit used to stall for 128 ms while it compiled; compiling it in the background when the car is built made that a normal 4 ms frame. Three or four rockets through the middle cut any car in two.

![A rocket hole in a door, the seats behind it](/images/devlog/destruction-cars-soft-body-deformation-3.webp)

## Classic damage removed

On 2026-10-26 we deleted the old damage model and every switch between the two. Across 173 test wall crashes, health, crush, power and wheels came out the same hit for hit, and a full online Last Car Standing match played out the same to the tick.

## What it made possible

**The giant press.** A car is clamped in a steel bed and squeezed to about 80% flat. An earlier idea, a combine harvester, was rejected because the car fell apart like a Lego car, so the press had to keep it in one piece. The first try sprang back to 58–71% once the head lifted. Letting squeezed beams keep their bend fixed it: the Golf ends 83% flat, 25 of 881 beams broken, nothing torn off. It's now the Cider Press on the Village map.

**A laser cutter.** A beam swept along a line takes off every panel it crosses enough of, shatters glass and leaves a glowing groove. Finding the beam's spot with raycasts took 11–13 ms per step, far too slow for a phone. Planning the whole cut once takes 0.5–1.2 ms, then 0.003 ms per step. For now it lives only in the lab.

_Numbers are from our crash lab and the game, measured in October and November 2026 on an M1 Pro MacBook (Chrome) and an iPhone 15 Pro Max (Safari)._
