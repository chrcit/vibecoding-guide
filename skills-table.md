# Skills Reference

## What Is a Skill?

A skill is a folder containing a `SKILL.md` file: YAML frontmatter with a `name` and a `description`, then instructions in Markdown. The folder can also hold scripts, templates or reference files the instructions point to. The format is an open standard ([agentskills.io](https://agentskills.io/)), so the same skill works in Claude Code, Codex and most other agents, including everything you run through [T3 Code](./guides/t3-code.md).

How an agent uses one:

- **Explicitly:** `/name` in Claude Code, `$name` in Codex.
- **Implicitly:** the agent sees the `name` and `description` of every installed skill and loads the full instructions when a task matches. The `description` is the trigger, so write it as "use when..." with the words a user would actually say.

Only the descriptions sit in context all the time, so installed skills cost little until they are used.

You do not need a skill for everything. A prompt you paste now and then can stay in your clipboard history. Turn it into a skill when you want it in every project, or want the agent to reach for it without being asked.

## Where Skills Live

| Agent | Project | Everywhere |
|-------|---------|-----------|
| **Claude Code** | `.claude/skills/<name>/SKILL.md` | `~/.claude/skills/<name>/SKILL.md` |
| **Codex** | `.agents/skills/<name>/SKILL.md` in the project or any parent folder | `~/.agents/skills/<name>/SKILL.md` |
| **T3 Code** | Uses the folders of the agent each thread runs | |

Sources: [Claude Code skills](https://code.claude.com/docs/en/skills), [Codex skills](https://learn.chatgpt.com/docs/build-skills). After adding or changing a skill, start a new agent session so it is picked up.

## Installing Skills

The [`skills` CLI](https://github.com/vercel-labs/skills) installs a skill from a GitHub repository into the right folder for most agents:

```bash
npx skills add owner/repo
```

Claude Code can also install skills that come bundled in plugins, through its `/plugin` command. Or tell the agent: "Install this skill: [link]." That works on any machine the agent runs on.

Read a skill before you install it. It is instructions your agent will follow, and it may include scripts.

## Recommended External Skills

| Skill | What it does | Source |
|-------|--------------|--------|
| **Humanizer** | Rewrites AI-sounding text so it reads like a person wrote it, based on Wikipedia's "Signs of AI writing". | [blader/humanizer](https://github.com/blader/humanizer) (MIT): `npx skills add blader/humanizer` |
| **Grill Me** | The agent questions you until it understands what you want. Ask for the questions as a clickable multiple-choice page to answer quickly. Its sibling `grilling` is the same interview routine, which the agent can reach for on its own. | Both in Matt Pocock's [mattpocock/skills](https://github.com/mattpocock/skills) (MIT): `npx skills add mattpocock/skills` |
| **Be Ambitious** | Reframes a task at a higher level: the goal beyond the goal (altitude), what a top expert would do (depth), what other fields would bring (range). | The original is Felix Rieseberg's [article](https://felixrieseberg.com/how-to-be-more-ambitious-a-tutorial-for-humans-with-models/), which gives a prompt to use. [robonuggets/be-ambitious](https://github.com/robonuggets/be-ambitious) (MIT) turns it into a skill. |

Combine the last two: Be Ambitious widens the problem, Grill Me narrows it to what you actually want.

## A Prompt Worth Keeping

Agents love decorative layout: a tiny uppercase label above every headline, a tagline under every title, helper text everywhere. It looks designed and reads as noise. This one-liner cleans it up:

```
Cut taglines, helper text, and secondary labels. If a screen needs them to make sense, fix the layout instead.
```

## Write One in Five Minutes

The prompt above as a skill. Save it as `.claude/skills/cut-decoration/SKILL.md` (Claude Code) or `.agents/skills/cut-decoration/SKILL.md` (Codex):

```markdown
---
name: cut-decoration
description: Use when polishing or reviewing a UI, or when the user says a page feels cluttered, busy or over-designed. Removes decorative eyebrow labels, taglines and helper text.
---

# Cut decoration

Remove taglines, helper text, eyebrow labels and other secondary labels from the screens in scope.

If a screen stops making sense without them, the layout is the problem. Fix it with hierarchy,
grouping and spacing instead of putting the text back.

Keep text that carries information the user needs to act: form validation, units, error messages,
empty states.

When done, list what you removed and any screen where you changed the layout instead.
```

Then try both ways: `/cut-decoration` explicitly, and "this settings page feels busy" to see whether the description triggers it. If it does not trigger when it should, the description is too vague.

The easiest route is still to ask: "I keep asking you to do X. Write a skill for it, put it in the project's skills folder, and make the description trigger on the way I usually phrase it."

## Skills in This Repository

These are older-style system prompts aimed at web builders like v0 and Lovable. They still work as skills in agentic tools.

| Skill | File | When to Use |
|-------|------|-------------|
| **Base** | [vibe-coder-base.md](./skills/vibe-coder-base.md) | Foundation for people new to code |
| **UI Builder** | [ui-builder.md](./skills/ui-builder.md) | Design, layout, and interaction polish |
| **Project Audit** | [project-audit.md](./skills/project-audit.md) | Pre-launch security and quality checks |
| **Web Fundamentals** | [web-fundamentals.md](./skills/web-fundamentals.md) | Learn while you build |

### Skill Details (Short)

**Base Prompt**
- Clear, layered explanations
- Best practices by default
- Warns about security and accessibility
- Explains external tool steps (Vercel, Supabase, etc.)

**UI Builder**
- Typography, color, spacing, layout
- Interaction and motion guidance
- Accessibility basics baked in

**Project Audit**
- Security (secrets, auth, input validation)
- Accessibility (labels, contrast, keyboard)
- Code quality (unused code, errors)
- Clear report and action items

**Web Fundamentals**
- Core web concepts as they appear
- State, data flow, requests
- Common patterns (forms, auth, fetching)

## Where Instructions Go

| Tool | Skills | Standing project context |
|------|--------|--------------------------|
| **Claude Code** | `.claude/skills/` or `~/.claude/skills/` | `CLAUDE.md` (reads `AGENTS.md` only if there is no `CLAUDE.md`) |
| **Codex** | `.agents/skills/` or `~/.agents/skills/` | `AGENTS.md` |
| **T3 Code** | The folders of the agent each thread runs | Whatever that agent reads |
| **v0** | No persistent system prompt; paste per chat | |
| **Lovable** | Paste into the initial project prompt | |
| **Claude web** | | Projects → Project Instructions |

For web builders, stack prompts in this order:

```
[1. Base prompt]
[2. Specialized skill(s)]
[3. Your project context + current task]
```

## Skill Template

```markdown
---
name: my-skill
description: Use when [the situation, in the words a user would say]. [What it does in one line.]
---

# [Skill Name]

You are helping with [specific task]. The person you're helping [context].

## What to Do
[Specific instructions]

## What to Avoid
[Anti-patterns]

## Output Format
[How to structure results]
```
