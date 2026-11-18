---
title: "Prompt caching"
summary: "Prompt caching lets a provider reuse the work of reading a prompt it has seen recently, so an agent that rereads the same context pays far less for it."
cluster: models
updated: 2026-11-18
aliases: ["cache reads", "cache hit", "KV cache"]
---

<!--
Sources: guides/models-and-costs.md "Lineups and list prices", "Save Money Without Losing Smarts".
-->

# Prompt caching

Prompt caching lets a provider reuse the work of reading a prompt it has seen recently, so an agent that rereads the same context pays far less for it.

A model has no memory between requests. Every step of [the loop](./agent-loop.md) sends the whole conversation again: the harness's instructions, your [instruction file](./instruction-file.md), every message, every file the agent read and every command it ran. Fixing the bakery's holiday hours might take forty steps, and each one sends everything before it plus a little more. Most of what an agent pays for is reading the same text over and over.

Providers handle this with a cache. When a request starts with exactly the same text as a recent one, the provider skips the work of reading that part again and charges much less for it. Only the new part at the end is read in full. On a long agent run, nearly all the input is a cache hit, so the cache decides much of the cost and some of the speed. The prices for cached and uncached input are on the [models page](/models/).

The catch is the word "exactly". The cache matches from the very first [token](./token.md) and stops at the first difference. Change something near the start and everything after it has to be read at full price again.

That explains a few habits that would otherwise look like superstition:

- Keep one task per [thread](./thread.md). A long thread that wanders keeps paying to reread history that no longer matters.
- Switching model halfway through a thread starts the cache again, because each model has its own.
- [Compaction](./compaction.md) rewrites the history, so the next step pays full price once.
- Editing the instruction file mid-session changes the start of the prompt, if the harness reloads it.

On an [API key](./api-key.md) the cache shows up directly on the bill. On a [subscription plan](./subscription-plan.md) there is no bill to read, but a thread that keeps its cache still answers faster. The [plans explainer](/explain/plans-and-api/) compares the two ways of paying.

> [!technical] What gets cached, in what order
> A request is assembled in a fixed order: the tool definitions, then the system prompt (the harness's instructions plus your instruction file), then the conversation from the first message on. The cache works on the longest matching prefix of that sequence, so the parts that change least should come first, and they do.
>
> Some practical consequences:
>
> - Adding or removing an [MCP](./mcp.md) server changes the tool definitions at the very start. Every request after that is a cache miss until a new prefix has been written.
> - Writing to the cache can cost a little more than a normal read, and an entry expires if it goes unused for a while. A thread you return to after a long break pays to rebuild its cache on the first step.
> - A [subagent](./subagent.md) starts with a fresh context, so it builds its own cache. That is part of why subagents are cheap for the main thread and not free overall.
>
> The exact prices, expiry times and minimum cacheable lengths differ by provider and model, and change. They live in the data on the [models page](/models/).

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
