---
title: "Orchestration"
summary: "Orchestration is the agent you talk to becoming the lead: it splits the job into briefs, hands them to builders, and lets nothing reach main until it passes a check."
cluster: teams
updated: 2026-11-19
aliases: ["the lead", "lead agent", "manager and workers", "agent teams", "fleet"]
---

<!--
Sources to draw on:
- guides/ways-of-working.md: "Orchestration: A Smart Manager and Cheaper Workers"
- guides/t3-code.md: "Orchestration", "Providers"
- lead notes: Theo, a top model directing small-model subagents; a runaway council run
-->

# Orchestration

Orchestration is the agent you talk to becoming the lead: it splits the job into briefs, hands them to builders, and lets nothing reach main until it passes a check.

In [Lead, lesson 12](/journey/lead/) the agent you talk to stops building. It writes briefs for [helpers](./subagent.md) that build, each in its own [worktree](./worktree.md), and collects short reports. A [check](./verification.md) in front of main catches what a helper called done and is not. In [Fleet, lesson 13](/journey/fleet/) the same loop runs twenty at once.

It pays when the job splits into pieces that can each be tested alone. It costs more than it saves on a small task, on pieces that touch the same code, or without an automated check.

```text
Plan this as tasks that can be built and tested on their own. For each, write a brief: the goal, the files, what not to touch, how to check it. Show me the plan before you start anyone.
```

The lead often runs on a stronger [model](./model.md) than the builders, and every builder spends your [usage window](./usage-window.md). Splitting by hand is [working in parallel](./parallel-work.md); the [orchestration explainer](/explain/orchestration/) compares both.

> [!technical] Keep the lead's window clear
> Ask builders for a report of a few lines: what changed, which checks passed, what was not checked. If each sends back everything it did, the lead's window fills with other agents' work. Have the lead [review](./review.md) the diff of anything that fails twice instead of sending it round again.
