---
title: "Your project"
summary: "Your project is the folder your app lives in: its code, its files and its instruction file, which every agent you start works on."
cluster: basics
updated: 2026-11-19
aliases: ["the project", "repository", "repo", "codebase", "project folder"]
---

# Your project

Your project is the folder your app lives in: its code, its files and its instruction file, which every agent you start works on.

In the picture it is the plate of file tiles beside the agent. The green tile is the [instruction file](./instruction-file.md), AGENTS.md or CLAUDE.md, which the agent reads at the start of every [thread](./thread.md). An agent only knows the project through what it opens: a file it has not read is not in its [window](./context-window.md).

Keep everything the project needs inside the folder, so any new thread can find it: the code, the instruction file, the commands that run it and check it, and notes on decisions. Put the folder under [version control](./version-control.md) from the first day, so every change is a [commit](./commit.md) you can go back to.

When you open an unfamiliar project, ask first, before any change:

```text
Read this project and tell me in ten lines what it is, how to run it, how to check it, and where the main parts live. Change nothing.
```

> [!technical] A project the agent can work in
> Under Git the folder is a repository. Three things decide how well an agent works in it: an instruction file with the run and check commands (`npm run dev`, `npm test`, `tsc --noEmit`), checks that run without you, and a size it can search. Several agents at once each get their own copy ([worktree](./worktree.md)), not the same folder.
