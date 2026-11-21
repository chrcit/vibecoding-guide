# Agentic Coding Guide

## Project Overview

Guides and skills for people learning to build software by directing AI agents. Formerly *Vibe Coding 101*. The core of the guide is the agentic workflow in T3 Code (multi-provider ADE) with Claude Code and Codex underneath; web builders (v0, Lovable) remain as an on-ramp.

## Audience

- Primary: experienced engineers and scientists who know how software gets built but haven't kept up with agents. Skeptical and technical: they want precise claims, honest limits and mechanisms, not slogans.
- Still welcome: motivated newcomers with digital literacy (Notion, Figma level). The core guides should stay followable for them without explaining basics like Markdown or what a repository is.

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
├── site/                  # Astro site: visual essay (src/pages/index.astro + components) and
│                          #   reference pages rendered straight from guides/ and skills/
└── guides/
    ├── fact-check.md          # Sources and status for every number and tool claim (dated)
    ├── ways-of-working.md     # Core habits: context, never wait, self-verification, review, orchestration
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
- Plain language; explain agent-specific terms when first used, not general software basics
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
- P1: Clarity and precision for experts; still followable for newcomers
- P2: Broad coverage without bloat

## When Making Changes

1. Keep tone consistent with existing content
2. Link related guides at the end of each guide
3. Update README.md when adding or removing content
4. Verify tool claims against official docs (t3.codes, Claude Code docs, Codex docs, v0, Lovable)
5. Dated facts (model names, prices, limits, scores, tool features) live in `site/src/data/*.ts`, each with a source URL, the date it was verified and a status (`verified`, `observation` or `unverified`). Prose may restate them, but a change starts in the data file. See `UPDATE.md`
6. `guides/fact-check.md` is generated from the data: never edit it by hand, run `cd site && node scripts/check-facts.mjs --write`. Personal experience and estimates go in `observations.ts` with status `observation` and must be labelled as such in prose
7. Never include private details from source material (names, employers, clients, research data)
8. Use TypeScript in code examples
9. The site renders the markdown directly: keep relative `.md` links (they become site routes). When an essay figure states a fact, keep it in sync with the matching guide
10. Before committing site changes: `cd site && pnpm build && pnpm check-links` must pass
