# T3 Code: One Workspace for Every Agent

T3 Code is the tool this guide is written around. It is an **agentic development environment (ADE)**: one window where you run, watch and steer coding agents from different AI providers.

- Website: [t3.codes](https://t3.codes)
- Source: [github.com/pingdotgg/t3code](https://github.com/pingdotgg/t3code) (open source, MIT licence)
- Made by Theo ([YouTube](https://www.youtube.com/@theo)), whose channel is also good background on where agentic work is heading

## Harness vs. ADE

Two words come up all the time:

| Layer | What it is | Examples |
|-------|-----------|----------|
| **Model** | The AI itself. Reads text, writes text. | Claude Opus, Claude Fable, GPT models |
| **Harness** | The program that gives a model hands: it can read files, edit code, run commands, use a browser. | Claude Code (Anthropic), Codex (OpenAI), Cursor, OpenCode |
| **ADE** | A layer above the harnesses. It shows the work, organises it, and lets you run many agents at once. | T3 Code |

T3 Code does not replace Claude Code or Codex. It drives them. Anthropic says "use Claude Code" and OpenAI says "use Codex", and T3 Code still does exactly that underneath. What it adds is the view: threads, projects, files, previews, and the ability to mix providers.

Why that matters: Claude Code only runs Anthropic models and Codex only runs OpenAI models. Both are proprietary. Editors used to be open (VS Code, Atom). T3 Code brings that back for the agent era and lets you pick the best model for each job.

## What It Can Do

**Threads and projects**
- Every conversation is a thread. Threads belong to projects (usually one Git repository).
- You can also start a thread with no project, just to explore an idea, and turn it into a real project later.

**Many providers in one place**
- Claude Code, Codex, Cursor, OpenCode and other agents in the same window.
- Switch models mid-thread.
- Let one model hand work to a model from a different provider. Outside an ADE this needs hacks.

**Parallel agents (subagents)**
- Ask for several things in one message and the agent splits the work across parallel subagents.
- In a demo session one prompt (a personal website plus a hard research question) became five subagents running side by side, each visible in the sidebar.

**Orchestration**
- A smart, expensive model can act as the "manager" and hand work to cheaper models. See [Ways of Working](./ways-of-working.md#orchestration-a-smart-manager-and-cheaper-workers).

**Inline visuals**
- The agent can render an interactive HTML page right inside the thread: an explainer, a dashboard of what it is doing, a clickable multiple-choice questionnaire, a chart.
- Good for throwaway understanding. You do not have to manage files for it.

**Built-in browser, file viewer and terminal**
- The agent can open your app in its own browser, look at it, click through it and fix what it sees.
- You can look at the files and use a terminal without leaving the window.

**Queue and steer while it works**
- You never need to wait. Send more information while the agent is running. Good models fold it in without losing their place.
- Queued messages can be edited before they are sent.

**Runs anywhere, viewed anywhere**
- Desktop app (macOS, Windows, Linux), a web app, and phone apps that connect to your computer.
- Agents can run on a different machine from the one you are looking at. Run them on an always-on server and close your laptop: the work keeps going. Connect over your local network or a private network such as Tailscale.

**Keeps your setup in sync**
- Skills and agent settings can be updated across machines from one place. Want a new skill on every machine? Tell the agent to install it.

## Where It Hits Walls

T3 Code is powerful and new. Know its limits before you rely on it.

**It does not come with any AI.**
T3 Code does not sell tokens. You need your own accounts and subscriptions (Claude, ChatGPT/Codex, and so on), and each agent's command-line tool installed and signed in. Your usage limits come from those plans, not from T3 Code. See [Models and Costs](./models-and-costs.md).

**It is a viewer, not a harness.**
What an agent can actually do (which tools, which permissions, how it handles files) comes from the harness underneath. If Claude Code cannot do something, T3 Code will not magically make it possible.

**Your laptop is a weak server.**
If agents run on your laptop and the laptop sleeps, the work stops. Long runs belong on a machine that stays on. A modest Linux box works well (see [Models and Costs](./models-and-costs.md#hardware-linux-vs-mac)).

**Previews need a place to live.**
The agent can see your app in its browser. Someone on another device cannot, unless you deploy it (GitHub Pages, Cloudflare, Vercel) or share it over a private network. See [Cloud Infrastructure](./cloud-infrastructure.md).

**Agents still misread you.**
Ask for "a visual of what you're doing" and it may build the whole website inline instead. That is normal. Say what was wrong and it fixes it. The cost of changing course is close to zero, so correct early and often.

**Your network is part of the loop.**
Every step is a network call. Slow Wi-Fi turns a 10-minute run into a 30-minute one. If everything feels sluggish, check the connection before you blame the model.

**It moves fast.**
New agents and features land every week. Things break, and screens change. Ask the agent to help you update or fix the setup itself; that is usually quicker than searching for answers.

## Getting Started (One Hour)

You do not need a course. Block one hour this week and do real work while you learn.

1. **Get one subscription.** A $20/month Claude or ChatGPT plan is enough to start.
2. **Install the agent's CLI and sign in.** For Claude Code: `claude auth login`. For Codex: `codex login`.
3. **Install T3 Code** from [t3.codes](https://t3.codes) (desktop app or `npx t3@latest`).
4. **Start a thread with no project.** Talk to it. Tell it who you are, what you work on, and two problems you would like to solve this month: one easy, one hard.
5. **Ask it to set up a project** for whatever comes out of that, with a Git repository and an `AGENTS.md` that holds the context you just gave it.
6. **Ask it to help you get started.** Literally: "Help me get started with this project." It will read its own notes and pick up where you left off.

Everything this guide describes, you can get by saying it to the agent in plain words.

---

**Related:**
- [Ways of Working](./ways-of-working.md) - How to actually work with agents day to day
- [Models and Costs](./models-and-costs.md) - Which model for what, and what it costs
- [Skills](../skills-table.md) - Reusable instructions for your agents
