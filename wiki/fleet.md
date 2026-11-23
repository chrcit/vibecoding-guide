---
title: "Fleet"
summary: "A fleet is many helpers run by a lead in a loop, taking tasks from a queue, with a check in front of main."
cluster: teams
updated: 2026-11-19
aliases: ["agent fleet", "swarm", "many agents", "agents in a loop"]
---

# Fleet

A fleet is many helpers run by a lead in a loop, taking tasks from a queue, with a check in front of main.

It is the same agent as always, drawn smaller and repeated. The [lead](./orchestration.md) takes the next task, writes a [brief](./brief.md), starts a [helper](./subagent.md) in its own copy of the project ([worktree](./worktree.md)), and reads the short report. The helper's work goes to the [check](./verification.md); only what passes lands on [main](./branch.md). You read what got through, not twenty windows ([the fleet lesson](/journey/fleet/)).

Three things decide whether a fleet helps or makes a mess:

- Tasks that do not touch the same files, so the merges are small.
- A check that runs without you, so wrong work goes back before it lands.
- Short reports, so the lead's own window does not fill up.

Start with two or three helpers, not twenty. Add more only when the check catches what goes wrong and you can still read what lands.

```text
Split this into tasks that touch different files. Run each in its own worktree with a helper. Merge only what passes the tests and the type check. Report to me once per task, in two lines.
```

> [!technical] What it costs and where it breaks
> Every helper reads its own window on every turn, so a fleet draws tokens many times faster than one agent; on a [plan](./subscription-plan.md) it empties the allowance sooner. It breaks at the merge (two helpers changing one file), at the check (a weak check lets wrong work land) and at you (one person reviewing what twenty produce). See [working in parallel](./parallel-work.md).
