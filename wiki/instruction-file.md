---
title: "Instruction file"
summary: "An instruction file such as AGENTS.md is a plain file in your project that the harness loads into the window before your first word, every session."
cluster: context
updated: 2026-11-19
aliases: ["AGENTS.md", "CLAUDE.md", "context file", "memory file", "rules file"]
---

<!--
Sources to draw on:
- guides/agentic-coding.md: "Context Files", "Rules and Conventions", "Set Boundaries"
- guides/ways-of-working.md: "From a Session to a Project"
- skills-table.md: "Where Instructions Go"
-->

# Instruction file

An instruction file such as AGENTS.md is a plain file in your project that the harness loads into the window before your first word, every session.

The [window](./context-window.md) does not outlive the session; a file does ([the memory lesson](/journey/memory/)). AGENTS.md is the shared name, and Claude Code reads CLAUDE.md. It survives [compaction](./compaction.md) and every new [thread](./thread.md).

Keep it short and true: how to install, run and test the project, what [done](./definition-of-done.md) means, rules the code does not show, and what not to touch. A wrong line is worse than none, because the agent follows it every time. Know-how only some jobs need goes in a [skill](./skill.md).

Grow it from mistakes. When the agent gets something wrong, have it write the rule down:

```text
That was wrong: we never edit the files in dist/, they are generated. Add a one-line rule to AGENTS.md so it does not happen again, and show me the change.
```

> [!technical] Files and places
> - The file sits at the root of the project. A file in a subfolder adds rules for that folder in most harnesses.
> - Both names in one project: put the rules in AGENTS.md and make CLAUDE.md a single line, `@AGENTS.md`, which Claude Code reads as an import.
> - Rules for every project go in your home folder: `~/.claude/CLAUDE.md` for Claude Code, `~/.codex/AGENTS.md` for Codex.
> - At the end of a session, ask: "What did you learn about this project today that AGENTS.md does not say? Suggest lines to add, and lines that are now wrong."
