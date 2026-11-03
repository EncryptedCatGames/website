---
title: "We tried WebGPU in three.js. Here's why we went back to WebGL"
date: "2026-11-03T10:00:00Z"
game: "destruction-cars"
description: "The WebGPU demos are stunning, so we moved Destruction Cars to three.js's WebGPU renderer. Two days later we went back to WebGL. Here's what we measured on a Mac, an iPhone and an RTX 5090, and why."
image: "/images/destruction-cars-cover.webp"
---

Destruction Cars is a car-mayhem game that runs in the browser, on desktop and on phones. It's built on [three.js](https://threejs.org). In October we spent two days moving it to three.js's new WebGPU renderer. Then we moved it back.

This isn't a complaint. WebGPU in three.js is clearly where things are going, and the demos are stunning. But our game has to run on an iPhone, and on an iPhone it wasn't ready for us yet. Here's what we measured.

## Why we tried it

The WebGPU demos made it look like a free upgrade: a modern post-processing chain (ambient occlusion, temporal anti-aliasing, reflections, god rays), materials written once in TSL, three.js's shading language, and, in theory, cheaper draw calls than WebGL. Safari has shipped WebGPU since iOS 26, so it would run on iPhones too.

So we built a test before touching the game: one street in the game's style, with brick and plaster buildings, lit windows, street lamps, props, a sun with shadows and up to eight cars. We drew it three ways:

- **WebGPU**: `WebGPURenderer` from `three/webgpu`, on a real WebGPU device.
- **WebGL2 fallback**: the same renderer with `forceWebGL: true`. This is what browsers without WebGPU get.
- **Classic**: the `WebGLRenderer` the game already used, with its own post chain.

## Desktop: faster on the GPU, slower on the CPU

On an M1 Pro MacBook, the GPU side looked great. Without post-processing, WebGPU drew the street in **1.3 ms**, against **2.4–3.0 ms** on classic WebGL. With the full modern chain on, it matched the classic renderer's simpler chain.

The CPU side went the other way. The WebGPU renderer spent **1.6–2.4× the CPU time per frame** of the classic one. With eight cars and full post, that was 4.7 ms against 1.9 ms. Two things stood out: the per-object work of the node system, and the temporal anti-aliasing, which tracks every object's previous position on the CPU each frame.

On a desktop that's fine. On a phone, CPU is the budget you can't spare.

## iPhone: smooth, but costly and slow to start

We ran the same test on an iPhone 15 Pro Max in Safari.

| Path, scene             | Frame (avg) | CPU per frame | Start to first frame |
| ----------------------- | ----------- | ------------- | -------------------- |
| WebGPU, full post       | 16.7 ms     | 3.6 ms        | 6.9 s                |
| WebGL2 fallback, full   | **17.8 ms** | 3.8 ms        | **7.8–27 s**         |
| Classic, full post      | 16.7 ms     | 2.3 ms        | 0.5–3.3 s            |
| WebGPU, eight cars      | 16.7 ms     | 5.1 ms        | 13.5 s               |
| Classic, eight cars     | 16.9 ms     | 3.0 ms        | 0.5 s                |

The good news: WebGPU held 60 fps on every scene, including eight cars with the full post chain.

The rest wasn't so good:

- **CPU: 1.5–1.7× classic.** It wasn't the effects. Turning post-processing off cost the same or more, so it's the renderer's overhead per draw.
- **Startup: 6–13 seconds** to the first frame on WebGPU, and up to 27 seconds on the WebGL2 fallback, for a scene with a handful of materials. Classic took half a second warm. Most of that time on the phone was the renderer waiting between shader compiles, not the compiling itself. Our real game has many more materials than the test street.
- **The fallback was the slowest path we tested.** It was the only one that dropped under 60 fps, and that was on a flagship phone. Older phones without WebGPU would land on exactly this path.

## In the real game

The test said "risky but possible", so we built it into the game behind a switch, with the full set of new effects: cascaded shadows, ambient occlusion, screen-space reflections, height fog, god rays, temporal anti-aliasing and motion blur. That's where it got harder.

- **Draw counts.** Our buildings used to break apart into pieces, and every unique debris shape was its own draw. On an RTX 5090 the WebGPU path reached **57,000 draws** at its worst, with 1% lows of 71 fps. The classic renderer drew the same view in **489 draws** at a locked 144 fps. Drawing runs of the same shape together brought one view down from 1,727 to 457 draws, but it didn't close the gap.
- **Shadows.** Cascaded shadows added around 1,000 draws, because the WebGPU path had no multi-draw to fall back on.
- **A freeze.** When a building broke, its draw batch grew mid-game. That rebuilt the shaders of every pass and broke the anti-aliasing's record of the previous frame, and the game froze. We worked around it by reserving room for debris when the map loads.
- **Two of everything.** Every custom shader effect, like the dirt at the foot of a wall or the facade details, had to be written twice: once for WebGL and once in TSL. Newer effects never got a WebGPU version at all.

Later we made buildings solid and merged them into a few big meshes, which fixed the draw counts on both renderers. We measured WebGPU again. The CPU cost was still 2–16× the classic renderer's, depending on the spot.

## What we decided

We went back to the classic `WebGLRenderer` and removed the WebGPU path. That cut 0.81 MB from the game's download. We spent the time on the game instead: new maps, weapons, bosses and online play.

## It isn't just us

Other people building on three.js report the same thing:

- The three.js forum has a thread on [the WebGPU renderer using about 2× the CPU and taking 5–10× longer to the first frame](https://discourse.threejs.org/t/webgpurenderer-2x-slower-cpu-and-5-10x-slower-first-frame-than-webglrenderer-on-many-mesh-scenes-r183-same-on-both-backends/91904) on scenes with many meshes.
- [GitHub issue #30560](https://github.com/mrdoob/three.js/issues/30560) tracks the per-object cost: each object gets its own uniform buffer that has to be bound and updated every frame, so the more objects you draw, the sooner the CPU becomes the limit.
- Others found [the WebGL fallback slower than the classic renderer](https://discourse.threejs.org/t/webgpurenderer-forcewebgl-true-vs-webglrenderer/87805/2). It's a separate renderer, not `WebGLRenderer` under the hood.
- The [three.js manual](https://threejs.org/manual/pages/webgpurenderer.html) says it too: depending on your scene, you may get better performance with `WebGLRenderer`.

What we haven't seen discussed much is phones, so we hope our iPhone numbers help.

## Not quite there yet

WebGPU in three.js is great tech, and the GPU side is already faster. For a game with lots of objects that has to start fast and run on phones, the CPU cost and the startup time aren't there yet. We'll measure again as new versions come out. When the phone numbers catch up, we'll be the first to switch.

_Numbers are from three.js r186, measured in October 2026 on an M1 Pro MacBook (Chrome), an iPhone 15 Pro Max (Safari) and a PC with an RTX 5090._
