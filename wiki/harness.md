---
title: "Harness"
summary: "The harness is the program that turns a model into an agent: it gives the model tools, runs them, and feeds the results back."
cluster: basics
updated: 2026-11-19
aliases: ["agent CLI", "Claude Code", "Codex"]
---

<!--
Sources: guides/t3-code.md "Harness vs. ADE", "Where It Hits Walls"; guides/agentic-coding.md "What Agents Can Do".
-->

# Harness

The harness is the program that turns a model into an agent: it gives the model tools, runs them, and feeds the results back.

A [model](./model.md) only reads and writes text. The harness is the part that opens files, runs commands and shows you the change. Each time the model asks for a tool (a [tool call](./tool-call.md)), the harness runs it and hands back the result; that back and forth is [the loop](./agent-loop.md). Claude Code, Codex, Cursor's agent and OpenCode are harnesses.

The harness, more than the model, decides how an agent behaves: what it may do without asking ([permission mode](./permission-mode.md)), what goes into its [context window](./context-window.md), and what happens when the conversation gets too long ([compaction](./compaction.md)). It also loads what makes the agent yours: the project's [instruction file](./instruction-file.md), your [skills](./skill.md), [MCP](./mcp.md) servers, and [subagents](./subagent.md) where it has them.

To use one, install it, open it in your project folder and say what you want. Before the first real task, find out what it will do on its own:

```text
What tools do you have here, which of them run without asking me,
and which instruction files and skills have you loaded?
```

An [agentic development environment](./agentic-development-environment.md) such as T3 Code sits one layer up and drives the harnesses on your machine side by side. It cannot do what the harness underneath cannot. Which harness runs which model, and what it costs, is on the [T3 Code](/t3-code/) page and in the [connectors explainer](/explain/connectors/).

> [!technical] Settings worth knowing
> - The permission mode and the sandbox: set them before a long run, not during it.
> - The instruction file it reads, and whether it reloads it mid-session.
> - Which tools are on (shell, browser, web fetch) and how long tool output may get before it is cut.
> - When it compacts, and whether you can compact or clear by hand.
>
> If two harnesses on the same model give different results on the same task, the difference is usually here.

> [!engineer] A harness is a loop around an API call
> Stripped down: send the conversation and the tool definitions to the model's API, run any tool calls in the reply, append the results, call again, stop when the reply has none.
>
> ```ts
> type ToolCall = { id: string; name: string; input: unknown };
> type Reply = { text: string; toolCalls: ToolCall[] };
>
> async function run(task: string, callModel: (history: unknown[]) => Promise<Reply>, tools: Record<string, (input: unknown) => Promise<string>>) {
>   const history: unknown[] = [{ role: 'user', content: task }];
>   for (;;) {
>     const reply = await callModel(history);
>     history.push({ role: 'assistant', content: reply });
>     if (reply.toolCalls.length === 0) return reply.text;
>     for (const call of reply.toolCalls) {
>       const result = await tools[call.name](call.input); // permission checks and sandboxing go here
>       history.push({ role: 'tool', id: call.id, content: result });
>     }
>   }
> }
> ```
>
> What a real harness adds is in what this leaves out: stopping a loop that goes nowhere, keeping the history inside the window, keeping its start unchanged so [prompt caching](./prompt-caching.md) works, running independent calls in parallel, and refusing the call that would delete your home directory.
