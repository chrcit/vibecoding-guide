# Agentic Coding Guide

> How to work with coding agents now. Written for experienced engineers and scientists who haven't kept up with agents; followable by a motivated newcomer.

**Agentic coding** means you describe the outcome, give context, and set up the checks. Agents plan, write, run and verify the code, often for an hour at a time and several in parallel. The guide is about what that changes in practice: how to give context, how to make an agent verify its own work, how to review what it did, and where it still fails. Claims about models, prices and tools are dated and sourced in [Sources and Fact-Check](./guides/fact-check.md).

**Read it as a visual essay** with interactive figures, plus the full reference: run the site in [`site/`](./site) (`pnpm install && pnpm dev`), or open the GitHub Pages deployment once it's enabled.

This guide started in early 2026 as *Vibe Coding 101*, built around web builders like v0 and Lovable. Since then the length of task the best models can finish unattended kept doubling every few months, agents started working in parallel, and tools like [T3 Code](https://t3.codes) made it practical to run models from different providers side by side. This version is rewritten around that way of working. The web-builder material is still here as an on-ramp.

---

## Quick Start

**Let an agent teach you.** The guide also comes as a skill, [`agentic-guide`](./skills/agentic-guide/SKILL.md), that runs inside T3 Code and teaches on your own work. The site's Start page installs it in four steps: get Claude or ChatGPT, get T3 Code, install the skill with one prompt, then type `$agentic-guide` in a new thread. From a terminal on macOS or Linux, inside a project folder: `bash path/to/skills/agentic-guide/install.sh` (`--global` for every project). More in [Skills](./skills-table.md#the-guide-as-a-skill-agentic-guide).

**Or set it up by hand:**

1. **Get one subscription.** Claude Pro or ChatGPT Plus ($20 a month) includes the coding agent. → [Models and Costs](./guides/models-and-costs.md)
2. **Install an agent CLI and sign in** (`claude auth login` or `codex login`), then install [T3 Code](./guides/t3-code.md) (desktop app, or `npx t3@latest`).
3. **Talk to it.** Use voice. Tell it what you work on and two problems you want solved this month.
4. **Give it a way to check itself,** then let it run. → [Self-Verification](./guides/ways-of-working.md#self-verification-is-the-goal)
5. **Read the diff, not the summary.** → [Reviewing Agent Work](./guides/ways-of-working.md#reviewing-agent-work)

---

## Guides

### Start Here
| Guide | What You Learn |
|-------|----------------|
| [Ways of Working](./guides/ways-of-working.md) | Context, parallel work, self-verification, reviewing agent work, scientific workflows, permissions, orchestration |
| [T3 Code](./guides/t3-code.md) | The agentic development environment: what it can do and where it hits walls |
| [Models and Costs](./guides/models-and-costs.md) | Which model for what, thinking levels, plans, hardware |
| [Skills](./skills-table.md) | Reusable instructions for your agents, how to write one, and the guide as a skill |
| [Sources and Fact-Check](./guides/fact-check.md) | Every number and tool claim, with its primary source and date |

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

**Self-verification is the goal.** Give the agent a way to judge its own output (a failing test, a browser to look at, a reference value, five runs to compare) and it will loop until the judge is satisfied. Then check what the judge cannot.

**Never wait.** Runs take 10 to 60 minutes. Queue or steer more information, start another thread, check back.

**Your job is verifying.** Ask for the best tool for you to check the work. Agents report failure in the same confident tone as success; read the diff before you ship.

**Be ambitious.** The first result is a starting point, not a ceiling. Ask for more than you need.

---

## External Resources

### Tools
- [T3 Code](https://t3.codes) · [Source on GitHub](https://github.com/pingdotgg/t3code)
- [Claude Code Docs](https://code.claude.com/docs/en/overview)
- [Codex Docs](https://learn.chatgpt.com/docs/)
- [Artificial Analysis](https://artificialanalysis.ai) (independent model benchmarks, cost and token usage)

### Watching and Reading
- [Theo on YouTube](https://www.youtube.com/@theo) (creator of T3 Code; broad context on agentic workflows)
- [Claude Code Best Practices](https://code.claude.com/docs/en/best-practices)
- [METR: Time Horizons](https://metr.org/time-horizons/) (how long a task models can finish, tracked over time)
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
│   └── fact-check.md            ← Sources for every number and tool claim (generated from site/src/data/)
├── skills/                      ← Prompts you can use as skills
│   └── agentic-guide/           ← The interactive guide skill, with install.sh
├── skills-table.md              ← Skills reference
├── site/                        ← Visual essay + reference site (Astro); reads guides/ and skills/
│   └── src/data/                ← Every dated fact, with its source (see UPDATE.md)
├── UPDATE.md                    ← How to update a price, add a model, refresh benchmarks
├── CLAUDE.md                    ← Context for Claude-based tools
└── AGENTS.md                    ← Context for Codex and other agents
```

---

## Contributing

Found an issue or have a suggestion? [Open an issue](https://github.com/chrcit/vibecoding-guide/issues).

## License

MIT. Use however you want.
