---
title: "How do you say «Ветров»? (Russian stress vs. AI voices)"
date: "2026-09-30T18:36:50Z"
game: "episode-01"
description: "Here's a small bug that bothered me more than it should have, and a fix other devs using AI voices might find useful."
source: "https://0xkot.itch.io/the-cradle-episode-01/devlog/1684212/how-do-you-say-russian-stress-vs-ai-voices"
---

Here's a small bug that bothered me more than it should have, and a fix other devs using AI voices might find useful.

The problem

The main character is Andrei Vetrov. In Russian his surname is said vet-RÓV, with the stress on the last syllable. Stress matters a lot in Russian: move it, and a word can sound like a different name, or like a mistake.

Russian text almost never marks stress. It's in the heads of the people reading, not on the page. So when the AI voice (ElevenLabs, model v4 Turbo) reads «Ветров», it has to guess. And it guessed differently from line to line. In one scene Major Gromov would bark VÉT-rov over the radio, and a few minutes later he'd say it properly.

A Russian player notices at once. It's like a colleague getting your name wrong every other time: small, but it breaks the spell.

What I tried

ElevenLabs has no stress setting for this model, so the only lever is how the word is spelled in the text sent to the voice. I recorded the same two lines four ways and compared them by ear:

-   As written: «Ветров». It's a coin flip.
-   A capital letter on the stressed vowel: «ВетрОв». Better, but the model sometimes treats capitals as shouting.
-   A phonetic respelling: «Ветрóф». Close, but it sounds slightly off.
-   An accent mark: «Ветро́в». This is the combining acute accent Russian dictionaries and children's books use to show stress. It worked on every take.

The fix

The game's voice pipeline now has a small pronunciation list:

-   In Russian, «Ветров» and its other forms (Ветрова, Ветрову…) are always sent to the voice with the accent mark.
-   The subtitles stay exactly as written, so players never see the mark; only the voice does.
-   Any new line that mentions him gets the right stress automatically.

Nine of Gromov's lines said the name, and they're re-recorded. Every one was checked against its script with a transcript, so the words stayed exactly the same.

A tip, if you voice Russian (or Ukrainian) with AI

Put a combining acute accent, the Unicode character U+0301, after the stressed vowel. The model follows it, and you can keep it out of your subtitles.

The fix is in the latest update. If you still hear a VÉT-rov anywhere, tell me in the comments. Gromov has already been told off. 📻
