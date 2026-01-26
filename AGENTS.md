# Vibe Coding Guide

## Project Overview

System prompts, skills, and guides for non-developers learning to build web apps with AI tools. Target: digital natives using v0, Lovable, Codex, and similar tools.

## Repository Structure

```
/
├── README.md              # Dashboard linking to all content
├── skills/                # System prompts for AI assistants
│   ├── vibe-coder-base.md
│   ├── ui-builder.md
│   ├── project-audit.md
│   └── web-fundamentals.md
├── skills-table.md        # Skills quick reference
└── guides/                # Educational content
    ├── web-concepts.md
    ├── fullstack-apps.md
    ├── authentication.md
    ├── version-control.md
    ├── cloud-infrastructure.md
    ├── vibe-coding-web.md
    ├── agentic-coding.md
    └── agentic-coding-web.md
```

## Content Guidelines

**Audience:** Non-developers, digital natives, vibe coders using AI tools

**Style:**
- Plain language, minimal jargon
- Explain technical terms when used
- Use analogies sparingly and clearly
- Actionable and practical

**Priorities:**
- P0: Accuracy of tool capabilities and security info
- P1: Clarity for non-developers
- P2: Broad coverage without bloat

## Key External References

Maintain links to:
- https://github.com/automata/aicodeguide
- https://addyo.substack.com/p/the-70-problem-hard-truths-about
- https://simonwillison.net/2025/Mar/11/using-llms-for-code/
- https://www.anthropic.com/engineering/claude-code-best-practices

## Tool Documentation Sources

Verify claims against:
- v0: https://v0.app/docs/
- Lovable: https://docs.lovable.dev/
- Codex: https://developers.openai.com/codex/

## When Making Changes

1. Keep tone consistent with existing content
2. Link related guides at the end of each guide
3. Update README.md when adding or removing content
4. Verify tool capabilities against official docs
5. Use TypeScript in code examples
6. Assume Next.js + Tailwind + Supabase stack
