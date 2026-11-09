---
title: "A test: Destruction Cars in Unreal Engine, running in your browser"
date: "2026-11-09T21:00:00Z"
game: "destruction-cars"
description: "We ported the arena of Destruction Cars from three.js to Unreal Engine and exported it to WebAssembly with Unreal Engine 5.9's new web target. It's an early test, and you can play it in your browser."
image: "/images/devlog/destruction-cars-unreal-web-1.webp"
---

This is a test. Destruction Cars runs in the browser on [three.js](https://threejs.org), with [Rapier](https://rapier.rs) for physics. Over the last few days we ported one part of it to Unreal Engine, on Unreal's own Chaos physics: the arena, four cars, our soft-body deformation, the weapons, the pickups and the AI bots. Unreal Engine 5.9 added an experimental WebAssembly target that draws with WebGPU, so we exported the port with it. It runs in the browser with no changes to the game code.

<div class="unreal-embed" id="play" data-unreal-embed>
  <img src="/images/devlog/destruction-cars-unreal-web-1.webp" alt="The arena in the Unreal Engine build, running in Chrome: the Last Car Standing menu, the Stallion 70 and the pickups" width="1280" height="577">
  <div class="unreal-embed-cover">
    <button type="button" class="button" data-play>Play here</button>
    <p class="unreal-embed-note" data-note hidden></p>
  </div>
</div>
<script src="/devlog/destruction-cars-unreal-in-the-browser/embed.js" defer></script>

It loads only when you press Play: about 90 MB the first time, and the page reloads once before it starts. You can also [open it full page](https://storage.googleapis.com/e94fdbda3a7064ad2329d5c8c09b925c/index.html).

## What's in it

- **Last Car Standing** against up to seven AI bots, best of three, on the arena.
- **Deformation:** the same crash model as the three.js game, ported to C++. Fronts crush, bonnets fly open and panels tear off.
- **Weapons and pickups:** twin machine guns, rockets, homing missiles, the mortar and the air strike.

## Before you play

- **Use Chrome or Edge on a desktop.** It needs WebGPU.
- **Not on iPhone yet.** On an iPhone it gets stuck loading the level. It's not there yet, but it's very promising.
- **The first visit downloads about 90 MB.** After that it starts faster.
- **The page reloads once the first time you press Play.** That's normal: it switches on the browser features the game's threads need.
- **Click the game** before you drive, so it gets your keys. **Full screen** sits under it.
- **Controls:** W/S and A/D to pick in the menu, Enter to start. In a match: W/S to drive, A/D to steer, F to fire, Q to change weapon, Shift to boost and Space for the handbrake.

## What it isn't

It's not the game moving to Unreal. Unreal's web target is still experimental, and this is one arena, not the campaign or online play. We wanted to see how far a port gets in the browser. On a desktop GPU it held 60 fps or more with all seven bots. For now the three.js version is still much faster, and it doesn't even use WebGPU: it runs on plain WebGL. We'll write more once we've tried it on more machines.

_Destruction Cars is a codename. The real name will be announced later._
