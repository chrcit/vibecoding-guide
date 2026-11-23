---
title: "Compaction"
summary: "Compaction is the harness summarising an old conversation to make room in the context window, which keeps the thread going but loses detail."
cluster: context
updated: 2026-11-19
aliases: ["auto-compact", "summarising the conversation"]
---

# Compaction

Compaction is the harness summarising an old conversation to make room in the context window, which keeps the thread going but loses detail.

In the picture ([Window, lesson 7](/journey/window/)) the full column collapses into one hatched slab, the summary, with a few recent files beside it. Everything else in the conversation is gone from the window.

What it keeps and loses:

- It keeps the gist: what the job is, what was done, what is left.
- It reloads the [instruction file](./instruction-file.md) from disk, so rules written there survive. In Claude Code, the project's CLAUDE.md and a handful of recently used files come back after compaction ([sources](/sources/)).
- It can lose anything said once in passing, such as a rule you typed into the chat early on. If a rule must hold, write it into the instruction file.

Compaction keeps a long job going when you cannot stop. Between jobs a new [thread](./thread.md) with a short brief is cleaner: it holds exactly what you put in it.

Before a thread compacts, ask for a note you control:

```text
Write a short note for a new thread: the task, what is done, what is left, and every rule I gave you.
```

> [!technical] When it happens
> Harnesses compact on their own as the window nears its limit, and let you do it earlier by command. Claude Code compacts sessions on 1M-token models shortly before the limit ([sources](/sources/)); check your harness's `/help` for the command that does it now. Doing it yourself after a finished step loses less than an automatic compaction in the middle of one.

> [!engineer] Repeated compaction drifts
> Each compaction summarises a summary. Over a long session detail drains away and earlier decisions blur. Prefer explicit task boundaries: commit, write the brief, start a new thread. See also [context rot](./context-rot.md).
