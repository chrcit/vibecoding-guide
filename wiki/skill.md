---
title: "Skill"
summary: "A skill is a folder of written know-how, a SKILL.md and anything it needs, that the agent reads only when a job matches its description."
cluster: context
updated: 2026-11-19
aliases: ["skills", "SKILL.md", "agent skill"]
---

<!--
Sources to draw on:
- skills-table.md: "What Is a Skill?", "Where Skills Live", "Installing Skills", "Write One in Five Minutes", "Recommended External Skills"
- guides/t3-code.md: "Skills and provider updates"
-->

# Skill

A skill is a folder of written know-how, a SKILL.md and anything it needs, that the agent reads only when a job matches its description.

In the picture, skills stand on a shelf beside the project ([chapter 4](/journey/memory/)). Only each skill's name and one-line description sit in the [window](./context-window.md); the rest is read when a job calls for it. [AGENTS.md](./instruction-file.md), by contrast, is loaded whole every session.

Use one for know-how that only some jobs need: how you write release notes, how to check a page for accessibility, the steps of a deploy. The description decides when it loads, so write it as "Use when…". After a job you will do again, ask:

```text
Turn what we just did into a skill: a SKILL.md whose description says
when to use it, then the steps we followed and the checks at the end.
```

Read someone else's skill before you install it. It is instructions your agent will follow, and a bad one can tell it to do harm ([prompt injection](./prompt-injection.md)). Where each [harness](./harness.md) looks for skills is in the [skills explainer](/explain/skills/).

> [!technical] The shape of a SKILL.md
> ```markdown
> ---
> name: release-notes
> description: Use when writing release notes or a changelog entry for this project.
> ---
>
> 1. Read the commits since the last tag.
> 2. Group them as added, changed and fixed; leave out internal work.
> 3. Write one line each, in the words a user would use.
> ```
>
> Scripts or templates the steps need go in the same folder, and the steps refer to them by name.
