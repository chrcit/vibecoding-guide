---
title: "Commit"
summary: "A commit is a saved step in your project's history, with a message saying what changed; you can always go back to it."
cluster: shipping
updated: 2026-11-19
aliases: ["git commit", "save point", "snapshot", "checkpoint"]
---

# Commit

A commit is a saved step in your project's history, with a message saying what changed; you can always go back to it.

Agents change many files quickly, and some changes are wrong. Commits make that cheap: commit when something works, and a bad change afterwards is one step to undo instead of an afternoon. In the picture, commits are the small tiles that line up on [main](./branch.md); green ones passed the [check](./verification.md), an orange one went wrong.

Ask the agent to commit in small steps, one idea each, with a message a person can read:

```text
Commit after each piece that works, one idea per commit. Write the message as what the change does, in plain words. Run the tests before each commit.
```

To undo, ask for it by name: "go back to the commit before the date change". Read the message list from time to time; it is the shortest summary of what the agents did.

> [!technical] The commands
> ```sh
> git add -A && git commit -m "Show paid members first"   # save a step
> git log --oneline -10                                     # the last ten
> git revert <hash>                                         # undo one, keeping history
> ```
>
> A commit lives on a [branch](./branch.md). Work on a branch and merge into main once it is checked; never rewrite commits others already have. More under [version control](./version-control.md).
