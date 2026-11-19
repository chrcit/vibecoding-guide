---
title: "Agent"
summary: "An agent is a model with tools, working in a loop: it reads files, runs commands and looks at the results until the job is done."
cluster: basics
updated: 2026-11-19
aliases: ["coding agent", "AI agent", "agentic coding", "the agent"]
---

<!--
Sources to draw on:
- guides/agentic-coding.md: "What Is Agentic Coding?", "What Agents Can Do", "The Mindset Shift"
- guides/ways-of-working.md: "What Changed"
-->

# Agent

An agent is a model with tools, working in a loop: it reads files, runs commands and looks at the results until the job is done.

A chat model answers once and stops. An agent keeps going: you send one message and it takes many turns of its own. Each turn the [model](./model.md) picks a [tool](./tool-call.md), the result lands in its [window](./context-window.md), and it decides what to do next. That is [the loop](./agent-loop.md); the program that runs it is the [harness](./harness.md). Claude Code and Codex are agents in this sense, and [web builders](./web-builders.md) run one in a browser tab. You can watch it happen in [chapter 2](/journey/loop/).

Because it can act, give it a job with an end it can check:

```text
The bakery site shows normal opening hours on public holidays. Find out why, fix it, add a test for Easter Monday and run the tests. Tell me what you changed and what you could not check.
```

Then read what it [checked](./verification.md). How sure it sounds tells you nothing.
