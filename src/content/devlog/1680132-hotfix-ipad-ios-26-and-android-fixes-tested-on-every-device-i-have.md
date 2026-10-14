---
title: "Hotfix: iPad, iOS 26 and Android fixes, tested on every device I have"
date: "2026-09-27T23:54:31Z"
game: "episode-01"
description: "Right after the phone update went out, I tested The Cradle on every device I could get my hands on and found a few problems. This hotfix fixes them."
source: "https://0xkot.itch.io/the-cradle-episode-01/devlog/1680132/hotfix-ipad-ios-26-and-android-fixes-tested-on-every-device-i-have"
---

Right after the phone update went out, I tested The Cradle on every device I could get my hands on and found a few problems. This hotfix fixes them.

**The devices**

I played it myself on:

-   iPhone 15 Pro Max (iOS 27)
-   iPhone 16 Pro (iOS 26)
-   iPad Pro M1 with a Magic Keyboard (iPadOS 26)
-   Google Pixel 6 Pro
-   an older Android phone

It now runs on all of them. The nicest surprise was the iPad: it runs very, very smooth, probably even better than the iPhone. The big screen and the extra power make the sanatorium look great, and walking those corridors on a tablet in the dark is properly creepy.

**What this hotfix fixes**

-   **No sound on iOS 26.** Older versions of Safari couldn't play the game's audio format, so on some iPhones and iPads the game was completely silent, which in a horror game is a big problem. Every sound, every piece of music and every voice line now also ships in Apple's own format, and the game picks whichever your device supports. Computers are unchanged.
-   **The iPad thought it was a laptop.** With a Magic Keyboard attached, the game assumed a mouse and keyboard. It hid the touch controls, waited for a mouse lock a finger can't give, and asked you to press Esc on a keyboard that doesn't have one. Safari then ran out of memory and crashed. Now:
    -   Any iPad starts with touch controls.
    -   The trackpad works, and touching the screen switches back to touch.
    -   Every iPhone and iPad gets the lighter phone graphics, so there's no crash.
    -   On iPhone and iPad the continue screen simply says "Tap to continue".
-   **The picture was bigger than the screen on some iPhones.** On iOS 26 Safari's new toolbar covered part of the game. The game now fits exactly into the space you can see, and adjusts as the toolbar slides in and out.
-   **Crackling sound on Android.** On some Android phones the audio crackled at busy moments. Phones now get a slightly bigger audio buffer, a safety limiter so loud moments don't distort, and a lighter room echo.
-   **Other phone fixes:**
    -   Swiping sideways on a note now turns the page.
    -   The security cameras respond to the first tap on every iPhone.
    -   Looking around can no longer get "stuck" after a swipe from the screen edge.

**One thing I can't fix: full screen on iPhone**

Apple doesn't let web pages go full screen on iPhone, in any browser. Play in landscape and Safari's bars get small. For the full experience, play on a computer, an iPad or an Android phone, where full screen works.

**Thank you**

If you play on a device I haven't listed, leave a comment with the model and how it ran. That's how I found every one of these bugs.
