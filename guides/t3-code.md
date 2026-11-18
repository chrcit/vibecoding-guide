# T3 Code: One Workspace for Every Agent

T3 Code is the tool this guide is written around. It is an **agentic development environment (ADE)**: one window where you run, watch and steer coding agents from different providers. Facts on this page are from the T3 Code README and user docs at version 0.1.10 (17 November 2026); see [Sources and Fact-Check](./fact-check.md#t3-code).

- Website: [t3.codes](https://t3.codes)
- Source: [github.com/pingdotgg/t3code](https://github.com/pingdotgg/t3code), MIT licence, copyright T3 Tools Inc.
- Created by Theo ([YouTube](https://www.youtube.com/@theo)), whose channel is also good background on where agentic work is heading
- Free, with no paid tier. It does not resell tokens.

## Harness vs. ADE

| Layer | What it is | Examples |
|-------|-----------|----------|
| **Model** | The AI itself. Reads tokens, writes tokens. | Claude Opus 5.5, Claude Fable 5.2, GPT-6.2 Astra |
| **Harness** | The program that gives a model tools: read and edit files, run commands, use a browser, start subagents. | Claude Code (Anthropic), Codex (OpenAI), Cursor, OpenCode |
| **ADE** | A layer above the harnesses that shows the work, organises it and runs many agents at once. | T3 Code |

T3 Code does not replace Claude Code or Codex. It drives the agent CLIs installed on your machine, signed in with your own accounts. API keys are optional. What it adds is the view: threads, projects, diffs, previews, and the ability to mix providers in one place.

Why that matters: Claude Code officially supports Claude models only. Codex is built for OpenAI models, though it can be pointed at other providers such as a local Ollama. The Codex CLI is open source (Apache-2.0); Claude Code is not; the models behind both are proprietary. An ADE that drives all of them lets you pick the best model for each job without switching tools.

## What It Can Do

### Providers

Claude Code, Codex, Cursor, OpenCode, Grok Build, Antigravity, Kiro, Pi, Muse Code, fx, and any agent that speaks the Agent Client Protocol (ACP). You can change models in the middle of a thread, and hand a task from one provider's agent to another's: the receiving agent gets a budgeted selection of the conversation as context. Subagents show up in the sidebar so you can follow them.

### Threads, scratch threads and projects

Every conversation is a thread, and threads belong to projects (usually one Git repository). A thread without a project lives in a scratch folder. That is the right place to explore an idea; when it turns into something, turn the thread into a project. See [From a Session to a Project](./ways-of-working.md#from-a-session-to-a-project).

### Git, worktrees and review

A thread can run in its own Git worktree, so parallel agents do not edit the same checkout. Commit, push and pull request actions are built in, and every turn has a diff view. Reading that diff is the fastest way to review what an agent actually did.

### Queue and steer

Messages you send while the agent works either queue for the next turn or steer the running one. You choose the default in settings and use a shortcut for the opposite action. Queued messages can be edited or removed before they send. Steering needs provider support; where a provider lacks it, messages queue.

### HTML renders

Any agent, on any provider, can answer with a self-contained HTML page that renders in the thread: an explainer, a progress dashboard, a chart, a clickable questionnaire. Good for throwaway understanding without managing files.

### Browser, files and terminal

Each environment has a browser that you and the agent both see, plus a file viewer and a terminal. The agent opens your app, clicks through it and fixes what it sees; you watch the same page.

### Permission modes

Supervised, Auto-accept edits, Auto and Full access, chosen per thread with a default in settings. The initial default for new threads is **Full access**. T3 Code is not a sandbox: what an agent can touch is decided by the mode and by the harness underneath. Providers enforce the modes differently, and some offer only a subset.

### Remote use and phone apps

Run T3 Code on one machine and use it from another. Pair over your local network or [Tailscale](https://tailscale.com), add SSH environments, or use T3 Connect (a tunnel, free for up to three machines). The iOS and Android apps are remotes: the computer does the work and has to stay on. Run it on an always-on machine and close your laptop; the threads keep going.

### Scheduled tasks and voice

Tasks can run on a schedule. Voice dictation works in the composer.

### Skills and provider updates

T3 Code uses each agent's own skill folders (`.claude/skills/` for Claude Code, `.agents/skills/` for Codex; see [Skills](../skills-table.md#where-instructions-go)). After you add or change a skill, start a new agent session so it gets picked up. Provider CLIs can be updated from their cards in settings. To get a skill onto another machine, ask an agent on that machine to install it.

### Orchestration

A strong model can manage the work and hand pieces to cheaper models, across providers. See [Orchestration](./ways-of-working.md#orchestration-a-smart-manager-and-cheaper-workers).

## Where It Hits Walls

**It is version 0.x and moving fast.** Features land weekly, screens change, things break. When something breaks, ask an agent to help fix the setup; that is usually faster than searching.

**It comes with no AI.** You need your own subscriptions and each agent's CLI installed and signed in. Your usage limits come from those plans. See [Models and Costs](./models-and-costs.md#what-it-costs).

**It is a viewer, not a harness.** What an agent can do (tools, sandboxing, how it handles files) comes from the harness underneath. If Claude Code cannot do something, T3 Code will not make it possible. Features that need provider support, like steering or automatic permission review, vary by provider.

**Full access is the default.** That is convenient and deserves a deliberate choice. For unfamiliar code, untrusted input, or a machine with credentials you care about, pick a stricter mode or run the agent where the worst case is acceptable. See [Permissions and Sandboxing](./ways-of-working.md#permissions-and-sandboxing).

**Your laptop is a weak server.** If the agents run on a laptop that sleeps, the work stops. Long runs belong on a machine that stays on (see [Hardware](./models-and-costs.md#hardware-linux-vs-mac)).

**Previews are local.** The agent's browser sees your dev server. Someone on another device does not, unless you share it over a private network or deploy it. See [Sharing What You Built](./ways-of-working.md#sharing-what-you-built).

**Your network is part of the loop.** Every model call goes over the network. A slow connection makes every step slower.

**It is not looking for feature contributions.** The [CONTRIBUTING](https://github.com/pingdotgg/t3code/blob/main/CONTRIBUTING.md) file says outside pull requests for new features, providers or UI overhauls will be closed; bug fixes from daily users are welcome. Feature ideas go to issues and discussions.

## Getting Started (One Hour)

Block one hour this week and do real work while you learn.

1. **Get one subscription.** A $20 a month Claude Pro or ChatGPT Plus plan is enough to start. Both include their coding agent.
2. **Install an agent CLI and sign in.** Claude Code: `claude auth login`. Codex: `codex login`.
3. **Install T3 Code** from [t3.codes](https://t3.codes) (desktop app for macOS, Windows and Linux), or try it with `npx t3@latest`.
4. **Choose a permission mode** for your first threads. Supervised is a good way to see what the agent does before you let it run.
5. **Start a thread with no project.** Talk to it. Tell it what you work on and two problems you would like solved this month: one easy, one hard.
6. **Turn it into a project** when something is worth keeping: a Git repository and an `AGENTS.md` with the context you just gave.
7. **In a new thread, say "Help me get started with this project."** It reads its own notes and picks up where you left off.

Everything this guide describes, you can get by asking the agent in plain words.

---

**Related:**
- [Ways of Working](./ways-of-working.md) - How to work with agents day to day
- [Models and Costs](./models-and-costs.md) - Which model for what, and what it costs
- [Skills](../skills-table.md) - Reusable instructions for your agents
- [Sources and Fact-Check](./fact-check.md) - Where the facts on this page come from
