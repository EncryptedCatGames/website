---
title: "Online multiplayer: the server decides every crash"
date: "2026-11-05T10:00:00Z"
game: "destruction-cars"
description: "Up to eight players ramming each other in the browser, with the physics and the destruction on the server. How we made your own car's crashes feel instant, and what broke on slow machines."
image: "/images/devlog/destruction-cars-online-multiplayer-2.webp"
---

Destruction Cars has online play: up to eight cars in a room, humans and AI, on the small maps. Last Car Standing, King of the Hill, Hot Potato, Cash Battle, races and free roam. It runs in the browser, on desktop and on phones. Here's how it works and what we got wrong.

_Destruction Cars is a codename. The real name will be announced later._

## The server runs the game

From the first spike on 17 October, the server has been in charge. It's a Node server (Colyseus) running the same car physics as the game, at 60 ticks a second. Your browser predicts your own car, so steering answers at once. Everyone else's car is drawn slightly in the past and smoothed between snapshots. When the server disagrees with your prediction, your car is rewound and replayed.

Damage and destruction work the same way. The server runs each car's crash structure and decides every dent, every lost wheel, every wall that breaks and every building that collapses. It sends those as events, and each browser applies them to its own copy of the world.

## "Not fun, even locally"

The first long playtest, on 26 October, was two players on a local server with no AI. The verdict was "really bad, even locally": it stuttered, and damage showed up a moment late. The numbers agreed. The own car took 408 corrections, and the server ran out of a player's inputs 782 times.

It wasn't one bug. Four things added up:

1. **Your car wasn't the server's car.** Five small setup differences, like a launch boost that only the browser had and a bull bar that the browser tore off but the server didn't, made every prediction miss while touching anything.
2. **Delays grew on any hiccup and never shrank.** One stall held the smoothing delay at its cap for up to a minute.
3. **Your own crash was drawn from the server's message,** so a dent showed about 420 ms after you hit the wall.
4. **The server's tick hitched.** Crash structures were solved inside the tick.

The biggest change was for the feel of your own crashes. Your browser now crashes your car's structure from its own contacts, on the frame it hits, and draws the dent right away. Only the shape is predicted: health, handling and lost parts still come from the server. Into a wall it matches the server exactly. Car into car it can be off by 9–60 cm, so once both cars settle, the drawn car eases into the server's shape over 0.4 s. The server's crash structures moved to a worker thread.

| Two clients, local server | Before  | After        |
| ------------------------- | ------- | ------------ |
| Own-car corrections / s   | 7.3–8.8 | 0.2–1.3      |
| Your own dent shows after | ~420 ms | the next frame |
| Other cars' dents         | ~330 ms | 35–58 ms     |
| Server's worst tick, 2 bots ramming | 12–49 ms | 4.8 ms |

On a simulated 100 ms link with 1% packet loss, your own dent still shows in under 10 ms, and other cars' dents arrive about one round trip later.

## When the browser falls behind

A week earlier, a player on a Mac with seven AI cars saw everything freeze or crawl, while the server was fine at about 1 ms a tick. Each time a snapshot showed any car off by 5 cm, the browser rewound the whole world and replayed it, 12–15 times a second, and 70–80% of those rewinds were for cars more than 30 m away. On a slower machine it ran away: a page that fell behind replayed deeper and fell further behind.

Now only cars near yours trigger a rewind, far ones are nudged into place. Snapshots that arrive together rewind once, and a replay is capped at 45 ticks.

## Destruction costs bandwidth

Breaking a building online costs more than CPU. We measured it before building it. Sending every moving piece to every player would cost about 54 KB/s per player during a collapse, or 430 KB/s out of a full room. So the server only sends what can block a car, nearest first, at most 40 updates per snapshot: under 10 KB/s for the worst player. The break events themselves average 0.41 KB/s. Dust and small debris aren't sent at all. Each browser spawns its own from the break event, and if they drift apart, nobody can tell.

![A Demolition match online: walls broken by the server, a burning wreck, with the test readout on screen](/images/devlog/destruction-cars-online-multiplayer-2.webp)

## Other things we fixed

- **Cars felt slow online.** Online cars used their stock real-world tuning, with none of the campaign's upgrades. One car never reached 100 km/h. Online cars now default to an arcade class: one fast band, each car keeping its character.
- **Phones lost their seat.** iOS Safari closes the connection when you switch apps. The server now holds your seat, name and car for 25 seconds. In our latest test, a dropped connection came back in 0.2 s.
- **Nobody ever got wrecked.** With the new crash structures, a 60 km/h T-bone cost the other car about 1% health, and every Last Car Standing match ended in the sudden-death burn-out. Online crashes now cost more health than in singleplayer.
- **The Village looks the same online.** Until 5 November, online play drew a bare version of the map. It now uses the same map builder as singleplayer.

![The Village online before and after: the bare map on the left, the full look on the right](/images/devlog/destruction-cars-online-multiplayer-1.webp)

## Voice chat

Up to eight players can talk in a room. Voice runs through LiveKit next to the game server, at about 24 kbps per player. It's off until the host turns it on, and until then nothing is loaded and no microphone is asked for. The game server decides who's muted, kicked or banned, so a muted player can't get around it. Game sound ducks by 40% while someone talks.

## Checked end to end

Before a play session on 6 November, we audited online play end to end on the Village. Every mode runs to results and back. Host leaving, reconnecting, late joins and a full room of eight all work, and 598 tests pass. One player alone with no AI couldn't start a match, because it needs two cars. We fixed it the same day: an AI car joins.

