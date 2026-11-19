---
title: "Verification"
summary: "Verification is a check the work must pass before it reaches you, so the agent finds its own mistakes."
cluster: checking
updated: 2026-11-19
aliases: ["self-verification", "checking", "check", "gate"]
---

<!--
Sources to draw on:
- guides/ways-of-working.md: "Self-Verification Is the Goal", "The type checker, linter and build", "A reference answer", "Run it N times and compare"
- guides/agentic-coding.md: "The Review Loop", "Hard Tasks for Agents"
-->

# Verification

Verification is a check the work must pass before it reaches you, so the agent finds its own mistakes.

An agent says "done" whether or not it is ([the check lesson](/journey/check/)). A check turns that into evidence: a failing job goes back to the agent, and only what passes comes to you. Each check sees one kind of wrong, so use several:

- [Tests](./test.md) catch behaviour that differs from what you asked.
- Type check, lint and build catch code that does not fit together.
- A [browser](./browser-check.md) catches what the page really shows.
- A reference answer catches results that drift from a known good one.
- A second model reading the [diff](./diff.md) catches what the author missed.

Put the check in the request, so that done means passed ([definition of done](./definition-of-done.md)):

```text
Done means: the tests and the build pass, and you have opened the page at phone width and looked. Show me the output, not a summary of it.
```

Then [review](./review.md) what got through. [What checks cannot catch](./limits-of-checking.md) is still yours; the [verification explainer](/explain/verification/) goes further.

> [!technical] When the agent games the check
> Pushed to pass, an agent may skip a test, loosen an assertion or hard-code the expected answer ([agent shortcuts](./shortcuts.md)). Put this in AGENTS.md: "Never change or skip a test to make it pass. If a test is wrong, stop and say so." Look at changes to test files first when you review. Made-up cases that look like real ones ([synthetic data](./synthetic-data.md)) let a check cover what you have not met yet.
