---
title: "The pillow that wasn't: a bug from 1991 in Gobliiins"
date: "2026-10-20T07:10:00Z"
game: "gobnative"
description: "Pick up the pillow from the wrong spot and the spiders level of Gobliiins can no longer be won. The bug has been in the game since 1991. Here's what goes wrong, and how gobnative fixes it."
image: "/images/devlog/gobnative-pillow-picked.webp"
---

While playing every level of Gobliiins with gobnative's new hints, we ran into something odd in the spiders level. It happened once, and then we couldn't make it happen again.

## How the level should go

A small spider sleeps on a pillow, hanging over the top of the ladder on the left. The picker shoots it with the pistol, and it wakes up:

![The small spider over the ladder, after the shot](/images/devlog/gobnative-pillow-shot.webp)

Then he climbs the ladder, swaps the pistol for the pillow, and lays it on the flat stone in the middle of the path. The wizard's spell brings down a red flask, which lands softly on the pillow. That flask is the magic object you need:

![The flask, caught by the pillow](/images/devlog/gobnative-pillow-caught.webp)

## The shortcut that breaks the level

Here's what happened by accident: after the shot, the picker took the pillow **without climbing the ladder**. Click the pick action on the ladder just below the pillow, and he takes it from the ground.

![The picker holding the Pillow at the foot of the ladder](/images/devlog/gobnative-pillow-picked.webp)

It looks like a handy shortcut. But lay that pillow on the stone, and the flask shatters every single time. The level can no longer be won.

![The flask shattering, though the pillow is right there](/images/devlog/gobnative-pillow-cracked.webp)

## What actually goes wrong

Gobliiins doesn't have clickable objects the way later adventure games do. Each level is a grid of small cells, 12 by 6 pixels, and each cell can hold an item number. Turn on gobnative's **Show clickable spots** in this scene and you can see two separate areas: the pillow, and the ladder right below it.

![The pillow and the ladder: two clickable areas](/images/devlog/gobnative-pillow-spots.webp)

In the level's data, both areas are linked to the same game object: the spider on its pillow. That's on purpose. It lets you shoot the spider from the foot of the ladder.

But once the pillow can be picked up, a pick on the *ladder* area also takes that object. The engine then records the ladder's item number in the picker's pocket instead of the pillow's, and removes the ladder area from the map. From then on, as far as the game knows, the picker is carrying item 16, "the ladder", which happens to look exactly like a pillow. When the flask falls, the level checks for item 2, the real pillow. There isn't one, so the flask breaks.

It was hard to reproduce because you only hit it by clicking the narrow ladder area just under the pillow instead of the pillow itself. That's easy to do by accident, and hard to do twice.

## A bug from 1991

Our first thought was that we'd made a mistake in gobnative. So we checked how ScummVM, which recreates the original engine very faithfully, handles the same moment. It does exactly the same thing. The bug has been in Gobliiins since 1991.

gobnative now fixes it. In this one level, a pick on the ladder counts as picking up the pillow, under its real item number. You still get your shortcut, the ladder stays where it is, and the flask lands safely. A test plays exactly this path, pillow taken from below and flask caught, on every change, so it stays fixed.
