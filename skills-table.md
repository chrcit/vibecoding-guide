# Skills Reference

## What Is a Skill?

A skill is a Markdown file with instructions for your agent. That's it. It can describe a persona, a checklist, a workflow, or a set of commands.

Modern agents (Claude Code, Codex, and everything you run through [T3 Code](./guides/t3-code.md)) load skills on demand:

- **Install:** Put the skill in your agent's skills folder, usually as a `SKILL.md` inside a folder named after the skill. Or just tell the agent: "Install this skill: [link]."
- **Use:** Call it by name (`/humanizer` in Claude Code, `$humanizer` in Codex), or describe the task and let the agent pick the right skill itself.
- **Share:** Skills are plain text, so they live happily in a GitHub repo.

You don't need a skill for everything. A prompt you paste often can stay in your clipboard history. Turn it into a skill once you want it everywhere, or want the agent to reach for it on its own.

## Recommended External Skills

| Skill | What it does |
|-------|--------------|
| **Humanizer** | Rewrites AI-sounding text so it reads like a person wrote it. It explains why AI text sounds the way it does and which voice to use instead. |
| **Be Ambitious** | Reframes a task at a higher level: the goal beyond the goal, what a top expert would do, what other fields would bring. Use it before you start something big. |
| **Grill Me** | The agent asks you questions until it really understands what you want. Ask it to put the questions in an interactive multiple-choice page so you can answer quickly. |

Combine the last two: **Be Ambitious** widens the problem, **Grill Me** narrows it down to what you actually want.

## A Prompt Worth Keeping

Agents love decorative layout: a tiny uppercase label above every headline, a tagline under every title, helper text everywhere. It looks designed and reads as noise. This one-liner cleans it up:

```
Cut taglines, helper text, and secondary labels. If a screen needs them to make sense, fix the layout instead.
```

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

| Tool | Where to put skills or standing instructions |
|------|---------------------------------------------|
| **Claude Code** | `.claude/skills/<name>/SKILL.md` (project) or `~/.claude/skills/` (everywhere); project context in `CLAUDE.md` |
| **Codex** | Skills folder per the [Codex docs](https://developers.openai.com/codex/); project context in `AGENTS.md` |
| **T3 Code** | Uses the skills of the agents it runs; ask the agent to install a skill on every machine you use |
| **v0** | No persistent system prompt; paste per chat |
| **Lovable** | Paste into the initial project prompt |
| **Claude web** | Projects → Project Instructions |

For web builders, stack prompts in this order:

```
[1. Base prompt]
[2. Specialized skill(s)]
[3. Your project context + current task]
```

## Create Your Own Skill

Easiest way: tell your agent what you keep repeating and ask it to write the skill. Or start from this template:

```markdown
---
name: my-skill
description: One line saying when the agent should use this skill.
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
