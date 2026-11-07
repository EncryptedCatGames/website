---
title: "Building our props in Blender with AI agents"
date: "2026-11-04T10:00:00Z"
game: "destruction-cars"
description: "In a few days the Village went from boxes and borrowed models to our own Blender props, and the Quarry is following. How the loop works, why every prop ships as two models, and what went wrong."
image: "/images/devlog/destruction-cars-props-in-blender-2.webp"
---

Until the end of October, most of what you crashed into in Destruction Cars was boxes: boxes built in the game's code, a first Blender kit with flat materials, and free models from Sketchfab and Poly Haven that weren't ours. Since 1 November we've been replacing all of it with our own Blender models. First the Village, now the Quarry.

We build them with AI agents. They write the Blender scripts, render the drafts, bake the textures, put the result in the game and take the screenshots. We look at every step and say yes or no.

_Destruction Cars is a codename. The real name will be announced later._

## The loop

Every prop goes through the same steps, and nothing moves on without our OK:

1. **Brief.** References, size, materials, wear, and how it breaks. The model must fit the collider that's already in the game, so the game plays the same.
2. **Draft renders.** The model is a Python script that runs in Blender on a GPU box. It renders a fixed set of shots: three-quarter views, close-ups, a car's-eye view at 15 m, the usual in-game distance of 40 m, and a grey clay render. The agent reviews every shot itself before it shows us the contact sheet.
3. **Game build.** The detailed draft is baked down onto a light game mesh with a lower level of detail for distance.
4. **Shots.** The prop goes in behind a switch, and a script shoots the same spots with the old and the new look on Medium, High and a phone-sized screen, with draws, triangles and frame time before and after.

![The barn's third draft, the contact sheet we approved: cart bay, hoist, car's-eye view and clay render](/images/devlog/destruction-cars-props-in-blender-1.webp)

The barn was first, and it took three rounds. Round two added red walls with white trim, more wear and patches to break up the long walls. Round three took the tractor out (it became its own prop) and made the fascia boards dark tarred timber, because in faded red the roof and walls merged into one red mass. After it was in the game we asked for one more change, no Z-shaped braces on the doors, and every door was rebuilt.

The draft has 403,000 triangles, half of them straw. The game model has 8,587. Boards, corrugation and grain go into the normal map. The silhouette, the openings with real depth and the trim stay as geometry.

## One prop, two models

A phone can't afford a 2048-pixel texture set for every building, so each prop ships twice:

| Tiers       | Model                                                     | Barn triangles | Barn download |
| ----------- | --------------------------------------------------------- | -------------- | ------------- |
| High, Epic  | Its own baked albedo, normal, roughness and AO            | 8,587          | 1.69 MB       |
| Low, Medium | A lighter model on the shared Village atlas, AO in vertex colours | 1,336  | 54 KB         |

The kit version has no textures of its own. Each face picks a tile (brick, timber, corrugated sheet) and a tint from one shared atlas. On a phone, the shape and the white door frames are what read. It has to be two meshes, because the baked set needs a unique UV layout and the kit needs per-face tiles. Swapping the barn in didn't change the draw count at any test spot.

## The Village

The Village list has 126 entries: the church, the pub, shops, cottages, farm buildings, hay bales, a tractor, milk churns, a scarecrow. By 2 November all of them were in the game except one prop and the trees, which were still in progress. Each prop is its own pull request.

![Our barn and farm buildings in the Village, as the game draws them on Epic](/images/devlog/destruction-cars-props-in-blender-3.webp)

That rule matters. Several agents build props at once, and we merge some and reject others, so a prop's PR may only add its own files and never touches a shared one. If the framework can't do something, the agent stops and asks. The Blender work runs on a box with an RTX 3090 and a PC with an RTX 5090, where up to five agents share the GPU.

## What went wrong

**High came out darker than Medium.** The first baked buildings looked darker on High, and the agents covered for it with hand-tuned brightness gains of up to 1.8. When we measured, three things were wrong: the AO bake saw the low-detail model sitting on the high one and treated it as a shadow caster, the AO was raw while the kit lifts its own, and the draft's materials simply aren't the kit's colours. Our first fix matched one brightness figure over the whole model. That failed too, because inside one building the materials disagreed by up to 10×. The garage's brick wanted a gain of 0.8, its paint 2.6. What stuck was matching material by material on the main walls, then rebaking. Brick still needs a small trim, and High still lights shade more than Medium. No texture fixes that.

**Stale textures.** When the barn's doors were rebuilt, its compressed KTX2 textures still matched the old layout, so High on desktop drew old textures on the new mesh. Now a rebuilt prop must rebuild its KTX2 files in the same PR.

## The Quarry

The Quarry played well, with a derby floor, three benches, eight ramps and a crusher you can knock down, but it was almost all code boxes. Since 4 November the five plant machines, the whole crusher plant and the boulders are our own models. Eight Blender rocks replaced 360 code boxes. The pit plays at dusk under 17 floodlights, the rock and haul roads have real textures, and the rim has a gate, a site office and a fence. A blown-up machine used to turn into a grey box and vanish. Now it stays as a charred wreck.

![The Quarry's crusher plant at dusk, in the game, with the bulldozer on the left](/images/devlog/destruction-cars-props-in-blender-2.webp)

It still has open problems. The conveyor belt was taken off because it fell at the first hit, and we haven't measured the Quarry on an iPhone yet. The stunt set pieces come next.

## The cars

The cars came first. On 25 October eleven cars got a v2 model, built from code for each car's real layout: a police saloon on a perimeter frame with a V8, a pickup on a ladder frame, a rear-drive coupe with a live axle. The doors and hood have real inner panels, and the engine bay is full. When a hood comes off in a crash, there's something under it.

Review caught a lot here too: shards at a hood's corners, a latch poking through the nose, parts with their insides out, mirrors in front of the windscreen. We also converted one high-detail Sketchfab car. Its phone version looked crumpled at rest, so it stays opt-in.

## What we learned

The agents are fast at what used to be slow: modelling, baking, packaging, screenshots. What they can't do is decide what looks right. Most real problems, like the dark High tier, the braced doors and the crumpled phone car, were caught by looking, not by tests. The numbers told us why something was wrong. The screenshots told us that it was.
