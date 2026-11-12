---
title: "How I build games and software with AI agents now"
date: "2026-11-12T18:46:46.309Z"
game: "control-plane"
description: "Six days, 225 pieces of work from \"I want X\" to a pull request with proof, 211 merged, 263 review cards answered. How the loop works, what the numbers say when read honestly (throughput did not go up; where my attention goes did), what broke, and what it cost."
image: "/images/devlog/control-plane-how-i-build-games-and-software-with-ai-agents-now-1.webp"
---

In the six days from 7 to 12 November, 225 pieces of work across several projects went from a sentence I typed ("I want X") to a pull request with proof attached, and 211 of them are merged. I answered 263 cards. The tool that ran all of it is called the control plane. It did not exist on 6 November, and agents built it that same week, through itself.

![How I build games and software with AI agents now](/images/devlog/control-plane-how-i-build-games-and-software-with-ai-agents-now-1.webp)

This post is how it works, what the numbers say when read honestly, and what broke.

## The problem: I was the glue

Before this, I built [Destruction Cars](/games/destruction-cars/) by talking to coding agents in chat windows. That works. In the 22 days before the control plane, that repo merged 309 pull requests.

But in a chat I am the scheduler (what runs next, what must wait for what), the reviewer (read the diff, pull the branch, play it), the merge button (rebase, wait for checks, fix the conflict two chats made with each other) and the deploy script. The agents wrote the code. I did everything around the code, and all of it needed me at the desk, in the right window, at the right moment.

## The loop

![The loop: the person appears once, at the verdict](/images/devlog/control-plane-how-i-build-games-and-software-with-ai-agents-now-2.webp)

*The loop: the person appears once, at the verdict*

I file an **item**: one thing I want, in my own words. Items sit in streams (Sound, Multiplayer, Page…) and can wait for each other: "render the promo after the boss model merges, post it after the render".

A worker on a Mac picks queued items up as a **run** and starts a **lead**: a headless coding-agent session with its own git worktree. The lead may hand parts to builders, each in a worktree of its own.

Before I hear about it, the lead has to **prove** the work: typecheck, tests and build; screenshots of what changed; a test drive on a Linux box that builds the branch and plays or clicks through it at desktop and phone width; and a critic, a cheaper model that reads the result and either passes it or sends it back.

Then it files **one card**: what changed in a few lines, the pictures, a link to a playable build of that exact branch, what the lead is unsure about. I answer approve, change (with a note) or reject.

![Flow: chains of work that wait for each other](/images/devlog/control-plane-how-i-build-games-and-software-with-ai-agents-now-3.webp)

*Flow: chains of work that wait for each other*

Approved cards go to a **merge queue**. It takes one pull request at a time, merges main into it, waits for the checks on that result, then merges. A conflict or a red check goes back to the lead that built it. Then the project deploys and its docs and screenshots are refreshed from main.

## Why games are different

A diff tells you nothing about whether a boss fight is fun. So a game card carries a build I can play in the browser, muted, on the phone. Some cards are playtest cards and ask only that: play this, how was it? Every card also gets a 1 to 5 "fun" guess from the critic, which I can disagree with.

My answers turn into a **taste profile**: short rules the agents read before they build. One came from a change note on a boss: "Boss fights start when the player enters the boss's arena, not on a gate or timer." Another from a promo video I sent back: "show each car in full from every angle, never close details". I wrote neither as a rule. I complained once, and the next lead already knew.

Art goes through the same loop. An agent rebuilt Big Bertha, the first boss, in Blender on the Linux box's GPU: armour plates, a toothed plough, a skull on the bull bar, a normal map baked from a roughly 100,000-triangle detail pass down to a 58,500-triangle model with a lighter one for phones. It arrived as a card with before and after pictures, behind a switch, with the fight itself untouched.

![Big Bertha before and after the rebuild, in the game](/images/devlog/control-plane-how-i-build-games-and-software-with-ai-agents-now-4.webp)

*Big Bertha before and after the rebuild, in the game*

Publishing is behind the same gate. A devlog post, a Telegram or Discord message, a video: each is uploaded privately and waits on a publish card. This post went out that way.

## The rules that made it work

- **Approve means "I want this".** Making it fit with everything else that merged in the meantime is the system's job, not mine.
- **One card per item.** A change request updates the same card with a new version. No pile of near-duplicates.
- **Proof before asking.** No card without checks, pictures and a build I can open.
- **Nothing public without a card.**
- **Work can wait for work**, across projects, and starts by itself when its turn comes.
- **The core knows nothing about any game.** Each project is one config file plus a small adapter in its own repo: how to build it, how to drive it, how to index it.
- **Boards move by themselves.** I add, order and answer. No points, assignees or sprints.

## The numbers, read honestly

All figures are from the control plane's own records and GitHub, pulled on 12 November.

| What | Count |
|---|---|
| Items that went through a run | 225 (211 merged, 2 rejected, 3 cut, 9 in progress) |
| Filed to merged | median 2.6 h (middle half: 0.9 to 11.8 h) |
| Lead started to merged | median 0.9 h |
| Lead started to card filed | median 20 min (control plane), 64 min (Destruction Cars) |
| Card filed to my answer | median 14 min |
| My answers | 243 approve, 13 change, 6 reject, 1 later |
| Critic | sent back 30 of 249 cards before I saw them |
| Runs | 148: 127 finished, 8 died, 9 stopped, 4 running |
| The control plane itself | 121 pull requests, 117 merged, about 65,000 lines on main |

(The timings cover the 167 merged items whose filing time was recorded before the run started; on the first two days some items were written down only when their card was filed.)

**The game did not ship faster.** Destruction Cars merged 73 pull requests in these six days, about 12 a day. In the 22 days before, by hand, it merged about 14 a day. If you want a story about agents making ten times more code, this is not it.

What changed is where my attention goes. Before, shipping meant hours at the desk steering chats. Now it means typing what I want, then answering cards wherever I am, 14 minutes after they appear at the median. The control plane work shows the ceiling: a lead files its card 20 minutes after it starts, and the change is on main 43 minutes after the start, both medians. On the game the median from start to merged is over ten hours. My answers there come a median 22 minutes after the card, so reviewing is not the slow part. The rest is rounds of changes after I played a build, the merge queue, and in the first days a merge step that was still manual. I have not broken that down further.

**Is a 92% approval rate rubber-stamping?** Partly, maybe. Three things argue against it. The critic returned 12% of cards before they reached me, so what I see is already filtered. 50 of the approvals are decision cards, where "approve" means "I picked an option", not "the work is good". And the split is not even: on the control plane itself I approved 111 of 113, on the game 123 of 138, and all six rejects and nine of the thirteen change notes are on the game, where I play the build.

But two things argue for it. Tool changes come with a screenshot diff and green checks, and I mostly trusted those. And several of the failures below were merged by me, approved, with passing tests.

![The same Flow view on a phone](/images/devlog/control-plane-how-i-build-games-and-software-with-ai-agents-now-5.webp)

*The same Flow view on a phone*

## What it cost

At API list prices the recorded runs come to about **$1,370**: a median of $3.49 per run on the control plane and $15.48 on Destruction Cars, with one run at $123. 26 of the 148 runs have no cost recorded, so the real figure is somewhat higher. I did not pay that: the leads run on a Claude subscription. The list price is there to show what this would cost metered, and it is not small.

## What broke this week

Each of these passed its own tests and showed up only in real use.

- **The merge queue stalled.** A pull request at the front waited for checks that had already passed, and the queue never looked again. Eleven approved changes sat behind it for 40 minutes with no agent running.
- **Workers ran old code.** The worker is part of the tool it merges, and one kept running a version of itself from before a merge.
- **Change notes got lost.** I answered a card with a change note, and the note never reached a lead.
- **A post went out that I had not wanted.** A publish card that had been replaced by a better one was approved by mistake and closed by hand two minutes later, but the approval stayed on it. Six hours later, the moment automatic publishing was switched on, the old post went to Telegram and Discord.
- **Leads died mid-work.** One ended its turn while its builders were still running, which killed them. Under an hour later three leads were cut off in the same second, and I still do not know why.

The fixes are less interesting than the two habits that came out of them. First, a **rule check** that runs all the time: thirteen plain statements such as "never two live leads on one pull request", "the front of the merge queue changes within 15 minutes", "nothing goes public from a closed card". A broken rule files its own work item with the evidence. In two days it filed 19. All 19 were closed: already handled, duplicates, or false alarms. Two fixes went into the check itself, to make it quieter. It is an alarm, not yet a good one. Second, every incident became a **rehearsal**: a simulated studio with a fake agent and a fake GitHub replays each failure on every pull request. And a lead that dies is now resumed in its own worktree with a note saying why, instead of starting over.

![Activity: workers, leads and the merge queue](/images/devlog/control-plane-how-i-build-games-and-software-with-ai-agents-now-6.webp)

*Activity: workers, leads and the merge queue*

## How it compares

There are good tools for running coding agents in parallel, and I checked each one's current site before writing this. [Conductor](https://www.conductor.build/), [Vibe Kanban](https://www.vibekanban.com/) and [Agentastic](https://www.agentastic.dev/) give each agent its own worktree, show diffs, open pull requests and let you merge from the app; Conductor and Agentastic have phone apps, and both offer agent code review on request. [Claude Squad](https://github.com/smtg-ai/claude-squad) does worktrees and diffs in a terminal. [Claude Code agent teams](https://code.claude.com/docs/en/agent-teams) coordinate several sessions on shared tasks, and the [Claude Code desktop app](https://code.claude.com/docs/en/desktop) can fix failing CI and turn on GitHub’s auto-merge. (Conductor has [announced](https://www.conductor.build/announcement) it is closed to new users, and Vibe Kanban is [sunsetting](https://www.vibekanban.com/blog/shutdown) as a company project and continues as open source.)

They are far more polished than this, and most of them you can install today. What I did not find documented in any of them, as one loop, is the part after "a pull request exists": a queue that re-merges main and re-runs checks for every approved change, conflicts sent back to the agent that caused them, deploys, publishing behind approval, a critic that runs before the human is asked, playable builds for games, and preferences learned from verdicts. That part is what the control plane is for. It is also much narrower: it fits one person's habits.

## Limits

- One person. Nobody else has reviewed a card. Nothing here says it works for a team.
- It runs on a home network and is an in-house tool: not packaged, not open source.
- One machine does most of it: of the 68 runs that recorded where they ran, 65 ran on one Mac.
- The approval rate may be too comfortable, as above.
- At metered prices, $15 for a median game run is real money.
- Six days. Ask me again in six weeks.

## Next

Talking to a lead from the phone while it works, so the desktop chat app is no longer needed at all. And model choice per role, including local models and OpenRouter, to find out which parts of the loop need the expensive model and which do not.
