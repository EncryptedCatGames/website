---
title: "691 AI agent runs in 13 days, and the race conditions that came with them"
date: "2026-11-20T03:46:25.721Z"
game: "control-plane"
description: "In 13 days our AI agents merged 459 PRs across 691 runs, and hit real races: two agents on one PR, a run stuck 36 hours unseen. How an audit, property tests and a model-checked protocol, reviewed by a second AI, are meant to make those impossible."
image: "/images/devlog/control-plane-691-ai-agent-runs-in-13-days-and-the-race-conditions-that-1.webp"
---

On 13 November, two of our AI agents worked on the same pull request at the same time. Same machine, eight minutes apart. Neither knew about the other. Both could push code and both could rewrite the card we'd use to approve it.

![691 AI agent runs in 13 days, and the race conditions that came with them](/images/devlog/control-plane-691-ai-agent-runs-in-13-days-and-the-race-conditions-that-1.webp)

The agents did nothing wrong. The bug was in the system that runs them. That system had merged **459 pull requests** and run **691 agent runs** in its first 13 days, and at that pace this wasn't going to be the last race. So we're doing something unusual for a small game studio: formal verification.

## The setup

The control plane is the system that runs our AI agents. It hands a work item to an agent lead on one of our machines. The lead builds it, opens a pull request, tests it and files a card for us to approve. It builds our games, and it builds itself.

Those 691 runs span 4 projects, **3 machines** (a Linux box, a Mac mini and a MacBook) and **3 kinds of agents** (Claude, Codex and Cursor).

That's a distributed system, whether we planned one or not. At this pace, even rare race conditions stop being theoretical.

## The problems we hit

Each of these happened for real.

**Two agents on one PR.** The 13 November case above. Another time, a different shape: a fix run ended with its lead kept idle, a second fix run started on the same PR a minute later, and the idle lead could still write.

**A run that sat claimed for 36 hours.** A machine claimed a "fix the red checks" run at 04:03 on 17 November and never started it. The machine was alive and checking in the whole time, so nothing looked wrong. Our "stuck run" alert never fired. That alert only looked for runs waiting for a free slot. This run's own claim was holding the machine's only slot. The check had the same blind spot as the bug.

**A follow-up that forgot who it was.** We asked a Cursor-led run for a change. The follow-up dropped the run's settings and quietly ran on a different model.

**A machine that fell over.** This week the Mac mini hung and needed a hard power-off. An hour and a half earlier, a memory report showed 41 Node processes holding about 51 GB on a 16 GB machine. When a machine dies mid-run, what happens to the work it was holding?

Each one got a targeted fix at the time. But each fix covered one path, and the next incident came down a path nobody had looked at. We needed to reason about the possible sequences of events, not just the failures we'd already seen.

## What "formal verification" means here

We're not proving the agents write correct code. We're verifying the protocol that decides who is allowed to do what, and when. That's the part where races live.

Three techniques that complement each other, each catching things the others miss:

1. **An audit of every state change.** We went through all **23** places a worker writes to the server and asked one question about each: what if this request arrives late, after the work has moved on? It found **7 gaps**, each reproduced in a simulator before anyone wrote a fix. Among them: a delayed worker can start a lead after the run was given away, and a stale update can restore a decision we'd already replaced. None had caused an incident yet. Any of them could have.

2. **Guarantees as property-based tests.** We wrote down what must always be true, separately from the code that enforces it. For example: "a claimed run starts, or comes back with a reason, within a deadline". [fast-check](https://fast-check.dev) then throws thousands of random sequences of claims, starts, crashes and answers at it and shrinks any failure into a small, reproducible counterexample. Today that's **17 properties** that run in **0.7 seconds**. They replay three of our real incidents and fail on the code from before each fix. We planted **15 bugs** on purpose, and each was caught on **20 out of 20** random seeds. The 36-hour stuck run is caught too. The old alert still can't see it.

3. **Model checking the protocol.** This is the part people usually mean by formal verification. A small model of the start and ownership protocol, plus an explorer that walks every interleaving of claim, start, crash and lost reply up to a bound, and returns a shortest counterexample within that model. It says nothing about behaviour the model leaves out. It's being built now.

We also designed the fix the way you'd want a formal spec reviewed. Six rounds, each attacked by a second AI model told to find the race. It kept finding them:

- A worker that lost the server's reply to "I started the lead" would kill a perfectly healthy lead after its deadline.
- A run could be authorized to start twice under the same owner.
- A merge already in flight on GitHub could finish after we'd changed our decision on that PR.

Each is now a rule in the design and a test that must pass before anything is enforced.

## What we're building toward

None of this is enforced yet. These are the guarantees we're aiming for once the implementation and the verification are complete.

| Problem we had | What the new protocol is designed to guarantee |
| --- | --- |
| Two agents writing to one PR | Every run and every PR has one authorized writer. Each change of ownership bumps a number, and a write carrying an old number is refused by the server. |
| A run claimed for 36 hours, silently | A claimed run starts with a confirmed lead within a deadline, or goes back to the queue. After 3 failed tries it lands on our "Needs you" list with the reason. |
| A follow-up created twice, or with the wrong settings | One follow-up per decision, keyed on the decision itself. Double clicks, lost replies and two machines racing all give exactly one run. |
| A machine dying mid-run | One authorized owner per run at any time, even if a stale process briefly survives. A run can look "running" for a short while after its lead dies, until recovery reconciles it. As long as the recovery loop is running, it doesn't stay that way. A worker never kills a healthy lead on a timeout. |
| A merge racing a changed decision | The merge and the hand-over coordinate. A merge under a decision we've replaced never completes silently. |
| Upgrades with mixed old and new workers | An old worker can't own work once the checks are enforced. Rolling back drains work; it never switches the safety off. |
| A future change quietly weakening all this | The model and the failure scenarios run on every PR and replay every incident above. An agent's change that breaks a guarantee fails before it reaches us. |

If it holds up, it unlocks the next step we actually want: approve a whole chain of work once, and let the fleet build it overnight across several machines without two agents ever fighting over the same thing.

## What it isn't

It isn't a proof of the running system. The model is bounded and rests on stated assumptions, such as "a healthy machine takes its turn within a set time". The real server, database and GitHub are tested, not proven.

And one thing stays out of reach: a stale agent can still push to GitHub directly, since GitHub doesn't ask our server. We detect that and quarantine the branch, so it's never merged. That's weaker than prevention, and we say so in the design.

## Where it stands

- **Done:** the audit (7 gaps) and the property tests (17 properties, 15 planted bugs caught).
- **Building now:** ownership numbers and the start handshake on the server, in observe mode. It logs every write it would refuse, without refusing any yet.
- **Next:** the worker's side, one writer per PR, and the model checker.
- **Last:** switching enforcement on, only after nine regression tests pass. Each covers a known failure scenario from the incidents, the audit or the design reviews.

When the model checker runs, we'll post what it finds: the shortest counterexamples it finds in the model, and what we changed because of them.

## The bigger lesson

We started with AI agents building games. The faster and more autonomous they got, the more of our time went into the system that coordinates them. Getting AI to write code quickly turned out to be the easy part. The hard part is letting hundreds of autonomous operations execute across multiple machines without losing work, duplicating it, or corrupting each other's results. There's also a nice loop in how we're solving it: AI models reviewing the correctness of the infrastructure that coordinates other AI agents.

![691 AI agent runs in 13 days, and the race conditions that came with them](/images/devlog/control-plane-691-ai-agent-runs-in-13-days-and-the-race-conditions-that-2.webp)
