---
title: "One rule set for every mode"
date: "2026-10-30T10:00:00Z"
game: "destruction-cars"
description: "The same crash used to cost different amounts in free roam, boss fights, online and our test labs. On October 27 we put every mechanic on one shared rule set. Here's what had drifted apart, what changed, and how a fight can still get a special rule."
image: "/images/devlog/destruction-cars-one-rule-set-1.webp"
---

On October 27 we made one rule for the whole game: damage, deformation, wall and car crashes, destruction, boost, pickups, weapons and repairs work the same everywhere. Free roam, the campaign, boss fights, online matches and our test labs all read the same numbers. A boss fight doesn't get its own mechanics.

_Destruction Cars is a codename. The real name will be announced later._

## How the modes drifted apart

Nobody decided to make online play different from single player. It happened one fix at a time: online got its own damage numbers for fights between cars, boss fights got a tougher car, and the labs where we test weapons and bosses got their own setups. Each change made sense on its own day.

When we listed them all, the same event could cost very different amounts depending on where you were:

| The same thing | Single player | Online | Campaign and boss fights |
| --- | --- | --- | --- |
| How much of a gun hit counts | 0.17 | 1 (about 6×) | ÷1.5 (tougher car) |
| Car-vs-car crash damage | ×1 | ×3 | car 1.5× tougher |
| Ramming the boss | – | – | 20% of a car crash |
| Pickup reach | 2.8 m | 3.2 m | 2.8 m |
| Homing rocket carry cap | 6 | 4 | 6 |
| Nitro bottle | fills the boost meter | a charge: one press fired a fixed 2.5 s burst | a held item, fired for a 3 s burst |

The weapons lab used its own base tuning, with no engine wear and a 3 s fire fuse. The game used a 6 s fuse. So a weapon we tuned in the lab didn't behave the same way once it was in the game.

Some of this was just wrong, not only different. The campaign's nitro crate fired on the gamepad's X button, which is also the repair button. Online, a nitro bottle and single player's nitro bottle were two different items that looked the same.

![A nitro bottle pickup in an online test room. Online, it used to be a separate item from single player's nitro.](/images/devlog/destruction-cars-one-rule-set-2.webp)

## One place for the rules

Now every rule lives in one file of shared numbers, split into sections: damage, crashes, boost, weapons, pickups, surfaces, repairs, and a few knobs a boss fight reads. Every damage system in the game is set up from it in the same way: free roam and the campaign, every lab, the game server, and the copy of the damage model each player's browser runs to predict its own car online.

Where the modes disagreed, we picked one answer:

- **Car-vs-car crashes** use online's shares, because they were tuned for fights between cars. A ram costs the rammer about half what it did in single player.
- **Damage numbers** are single player's everywhere. Online, gun hits and most blasts now cost far less, and car-vs-car crashes cost a third of what they did, so Last Car Standing will run longer.
- **The nitro bottle** fills the boost meter in every mode. Holding boost burns it. No charges, no fixed burst, no held item.
- **Pickups** have one reach (2.8 m) and respawn per kind: repairs after 45 s, nitro bottles after 15 s, rockets after 25 s.
- **Repairs** work on demand in every level, boss fights included.

## A boss's attacks are just weapons

The biggest change was to boss fights. We removed seven special cases they used to have: the car was 1.5× tougher, ramming the boss cost 20% of a normal crash, walls pushed wheels less and held them on 5× harder, a second big blow within 1.5 s was discounted, every stomp took at least a set share of health, there were no repairs mid-fight, and the UFO's beam stopped the boost meter filling.

Now a boss's body is a heavy car, and its attacks are weapons. A stomp or slam is a blast. A crush is an impact. A flamethrower burns. A laser cuts. They all go through the same damage model as any other hit of their kind, at their own strength.

![Big Bertha winding up a charge. The debug readout bottom left still shows the car's old ×1.5 toughness, one of the special cases we removed.](/images/devlog/destruction-cars-one-rule-set-1.webp)

That makes boss fights harder on the car, and we measured how much. In the Bosses Lab, with the autopilot attacking Big Bertha, her attacks took health about 1.9× as fast under the shared rules as under the old fight rules.

## When a fight really needs a different rule

Sometimes one will. So overrides still exist, with a gate in front of them:

1. **Try it in the lab.** The Bosses Lab has a rules panel with presets and custom values, applied live. Every special case we removed is one of its presets, off by default, so any old rule can be tried again in a minute.
2. **Someone plays it and says yes.** Only then does it go onto an approved list in the code.
3. **The level asks for it.** A level that asks for an override that isn't on the list, with exactly the same values, fails to load, and a test fails with it.

The first approved override came the same day. After playing the UFO fight on the Village, the verdict was "the grass handles very badly". The Village's grass now grips like asphalt, but still looks, sounds and bumps like grass. Driven from a standing start for 1.2 s, the car reached 36.7 km/h on the Village's grass, 26.7 km/h on normal grass and 38.9 km/h on the road. Because it's a map rule, it applies wherever the Village is played, online included.

The same gate covers difficulty. We added three modes (Arcade, Challenging, Nightmare), and each is an override of the shared rules, never a separate copy of a boss.

## What we kept different, and why

A few differences stayed because they aren't rules about how things behave. The game server runs crashes on cheaper solver settings to save CPU, which push a wheel hub about twice as far, so it scales that back out and a test checks a crash costs the same online as offline. Last Car Standing knocks out a car stuck on three wheels, but that's a win condition, like a level's objective. And cutscenes pause damage in boss fights, because nobody is driving.

![A Charger after 12 hits: bumpers, bonnet, boot and doors gone, still at 85% health and driving.](/images/devlog/destruction-cars-one-rule-set-3.webp)

## Why it matters

We build Destruction Cars with AI agents working in parallel, each on its own branch. A rule that lives in five places will be changed in one of them. With one rule set, a fix to crash damage reaches every mode at once, a weapon tuned in the lab plays the same in the game, and a test checks that the same hit, blast and heat cost the same health in free roam, in a boss level, in the lab and on the real server.

It also changes what we ask of a boss. It can't be made fair with a hidden discount anymore. It has to be beatable with the same car, weapons and repairs you use everywhere else.
