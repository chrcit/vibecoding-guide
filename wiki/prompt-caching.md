---
title: "Prompt caching"
summary: "Prompt caching lets a provider reuse the work of reading a prompt it has seen recently, so an agent that rereads the same context pays far less for it."
cluster: models
updated: 2026-11-19
aliases: ["cache reads", "cache hit", "KV cache"]
---

<!--
Sources: guides/models-and-costs.md "Lineups and list prices", "Save Money Without Losing Smarts".
-->

# Prompt caching

Prompt caching lets a provider reuse the work of reading a prompt it has seen recently, so an agent that rereads the same context pays far less for it.

Every step of [the loop](./agent-loop.md) sends the whole conversation again: the harness's instructions, your [instruction file](./instruction-file.md), every message and every file the agent has read. The cache is why that is affordable. When a request starts with exactly the same text as a recent one, that part is read at a much lower price, and only the new end is read in full. The match runs from the first [token](./token.md) and stops at the first difference. Prices for cached and uncached input are on the [models page](/models/).

What follows from that, in practice:

- Keep one task per [thread](./thread.md). A thread that wanders keeps rereading history that no longer matters.
- Pick the [model](./model.md) at the start. Switching mid-thread starts a new cache.
- Expect one dear step after [compaction](./compaction.md), which rewrites the history.
- Leave the instruction file alone mid-session; a change near the start invalidates everything after it.

On an [API key](./api-key.md) the cache shows on the bill; on a [subscription plan](./subscription-plan.md) it shows as speed. The [plans explainer](/explain/plans-and-api/) compares the two. To see it on a real run, ask:

```text
For the last few steps of this session, how much of the input was read from the cache and how much was new? What broke the cache, if anything?
```

> [!technical] What gets cached, in what order
> A request is assembled in a fixed order: tool definitions, then the system prompt (the harness's instructions plus your instruction file), then the conversation. The cache covers the longest matching start of that sequence.
>
> - Adding or removing an [MCP](./mcp.md) server changes the tool definitions at the very start, so the next request misses entirely.
> - Entries expire when unused for a while. A thread you return to after a long break pays to rebuild its cache once.
> - A [subagent](./subagent.md) starts with a fresh context and builds its own cache: cheap for the main thread, not free overall.
>
> Prices, expiry times and minimum cacheable lengths differ by provider and change; they live on the [models page](/models/).

> [!engineer] Why it is a prefix cache, and how to keep the hit rate high
> A transformer reads a prompt in a prefill pass that computes, for every token at every layer, a key and a value vector for attention. Generation then attends over those vectors. Because attention is causal, the keys and values for token *n* depend only on tokens 1 to *n*. So two prompts that share their first *n* tokens share those vectors exactly, and a provider can store them (the KV cache) and skip that part of prefill on the next request. It also means there is nothing to reuse after the first differing token: everything downstream was computed against a different past.
>
> Prefill is most of the compute for a long prompt with a short reply, which is what an agent step is: a large context and a few hundred tokens of tool call. That is why a cache read can be priced at a small fraction of fresh input and why the cache hit rate is the number to watch on an agent workload.
>
> If you build on the API, or judge a harness:
>
> - Keep the history append-only. Do not rewrite earlier messages, reorder tools, or inject a timestamp or a random ID into the system prompt; each of these invalidates everything after it.
> - Put volatile material at the end. A file listing or the current date belongs in the latest message, not the system prompt.
> - Make tool definitions deterministic. Serialise them in a stable order with stable formatting.
> - Measure it. The API response reports cached and uncached input tokens separately; log the ratio per step. A sudden drop to zero mid-run usually means something early in the prompt changed.
> - Mind the expiry when you design long waits. A step that waits on a slow build longer than the cache lifetime pays the full prefix again when it resumes.
>
> Compaction trades one full-price step for a much shorter prefix on every step after it. Whether it saves money depends on how many steps remain, which is one reason harnesses compact late rather than early.
