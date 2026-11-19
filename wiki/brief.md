---
title: "Brief"
summary: "A brief is the message that starts a helper: what to do, what to leave alone, and what to send back; it is all the helper knows."
cluster: teams
updated: 2026-11-19
aliases: ["handoff note", "task description", "delegation prompt"]
---

# Brief

A brief is the message that starts a helper: what to do, what to leave alone, and what to send back; it is all the helper knows.

A [helper](./subagent.md) starts with an empty [window](./context-window.md). It has not seen your conversation, your decisions or the files the lead already read. Whatever is missing from the brief, it guesses. In the picture the brief is the pale puck that travels from the lead to the helper, and the report is the blue one that comes back.

A good brief has four parts: the task, where to look, what not to touch, and the shape of the report. Ask for a short report: the lead's window fills with whatever comes back.

```text
Find every place the club list formats a date. Look in src/ only. Change nothing. Report: a list of file and line, one line each, and anything that looks wrong, in under fifteen lines.
```

When a helper comes back with the wrong thing, read the brief before you blame the helper. A thin brief gets a confident answer to a different question.

> [!technical] Briefs the lead writes
> When a [lead](./orchestration.md) hands out work, it writes the briefs. Put the rule in the instruction file: "Every brief names the files, the done condition, what not to change and the report format." Give each helper its own copy of the project ([worktree](./worktree.md)) when it edits, and ask for the report to say what it could not check.
