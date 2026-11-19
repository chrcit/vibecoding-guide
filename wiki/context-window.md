---
title: "Context window"
summary: "The context window is everything the model can see at once; whatever is not in it does not exist for the agent."
cluster: context
updated: 2026-11-19
aliases: ["context", "working memory", "window"]
---

<!--
Sources to draw on:
- guides/agentic-coding.md: "What Agents Need"
- guides/ways-of-working.md: "Talk, Don't Type"
- guides/models-and-costs.md: "Save Money Without Losing Smarts"
- site/src/dev/levels.astro: "What the agent reads"
-->

# Context window

The context window is everything the model can see at once; whatever is not in it does not exist for the agent.

In the picture it is the glass column, and each slab is something in it: your messages, its answers, every file it read and every tool result. Nothing leaves on its own, and all of it is read again on every turn ([Window, lesson 7](/journey/window/)). When it is full, the [harness](./harness.md) summarises the pile ([compaction](./compaction.md)) or you start a new [thread](./thread.md).

What you can do about it:

- Put the right things in: name the file, paste the exact error, add the screenshot.
- Keep the rest out: one task per thread, and long searches go to a [helper](./subagent.md).
- Put what every session needs in [AGENTS.md](./instruction-file.md).

Before a long thread compacts, ask for a note:

```text
Write a short note for a new thread: the task, what is done, what is left, and the decisions we made along the way.
```

Sizes, in [tokens](./token.md), are on the [models page](/models/); [prompt caching](./prompt-caching.md) makes the rereading cheaper. More in the [context explainer](/explain/context/).

> [!technical] Seeing and clearing the window
> Most harnesses have commands for this; check `/help` for the names in yours. In Claude Code, `/context` shows what fills the window, `/compact` summarises it now and `/clear` empties it. In Codex, `/compact` and `/new`. Compact at a moment you choose, after a step is finished, rather than in the middle of one.
