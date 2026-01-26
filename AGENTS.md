# Vibe Coding Guide

## Project Overview

This repository provides system prompts, skills, and guides for non-developers learning to build web apps with AI tools. Target audience: digital natives exploring vibe coding through v0, Lovable, Codex, and similar tools.

## Repository Structure

```
/
├── README.md              # Dashboard linking to all content
├── skills/                # System prompts for AI assistants
│   ├── vibe-coder-base.md    # Foundation prompt
│   ├── ui-builder.md         # Design focus
│   ├── project-audit.md      # Security review
│   └── web-fundamentals.md   # Learning explanations
├── skills-table.md        # Skills quick reference
└── guides/                # Educational content
    ├── web-concepts.md       # How the web works
    ├── fullstack-apps.md     # Server, client, database
    ├── authentication.md     # Auth patterns
    ├── version-control.md    # Git and GitHub
    ├── cloud-infrastructure.md # Deployment
    ├── vibe-coding-web.md    # v0, Lovable, Bolt
    ├── agentic-coding.md     # Agent concepts
    └── agentic-coding-web.md # Codex, Claude web
```

## Content Guidelines

**Audience:** Non-developers, digital natives, vibe coders using AI tools

**Style:**
- Plain language, avoid jargon
- Explain technical terms
- Use analogies
- Be practical and actionable

**Priorities:**
- P0: Accuracy of tool capabilities and security information
- P1: Clarity and accessibility for non-developers
- P2: Comprehensive coverage of topics

## Key External References

Maintain links to these resources:
- https://github.com/automata/aicodeguide - AI Code Guide
- https://addyo.substack.com/p/the-70-problem-hard-truths-about - 70% Problem
- https://simonwillison.net/2025/Mar/11/using-llms-for-code/ - LLMs for Code
- https://www.anthropic.com/engineering/claude-code-best-practices - Claude Best Practices

## Tool Documentation Sources

Verify claims against:
- v0: https://v0.app/docs/
- Lovable: https://docs.lovable.dev/
- Codex: https://developers.openai.com/codex/

## When Making Changes

1. Keep consistent tone with existing content
2. Link related guides at end of each file
3. Update README.md when adding new content
4. Verify tool capabilities against official docs
5. Use TypeScript in code examples
6. Assume Next.js + Tailwind + Supabase stack
