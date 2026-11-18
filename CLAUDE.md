# Agentic Coding Guide

## Project Overview

Guides and skills for people learning to build software by directing AI agents. Formerly *Vibe Coding 101*. The core of the guide is the agentic workflow in T3 Code (multi-provider ADE) with Claude Code and Codex underneath; web builders (v0, Lovable) remain as an on-ramp.

## Audience

- Newcomers with digital literacy (Notion, Figma level) who want to build real things
- Experienced engineers and scientists who know software but haven't kept up with agents

## Repository Structure

```
/
├── README.md              # Dashboard linking to all content
├── CLAUDE.md / AGENTS.md  # Context for agents working on this repo
├── skills-table.md        # What skills are, recommended skills, repo skills
├── skills/                # Prompts usable as skills
│   ├── vibe-coder-base.md
│   ├── ui-builder.md
│   ├── project-audit.md
│   └── web-fundamentals.md
└── guides/
    ├── ways-of-working.md     # Core habits: context, never wait, self-verification, orchestration
    ├── t3-code.md             # T3 Code capabilities and limits
    ├── models-and-costs.md    # Model landscape, thinking levels, plans, hardware (dated snapshot)
    ├── agentic-coding.md      # Agent loop, context files, prompts, review
    ├── agentic-coding-web.md  # Codex and Claude web/cloud agents
    ├── vibe-coding-web.md     # v0, Lovable, Bolt, Replit
    ├── web-concepts.md
    ├── fullstack-apps.md
    ├── authentication.md
    ├── version-control.md
    ├── cloud-infrastructure.md
    └── web-rules.md
```

## Content Guidelines

**Style:**
- Plain language; explain terms when first used
- Practical and actionable; short sections
- Write like a person: no hype, no filler, no stock AI phrasing

**Key themes:**
1. Context is capability
2. Self-verification is the goal; the human's job is verifying
3. Never wait: parallel threads, queue information while agents run
4. Be ambitious: the first result is a starting point
5. Security, privacy and accessibility are non-negotiable

**Priorities:**
- P0: Accuracy of tool, model and pricing claims; security and privacy info
- P1: Clarity for newcomers
- P2: Broad coverage without bloat

## When Making Changes

1. Keep tone consistent with existing content
2. Link related guides at the end of each guide
3. Update README.md when adding or removing content
4. Verify tool claims against official docs (t3.codes, Claude Code docs, Codex docs, v0, Lovable)
5. Date time-sensitive facts (model names, prices, limits) and keep them in `models-and-costs.md`
6. Never include private details from source material (names, employers, clients, research data)
7. Use TypeScript in code examples
