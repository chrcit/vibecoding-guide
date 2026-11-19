---
title: "Working in parallel"
summary: "While one agent works, start another on something unrelated; your attention, not the agents, sets how many can run at once."
cluster: teams
updated: 2026-11-19
aliases: ["never wait", "parallel threads", "attention"]
---

<!--
Sources: guides/ways-of-working.md "Never Wait"; guides/t3-code.md "Threads, scratch threads and projects", "Git, worktrees and review".
-->

# Working in parallel

While one agent works, start another on something unrelated; your attention, not the agents, sets how many can run at once.

Watching an agent work changes nothing it does. Give it a task and a way to check its own work, then start the next one. The bakery's holiday hours, the club's paid-members list and a messy contact spreadsheet have nothing to do with each other, so they can run side by side as three [threads](./thread.md), each with its own conversation and context.

Two rules keep it from turning into a mess:

- Give each thread its own copy of the code. Two agents in one folder overwrite each other's files. A [worktree](./worktree.md) is a separate checkout per thread, and an [agentic development environment](./agentic-development-environment.md) can make one for you.
- Add threads only while you keep up with them. Each finished run costs you a few minutes: reading the [diff](./diff.md), checking the result, deciding what next. When threads wait on you, your [review](./review.md) gets sloppy. Threads that can [check themselves](./verification.md) need a glance; work only you can judge needs you to sit down with it.

You can still add to a running thread: a message either [waits for the next turn or goes into the current one](./queue-and-steer.md). When one task splits into pieces an agent could hand out and check, that is [orchestration](./orchestration.md); the [orchestration explainer](/explain/orchestration/) shows both.

When you come back to a thread, ask for a report you can read in seconds:

```text
What have you done, what are you doing now, what is blocking you, and what have you not verified yet? Keep it short.
```

> [!technical] Making parallel threads cheap to review
> - Ask for the update as a small page when the thread has results worth seeing.
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
