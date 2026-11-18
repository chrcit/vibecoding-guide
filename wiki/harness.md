---
title: "Harness"
summary: "The harness is the program that turns a model into an agent: it gives the model tools, runs them, and feeds the results back."
cluster: basics
updated: 2026-11-18
aliases: ["agent CLI", "Claude Code", "Codex"]
---

<!--
Sources: guides/t3-code.md "Harness vs. ADE", "Where It Hits Walls"; guides/agentic-coding.md "What Agents Can Do".
-->

# Harness

The harness is the program that turns a model into an agent: it gives the model tools, runs them, and feeds the results back.

A [model](./model.md) on its own only reads text and writes text. It cannot open a file, run your tests or look at a web page. The harness is the part that can. It tells the model which tools exist, and when the model asks for one (a [tool call](./tool-call.md)), the harness carries it out on your machine and hands the result back. Then the model decides what to do next. That back and forth is [the loop](./agent-loop.md), and the harness is what runs it.

Claude Code and Codex are harnesses. So are Cursor's agent and OpenCode. Two harnesses running the same model can behave quite differently, because the harness decides most of what the model experiences: which tools it has, what goes into its [context window](./context-window.md), what it is allowed to do without asking ([permission mode](./permission-mode.md)), and what happens when the conversation gets too long ([compaction](./compaction.md)).

[Theo](https://www.youtube.com/watch?v=ebILGCoN4UU) puts it as a kitchen: the model is the chef, the harness is the kitchen. A good chef in a kitchen with no knives gets little done.

When you ask the agent to fix the holiday hours on the bakery's site, the model works out what to read and what to change. The harness opens the files, applies the edit, runs the tests and shows you what changed.

The harness also loads what makes an agent yours: the project's [instruction file](./instruction-file.md), your [skills](./skill.md), and [MCP](./mcp.md) servers that connect it to other tools. Some harnesses can start [subagents](./subagent.md) for parts of a task.

An [agentic development environment](./agentic-development-environment.md) such as T3 Code sits one layer up. It drives the harnesses installed on your machine and shows their work side by side; it does not replace them. If a harness cannot do something, the layer above it cannot make it possible.

> [!technical] What the harness decides
> Most of the difference between two agents on the same model comes from here:
>
> - The tools: which ones exist (read, edit, shell, search, browser, web fetch) and how their results are trimmed before the model sees them.
> - The system prompt: the harness writes instructions the model reads before your first message, and adds your instruction file to them.
> - Context management: what is kept, what is summarised, and when a long tool result is cut.
> - Safety: which actions need your approval and whether commands run inside a sandbox.
>
> Which harness supports which model, and what each one costs to use, changes often. The current picture is on the [T3 Code](/t3-code/) page and in the [connectors explainer](/explain/connectors/).

> [!engineer] A harness is a loop around an API call
> Stripped down, a harness is a loop: send the conversation and the tool definitions to the model's API, read the reply, and if it contains tool calls, execute them, append the results and call again. Stop when the reply has no tool calls.
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
> Everything that makes a real harness good is what this sketch leaves out: deciding when to stop a loop that is going nowhere, keeping the history within the context window without losing the important parts, keeping the stable start of the history unchanged so [prompt caching](./prompt-caching.md) works, running independent tool calls in parallel, and refusing the call that would delete your home directory.
