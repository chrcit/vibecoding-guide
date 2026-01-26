# Vibe Coding Guide

## Project Overview

System prompts, skills, and guides for non-developers learning to build web apps with AI tools. Target: digital natives comfortable with web tools (Notion, Figma) exploring v0, Lovable, Bolt, and agentic tools like Codex.

## Repository Structure

```
/
├── README.md
├── CLAUDE.md
├── AGENTS.md
├── skills/
│   ├── vibe-coder-base.md
│   ├── ui-builder.md
│   ├── project-audit.md
│   └── web-fundamentals.md
├── skills-table.md
└── guides/
    ├── web-concepts.md
    ├── fullstack-apps.md
    ├── authentication.md
    ├── version-control.md
    ├── cloud-infrastructure.md
    ├── vibe-coding-web.md
    ├── agentic-coding.md
    └── agentic-coding-web.md
```

## Content Philosophy

**Audience:** Non-developers with digital/web literacy using AI tools

**Writing style:** Plain language, explain terms, practical steps, light analogies

**Key themes:**
1. The 70% problem
2. AI as an overconfident intern
3. Small steps, frequent testing
4. Security and accessibility are non-negotiable
5. Export from web tools when you hit limits

## Key References

**External resources:**
- https://github.com/automata/aicodeguide
- https://addyo.substack.com/p/the-70-problem-hard-truths-about
- https://simonwillison.net/2025/Mar/11/using-llms-for-code/
- https://www.anthropic.com/engineering/claude-code-best-practices

**Tool docs:**
- https://v0.app/docs/
- https://docs.lovable.dev/
- https://developers.openai.com/codex/

## When Working on This Project

- Keep tone and structure consistent
- Link related guides at the end of each guide
- Update README.md if adding/removing files
- Verify tool claims against official docs
- Use TypeScript in code examples
- Assume Next.js + Tailwind + Supabase stack
