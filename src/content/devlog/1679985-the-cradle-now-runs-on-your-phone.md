---
title: "The Cradle now runs on your phone"
date: "2026-09-27T21:36:10Z"
game: "episode-01"
description: "You can now play The Cradle on your phone. Open the itch page, tap Run game, turn the phone sideways, and you're in the sanatorium."
source: "https://0xkot.itch.io/the-cradle-episode-01/devlog/1679985/the-cradle-now-runs-on-your-phone"
---

You can now play The Cradle on your phone. Open the itch page, tap Run game, turn the phone sideways, and you're in the sanatorium.

I finished the whole game on my own phone before writing this post. It felt strange at first, walking those dark corridors with the phone an inch from my face, and even creepier than on a computer.

**How it plays on a phone**

-   **Moving:** put your left thumb anywhere on the left side to walk. Push further to run.
-   **Looking:** drag anywhere on the right side to look around. You can move and look at the same time with both thumbs.
-   **Using things:** a button appears when there's something you can use, and it says what it does, like "Take the tape" or "Open".
-   **The other buttons** are simple icons: torch, crouch, run, notes, items and pause. They're icons rather than words, so they read the same in English and Russian.
-   **Screens and objects:** everything you read or use works by touch. That includes notes, terminals, keypads, security cameras, hiding places, and turning an item to look at it closely.
-   **The game only plays in landscape.** If you hold the phone upright, it asks you to turn it.

**Full screen**

-   **On itch:** tap Run game and it opens full screen.
-   **On Android:** the game also goes full screen on your first tap.
-   **On iPhone:** Safari doesn't allow full screen for web pages. For the best experience, add the game to your Home Screen (Share → Add to Home Screen) and launch it from the icon.

**Made for thumbs**

Thumbs are slower than a mouse, so there's a new Reaction time setting, on by default on phones. The Nanny is a little slower, and you get a bit more time before she catches you. The scares are the same; the escapes are just fair.

**Under the hood**

Phones have far less memory than computers, and the game used to need over a gigabyte of graphics memory. The phone version now uses compressed textures and needs about a fifth of that. It also lowers the graphics quality on its own if your phone starts to heat up, and if the phone's graphics crash, it reloads you at your last checkpoint.

**Smoother on computers too**

This update also brings a big round of performance work for everyone:

-   **Less drawing:** the game no longer draws rooms and floors you can't see, which cuts the work per frame roughly in half in many places.
-   **Fewer stutters:** the small freezes in the lobby, near the pit, and at the moment the Nanny starts chasing you are gone.
-   **Nothing looks different.** I checked thousands of views pixel by pixel.

**Bug fixes**

-   **Code pad:** on phones the terminal's number pad worked but was invisible. Now you can see what you're pressing.
-   **Security cameras:** the cameras on the duty room terminal didn't respond to taps on iPhone. They now work first time, and you can switch cameras with ◀ / ▶.
-   **Stuck view:** looking around sometimes stopped responding until you paused, after a swipe from the edge of the screen. That can't happen any more.
-   **Language:** switching languages mid-game left some buttons and labels in the old language. Everything now switches.

**Known issues**

Frame rate can still drop in the heaviest rooms, especially on older phones. If it feels choppy, lower the graphics quality or resolution in Settings. I'm still working on this.

**Tell me how it runs**

If you play on a phone, please leave a comment with your phone model, how smooth it felt, and anything awkward to do with your thumbs. Every report helps me tune the next update.

Thanks for playing, and don't forget to turn the lights off.
