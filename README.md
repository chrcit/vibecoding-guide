# Agentic Coding Guide

> Build real software by directing AI agents. For newcomers, and for experienced engineers and scientists who haven't kept up.

**Agentic coding** = you describe the outcome, give context, and check the result. AI agents plan, write, run and verify the code, often for an hour at a time and several in parallel.

**Read it as a visual essay** with interactive figures, plus the full reference: run the site in [`site/`](./site) (`pnpm install && pnpm dev`), or open the GitHub Pages deployment once it's enabled.

This guide started in early 2026 as *Vibe Coding 101*, built around web builders like v0 and Lovable. A lot changed over the summer: the best models now stay on track for hours, agents work in parallel, and tools like [T3 Code](https://t3.codes) let you run models from different providers side by side. This version is rewritten around that way of working. The web-builder material is still here as an on-ramp.

---

## Quick Start

1. **Get one AI subscription.** $20/month Claude or ChatGPT is enough to start. → [Models and Costs](./guides/models-and-costs.md)
2. **Install T3 Code** and sign in to Claude Code or Codex. → [T3 Code](./guides/t3-code.md)
3. **Talk to it.** Use voice. Tell it who you are and two problems you want solved this month.
4. **Give it a way to check itself,** then let it run. → [Ways of Working](./guides/ways-of-working.md)
5. **Block one hour this week.** That's enough to get comfortable.

---

## Guides

### Start Here
| Guide | What You Learn |
|-------|----------------|
| [Ways of Working](./guides/ways-of-working.md) | Voice, context, parallel work, self-verification, orchestration, ambition |
| [T3 Code](./guides/t3-code.md) | The agentic development environment: what it can do and where it hits walls |
| [Models and Costs](./guides/models-and-costs.md) | Which model for what, thinking levels, plans, hardware |
| [Skills](./skills-table.md) | Reusable instructions for your agents |

### Agentic Coding Basics
| Guide | What You Learn |
|-------|----------------|
| [Agentic Coding](./guides/agentic-coding.md) | The agent loop, context files, prompts, reviews |
| [Codex & Claude on the Web](./guides/agentic-coding-web.md) | Cloud agents that work on your GitHub repos |
| [Vibe Coding (Web Builders)](./guides/vibe-coding-web.md) | v0, Lovable, Bolt, Replit as a no-setup starting point |

### Web Foundations
| Guide | What You Learn |
|-------|----------------|
| [Web Concepts](./guides/web-concepts.md) | How the web works, frontend vs backend, URLs, APIs |
| [Full-Stack Apps](./guides/fullstack-apps.md) | Server + client + database and how they connect |
| [Authentication](./guides/authentication.md) | Login, permissions, and keeping users safe |

### Shipping
| Guide | What You Learn |
|-------|----------------|
| [GitHub & Version Control](./guides/version-control.md) | Save work, undo mistakes, collaborate |
| [Cloud Infrastructure](./guides/cloud-infrastructure.md) | Deploying, domains, DNS, Cloudflare, GitHub Pages |
| [Web Rules](./guides/web-rules.md) | Security, accessibility, performance checklists |

---

## The Essentials

**Context is capability.** The more the agent knows about you, the problem and what good looks like, the better it gets.

**Self-verification is the goal.** Give the agent a way to judge its own output (a browser to look at, a test, five runs to compare) and it will loop until it's right.

**Never wait.** Runs take 10 to 60 minutes. Queue more information, start another thread, check back.

**Your job is verifying.** Ask for the best tool for you to check the work. Look at everything before you ship it.

**Be ambitious.** The first result is a starting point, not a ceiling. Ask for more than you need.

---

## External Resources

### Tools
- [T3 Code](https://t3.codes) · [Source on GitHub](https://github.com/pingdotgg/t3code)
- [Claude Code Docs](https://docs.anthropic.com/en/docs/claude-code)
- [Codex Developer Guide](https://developers.openai.com/codex/)
- [Artificial Analysis](https://artificialanalysis.ai) (independent model benchmarks, cost and token usage)

### Watching and Reading
- [Theo on YouTube](https://www.youtube.com/@theo) (creator of T3 Code; broad context on agentic workflows)
- [Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)
- [Using LLMs for Code](https://simonwillison.net/2025/Mar/11/using-llms-for-code/)
- [The 70% Problem](https://addyo.substack.com/p/the-70-problem-hard-truths-about) (written for the previous generation of tools, still a useful warning)

### Web Builder Docs
- [v0 Docs](https://v0.app/docs/)
- [Lovable Docs](https://docs.lovable.dev/)

---

## Repository Structure

```
├── README.md                    ← You are here
├── guides/                      ← Educational content
├── skills/                      ← Prompts you can use as skills
├── skills-table.md              ← Skills reference
├── site/                        ← Visual essay + reference site (Astro); reads guides/ and skills/
├── CLAUDE.md                    ← Context for Claude-based tools
└── AGENTS.md                    ← Context for Codex and other agents
```

---

## Contributing

Found an issue or have a suggestion? [Open an issue](https://github.com/chrcit/vibecoding-guide/issues).

## License

MIT. Use however you want.
