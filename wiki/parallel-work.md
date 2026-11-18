---
title: "Working in parallel"
summary: "While one agent works, start another on something unrelated; your attention, not the agents, sets how many can run at once."
cluster: teams
updated: 2026-11-18
aliases: ["never wait", "parallel threads", "attention"]
---

<!--
Sources: guides/ways-of-working.md "Never Wait"; guides/t3-code.md "Threads, scratch threads and projects", "Git, worktrees and review".
-->

# Working in parallel

While one agent works, start another on something unrelated; your attention, not the agents, sets how many can run at once.

A run that takes a quarter of an hour is a short one now. Watching it scroll past is the most expensive thing you can do with that time, because nothing you see changes what the agent does. Give it a task and a way to check its own work, then go and start the next one.

Say you have three things to do this week. The bakery's site shows the wrong opening hours on public holidays. The football club wants its members list to show who has paid. And someone has sent you a contact spreadsheet full of duplicates. These have nothing to do with each other, so they can run side by side: three [threads](./thread.md), one per task, each with its own conversation and its own context.

Two rules keep this from turning into a mess.

First, each thread gets its own copy of the code. Two agents editing the same folder overwrite each other's files and run each other's half-finished changes in their tests. A [worktree](./worktree.md) gives each one a separate checkout of the repository. Tools like an [agentic development environment](./agentic-development-environment.md) can make one per thread for you.

Second, you are the bottleneck. Every run ends with a few minutes of your attention: reading the [diff](./diff.md), checking the result, deciding what comes next. Add threads and at some point they start waiting for you instead of the other way round, and your [review](./review.md) gets sloppy. Where that point is depends on how well each thread can [check itself](./verification.md). A thread with a test suite that settles the question needs a glance; a thread whose work only you can judge needs you to sit down with it.

While a thread runs, you can still add to it. A message you send either [waits for its next turn or goes into the running one](./queue-and-steer.md), so a forgotten detail does not mean stopping the agent.

When the work itself splits into pieces that one agent could hand out and check, that is [orchestration](./orchestration.md), the next step up. The [orchestration explainer](/explain/orchestration/) walks through both.

> [!technical] Making parallel threads cheap to review
> - Ask for an update you can read in seconds. "Tell me what you have done, what you are doing now, what is blocking you, and what you have not verified yet. Keep it short." Ask for it as a small page if the thread has results worth seeing.
> - Commit at every green state. Each thread commits when its checks pass, with a message that says what changed and why. Coming back to a thread is then a matter of reading the last few commits.
> - Keep threads to one task. A thread that has done three unrelated things is three times harder to review and carries all three in its context.
> - Give each dev server its own port and each worktree its own dependency install, or the threads trip over each other at run time instead.
> - Run long work on a machine that stays on. Threads on a laptop stop when the lid closes. See [an always-on machine](./always-on-machine.md).

> [!engineer] Why the limit is review, and how to raise it
> Treat it as a queue. Each thread produces work at some rate and each piece costs you a review. As long as review time per thread is short compared with run time, adding threads raises throughput. Once total review time exceeds the time the agents spend running, more threads only make the queue in front of you longer, and the usual response, reviewing faster, is where [shortcuts](./shortcuts.md) get through.
>
> So the lever is review cost per thread, not thread count:
>
> - Move judgement into checks. A [definition of done](./definition-of-done.md) the agent can test against turns your review from "is this right?" into "did the checks run, and are they the right checks?"
> - Shape the output for review. Small commits, a walkthrough of large diffs grouped by intent with the risky parts first, and an explicit list of what no check covers.
> - Use a second reviewer. A fresh thread on a different model that sees only the task and the diff catches a different class of mistake, and costs you only the time to read its findings.
> - Batch by kind. Reviewing three UI changes in a row is faster than alternating UI, data and infrastructure, because you keep one set of questions in your head.
>
> If the same person keeps sending you requests that you relay to an agent, the cheapest thread is the one you do not run: see [being a proxy](./proxy.md).
