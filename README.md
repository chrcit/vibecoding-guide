# Vibe Coding 101

> Build web apps by describing what you want. No coding experience required.

**Vibe coding** = Telling AI what you want and letting it write the code. You focus on *what* to build, AI handles *how*.

This guide helps you go from "I have an idea" to "I shipped an app" using tools like [v0](https://v0.dev), [Lovable](https://lovable.dev), and [Codex](https://chatgpt.com/codex).

---

## Quick Start

1. **Pick a tool:** [v0](https://v0.dev) (UI/components) or [Lovable](https://lovable.dev) (full apps)
2. **Use the [base prompt](./skills/vibe-coder-base.md):** Copy into your AI tool's instructions
3. **Start small:** Build one feature, test it, then add more
4. **Export when ready:** Move to GitHub for more control

---

## 📚 Guides

### Getting Started
| Guide | What You'll Learn |
|-------|-------------------|
| [Web Concepts](./guides/web-concepts.md) | How websites work, frontend vs backend, URLs, APIs |
| [Full-Stack Apps](./guides/fullstack-apps.md) | Server + client + database, how they connect |
| [Authentication](./guides/authentication.md) | Login systems, permissions, keeping users safe |

### Building
| Guide | What You'll Learn |
|-------|-------------------|
| [Vibe Coding (Web Builders)](./guides/vibe-coding-web.md) | Using v0, Lovable, Bolt to build by describing |
| [Agentic Coding](./guides/agentic-coding.md) | How AI agents work with your code |
| [Codex & Claude Web](./guides/agentic-coding-web.md) | Using Codex and Claude through web interfaces |

### Shipping
| Guide | What You'll Learn |
|-------|-------------------|
| [GitHub & Version Control](./guides/version-control.md) | Saving your code, undoing mistakes, collaboration |
| [Cloud Infrastructure](./guides/cloud-infrastructure.md) | Deploying to Vercel/Railway, domains, DNS |
| [Web Rules](./guides/web-rules.md) | Security, accessibility, performance checklists |

---

## 🛠 Skills (System Prompts)

Copy these into your AI tool to shape how it helps you.

| Skill | When to Use |
|-------|-------------|
| [**Base**](./skills/vibe-coder-base.md) | Always — foundation for all interactions |
| [UI Builder](./skills/ui-builder.md) | Building interfaces, improving design |
| [Project Audit](./skills/project-audit.md) | Before launch, checking for security issues |
| [Web Fundamentals](./skills/web-fundamentals.md) | When you want to learn while building |

**How to stack them:** Base first, then add specialized skills, then your project context.

→ [Full skills reference](./skills-table.md)

---

## ⚡ The Essentials

### The 70% Problem

AI gets you 70% of the way fast. The last 30%—edge cases, security, polish—is where you'll struggle. These guides exist to push that number higher.

### AI = Overconfident Intern

Think of AI as someone who:
- Works incredibly fast
- Knows a lot of documentation
- Will confidently do the wrong thing if you're vague
- Needs supervision on important work

### Golden Rules

1. **Plan before prompting** — Spend 20% of time on specs, save 80% on debugging
2. **Small steps** — One feature → test → commit → repeat
3. **Screenshots > descriptions** — Show the AI what you want
4. **Commit often** — Git is your save game
5. **Never ship secrets** — API keys never go in code files

---

## 🔗 External Resources

### Essential Reading
- [AI Code Guide](https://github.com/automata/aicodeguide) — Comprehensive guide by Vilson Vieira & Eric S. Raymond
- [The 70% Problem](https://addyo.substack.com/p/the-70-problem-hard-truths-about) — Why AI coding is harder than it looks
- [Using LLMs for Code](https://simonwillison.net/2025/Mar/11/using-llms-for-code/) — Practical tips from Simon Willison
- [Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices) — Official guidance (applies to all AI tools)

### Tool Documentation
- [v0 Docs](https://v0.app/docs/) — Official v0 documentation
- [Lovable Docs](https://docs.lovable.dev/) — Official Lovable documentation
- [Codex Developer Guide](https://developers.openai.com/codex/) — OpenAI Codex documentation

### Courses
- [Vibe Coding 101 with Replit](https://www.deeplearning.ai/short-courses/vibe-coding-101-with-replit/) — Free intro course
- [Intro to Vibe Coding](https://www.codecademy.com/learn/intro-to-vibe-coding) — Codecademy course

---

## 📁 Repository Structure

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

Found an issue? Have a suggestion? [Open an issue](https://github.com/chrcit/vibecoding-guide/issues).

## License

MIT — Use however you want.
