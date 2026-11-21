---
title: "Subagent"
summary: "A subagent is a helper the agent starts for one piece of the job: it begins with an empty window, gets a brief, and sends back a short report."
cluster: teams
updated: 2026-11-19
aliases: ["helper", "helper agent", "sub-agent"]
---

<!--
Sources to draw on:
- guides/agentic-coding.md: "What Agents Can Do"
- lead notes: Claude Code and Codex subagents
-->

# Subagent

A subagent is a helper the agent starts for one piece of the job: it begins with an empty window, gets a brief, and sends back a short report.

Searching fills a [window](./context-window.md) with files that turn out not to matter ([the handoff lesson](/journey/handoff/)). Hand the search to a helper and only its report comes back. The helper's window is thrown away, and the [agent](./agent.md)'s stays clear for the work.

The helper knows only the brief. Anything you told the agent, such as "change nothing", has to be written into it. So when you ask for a helper, say what goes in the brief:

```text
Use a subagent to find every place the opening hours are read. Brief it: read only, change nothing, and report each place as file and line, in under 200 words.
```

Helpers suit searching, reviewing and anything that reads a lot to say a little. Helpers that change files need their own [worktree](./worktree.md), and several building at once is [orchestration](./orchestration.md). Each one counts against your [usage window](./usage-window.md).

> [!technical] Your own helpers
> In Claude Code a helper can be a file in `.claude/agents/`: a name, a description that says when to use it, the tools it may use, and its standing brief. Which harness supports what is in the [orchestration explainer](/explain/orchestration/).
