---
title: "Context rot"
summary: "Context rot is a model answering worse as its window fills with things that do not matter to the task, long before the window is full."
cluster: context
updated: 2026-11-19
aliases: ["context rot", "a crowded window", "long-context degradation"]
---

# Context rot

Context rot is a model answering worse as its window fills with things that do not matter to the task, long before the window is full.

The model reads everything in its [window](./context-window.md) before every reply. A bigger window lets it hold more; it does not make it read better. When yesterday's job, a pasted log and three files it opened by mistake sit beside your request, they compete with it. The answer drifts towards whatever is largest and most recent, and a rule you gave at the start can be passed over even though it is still in the window. Anthropic calls this context rot: as the number of tokens in the window grows, the model's ability to recall what is in it declines ([source](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents), listed on the [sources page](/sources/)).

In the picture ([Window, lesson 7](/journey/window/)) the same request runs against three windows. With only the job in it, the agent edits the right file and keeps your date rule. After a morning of other work it keeps the file and loses the rule. With a pasted log on top it edits the wrong file. The three runs are drawn to show the mechanism; they are not a measurement.

What you can do about it:

- One job per [thread](./thread.md). Start a new one when the job changes, with a short brief.
- Paste the failing lines, not the whole log.
- Send searches to a [helper](./subagent.md), so only its short report enters your window.
- Put rules that must hold every time in the [instruction file](./instruction-file.md), which is loaded fresh at the start and survives [compaction](./compaction.md).

> [!technical] Why the checks do not catch it
> A lost rule usually still compiles and passes the tests, because nothing asserts it. If a rule matters, make it a test ([Check, lesson 9](/journey/check/)), and keep threads short enough that you are not relying on the model to remember it.

> [!engineer] Budgeting the window
> Treat the window as working memory: the hard limit is a wall, and quality falls well before it. Keep each thread to one task, bound tool output (filters, line ranges, quiet flags), and prefer a commit plus a fresh thread over repeated compaction, which loses detail each time.
