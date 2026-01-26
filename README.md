# Vibe Coding 101

> Build web apps by describing what you want. No coding experience required.

**Vibe coding** = you describe the product, AI writes the code. You focus on *what* to build, AI helps with *how*.

This guide takes you from idea to shipped app with tools like [v0](https://v0.app), [Lovable](https://lovable.dev), and [Codex](https://chatgpt.com/codex).

---

## Quick Start

1. **Pick a tool:** v0 (full-stack Next.js apps + UI) or Lovable (full apps)
2. **Use the [base prompt](./skills/vibe-coder-base.md)** in your AI tool
3. **Build one feature at a time** and test after each change
4. **Export to GitHub** when you need more control

---

## Guides

### Getting Started
| Guide | What You Learn |
|-------|----------------|
| [Web Concepts](./guides/web-concepts.md) | How the web works, frontend vs backend, URLs, APIs |
| [Full-Stack Apps](./guides/fullstack-apps.md) | Server + client + database and how they connect |
| [Authentication](./guides/authentication.md) | Login, permissions, and keeping users safe |

### Building
| Guide | What You Learn |
|-------|----------------|
| [Vibe Coding (Web Builders)](./guides/vibe-coding-web.md) | v0, Lovable, Bolt, Replit workflows |
| [Agentic Coding](./guides/agentic-coding.md) | How AI agents work with your code |
| [Codex & Claude Web](./guides/agentic-coding-web.md) | Using Codex and Claude via web UIs |

### Shipping
| Guide | What You Learn |
|-------|----------------|
| [GitHub & Version Control](./guides/version-control.md) | Save work, undo mistakes, collaborate |
| [Cloud Infrastructure](./guides/cloud-infrastructure.md) | Deploying, domains, DNS |
| [Web Rules](./guides/web-rules.md) | Security, accessibility, performance checklists |

---

## Skills (System Prompts)

Copy these into your AI tool to shape how it helps you.

| Skill | When to Use |
|-------|-------------|
| [Base](./skills/vibe-coder-base.md) | Always — foundation for all interactions |
| [UI Builder](./skills/ui-builder.md) | Design and interface polish |
| [Project Audit](./skills/project-audit.md) | Pre-launch security and quality checks |
| [Web Fundamentals](./skills/web-fundamentals.md) | Learn while you build |

**Stacking order:** Base first, then specialized skills, then your project context.

→ [Full skills reference](./skills-table.md)

---

## The Essentials

**The 70% problem:** AI gets you most of the way fast. The last 30% (edge cases, security, polish) is the hard part.

**AI = overconfident intern:** Fast and helpful, but needs supervision and clear direction.

**Golden rules:**
- Plan before prompting
- Small steps + frequent tests
- Never ship secrets

---

## External Resources

### Essential Reading
- [AI Code Guide](https://github.com/automata/aicodeguide)
- [The 70% Problem](https://addyo.substack.com/p/the-70-problem-hard-truths-about)
- [Using LLMs for Code](https://simonwillison.net/2025/Mar/11/using-llms-for-code/)
- [Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)

### Tool Documentation
- [v0 Docs](https://v0.app/docs/)
- [Lovable Docs](https://docs.lovable.dev/)
- [Codex Developer Guide](https://developers.openai.com/codex/)

### Courses
- [Vibe Coding 101 with Replit](https://www.deeplearning.ai/short-courses/vibe-coding-101-with-replit/)
- [Intro to Vibe Coding](https://www.codecademy.com/learn/intro-to-vibe-coding)

---

## Repository Structure

```
├── README.md                    ← You are here
├── skills/                      ← System prompts
├── skills-table.md              ← Skills quick reference
├── guides/                      ← Educational content
├── CLAUDE.md                    ← Context for Claude-based tools
└── AGENTS.md                    ← Context for Codex/agents
```

---

## Contributing

Found an issue or have a suggestion? [Open an issue](https://github.com/chrcit/vibecoding-guide/issues).

## License

MIT — Use however you want.
