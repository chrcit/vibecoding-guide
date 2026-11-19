---
title: "Tool call"
summary: "A tool call is the model asking for an action, such as reading a file or running a command; the harness carries it out and puts the result in the window."
cluster: basics
updated: 2026-11-19
aliases: ["tools", "tool use", "function calling"]
---

<!--
Sources to draw on:
- guides/agentic-coding.md: "What Agents Can Do"
-->

# Tool call

A tool call is the model asking for an action, such as reading a file or running a command; the harness carries it out and puts the result in the window.

The model can only write text. Tools turn that text into actions: read, edit, run, search ([Loop, lesson 6](/journey/loop/)). The [harness](./harness.md) runs each call, the result goes into the [window](./context-window.md), and the model picks the next step. That back and forth is [the loop](./agent-loop.md). Every result takes room, so a long log costs as much as a long file.

Two things are yours to set:

- What runs without asking. That is the [permission mode](./permission-mode.md): reading is safe to allow, while commands and anything that reaches outside the project deserve a look.
- The tool it needs to check its work. Take away the one that runs the tests and it still says "fixed".

More tools come from [MCP](./mcp.md) servers and [connectors](./connector.md); the [connectors explainer](/explain/connectors/) shows what they reach. Before a big job, ask:

```text
Which tools will you use for this, and which of them need my permission?
```

> [!engineer] What a tool looks like to the model
> A tool is a name, a description the model reads to decide when to use it, and a schema for its input. The model replies with a call; the harness runs it and appends the result.
>
> ```json
> { "name": "run_tests", "description": "Run the test suite. Use after every change.", "input_schema": { "type": "object", "properties": { "filter": { "type": "string" } } } }
> ```
>
> The description does most of the work. A vague one gets the tool used at the wrong time or not at all.
