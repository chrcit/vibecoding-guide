---
title: "Worktree"
summary: "A worktree is its own copy of the project, a second folder on its own branch, so two agents can work at once without overwriting each other's files."
cluster: teams
updated: 2026-11-19
aliases: ["git worktree", "its own copy", "parallel checkout"]
---

<!--
Sources to draw on:
- guides/version-control.md: "Worktrees: Parallel Checkouts for Parallel Agents"
- guides/ways-of-working.md: "Git Hygiene with Agents"
- guides/t3-code.md: "Git, worktrees and review"
-->

# Worktree

A worktree is its own copy of the project, a second folder on its own branch, so two agents can work at once without overwriting each other's files.

Three agents in one folder overwrite each other's files and run each other's half-finished changes ([chapter 7](/journey/parallel/)). Give each its own copy. A worktree is the cheap kind: Git puts another [branch](./branch.md) in a second folder that shares the same history, and finished work is merged into main one piece at a time.

You rarely make one by hand. Tools for [working in parallel](./parallel-work.md) can start each [thread](./thread.md) or [helper](./subagent.md) in its own worktree; turn that on. Otherwise ask:

```text
Make a worktree for this task on a new branch, install the dependencies
there, use a dev-server port no other thread uses, and work only there.
```

Each copy needs its own install and its own port, and each still has to be merged and looked at.

> [!technical] By hand
> ```sh
> git worktree add ../club-list-paid -b paid-badge   # a new folder on a new branch
> git worktree list                                    # what exists
> git worktree remove ../club-list-paid              # once it is merged
> ```
>
> A worktree is only a separate folder. The agent can still reach outside it unless its [permission mode](./permission-mode.md) or sandbox stops it. More on Git itself under [version control](./version-control.md).
