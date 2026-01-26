# Vibe Coding Guide

## Project Overview

This repository provides system prompts, skills, and guides for non-developers learning to build web apps with AI tools. The target audience is digital natives comfortable with web tools (Notion, Figma) who are exploring vibe coding through platforms like v0, Lovable, and agentic tools like Codex.

## Repository Structure

```
/
├── README.md              # Dashboard linking to all content
├── CLAUDE.md              # Context for Claude-based AI tools
├── AGENTS.md              # Context for Codex and other agents
│
├── skills/                # System prompts for AI assistants
│   ├── vibe-coder-base.md    # Foundation prompt (always include)
│   ├── ui-builder.md         # Design and UI focus
│   ├── project-audit.md      # Security and quality review
│   └── web-fundamentals.md   # Learning-focused explanations
│
├── skills-table.md        # Quick reference for all skills
│
└── guides/                # Educational content
    ├── web-concepts.md       # How the web works
    ├── fullstack-apps.md     # Server, client, database
    ├── authentication.md     # Auth and authorization
    ├── version-control.md    # Git and GitHub
    ├── cloud-infrastructure.md # Vercel, Railway, DNS
    ├── vibe-coding-web.md    # v0, Lovable, Bolt
    ├── agentic-coding.md     # General agent concepts
    └── agentic-coding-web.md # Codex, Claude web interface
```

## Content Philosophy

**Target Audience:**
- Non-developers with digital/web literacy
- People using v0, Lovable, Bolt, Replit
- Comfortable with GitHub, Vercel, Supabase at a basic level
- Want to build real products, not just demos

**Writing Style:**
- Plain language, minimal jargon
- Explain technical terms when used
- Use analogies to everyday concepts
- Actionable and practical
- Link between related guides

**Key Themes:**
1. The 70% problem (AI gets you most of the way, last 30% is hard)
2. AI as "overconfident intern" (fast but needs supervision)
3. Small steps, frequent testing
4. Security and accessibility are non-negotiable
5. Export from web tools when you hit limits

## Key References

**Essential External Resources:**
- [AI Code Guide](https://github.com/automata/aicodeguide) - Comprehensive AI coding guide by Vilson Vieira and Eric S. Raymond
- [The 70% Problem](https://addyo.substack.com/p/the-70-problem-hard-truths-about) - Addy Osmani on AI coding limitations
- [Using LLMs for Code](https://simonwillison.net/2025/Mar/11/using-llms-for-code/) - Simon Willison's practical tips
- [Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices) - Anthropic's official guidance

**Tool Documentation:**
- [v0 Docs](https://v0.app/docs/) - Official v0 documentation
- [Lovable Docs](https://docs.lovable.dev/) - Official Lovable documentation
- [Codex Guide](https://developers.openai.com/codex/) - OpenAI Codex documentation

## When Working on This Project

**Adding Content:**
- Keep the same tone and structure as existing guides
- Link to related guides at the end
- Update README.md if adding new files
- Verify tool claims against official documentation

**Updating Tool Information:**
- Check official docs before making claims
- Note version/date if features are new or experimental
- Be conservative about capabilities (under-promise)

**Code Examples:**
- Use TypeScript for examples
- Assume Next.js + Tailwind + Supabase stack
- Keep examples simple and focused
- Include error handling in realistic examples

## Conventions

- Use Markdown for all content
- Headers: `#` for title, `##` for main sections, `###` for subsections
- Code blocks: Always specify language (```typescript, ```bash, etc.)
- Tables: Use for comparisons and quick references
- Links: Use relative links for internal content, full URLs for external
