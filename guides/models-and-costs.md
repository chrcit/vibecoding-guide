# Models and Costs

Which model to use for what, what thinking levels buy you, and what this costs.

> **Snapshot: November 2026.** Model names, prices and limits change every few months. Every number here has a source in [Sources and Fact-Check](./fact-check.md). The reasoning lasts longer than the numbers.

## The Model Landscape

### Lineups and list prices

API list prices per million tokens, input / output ([Anthropic](https://platform.claude.com/docs/en/about-claude/pricing), [OpenAI](https://developers.openai.com/api/docs/pricing)):

| Model | Released | Input | Output |
|-------|----------|-------|--------|
| Claude Fable 5.2 | 9 Nov 2026 | $8 | $40 |
| Claude Opus 5.5 | 22 Sep 2026 | $4 | $20 |
| Claude Sonnet 5.5 | 28 Sep 2026 | $2 | $10 |
| Claude Haiku 5.5 | 7 Oct 2026 | $0.10 | $0.50 |
| GPT-6.2 Astra | 17 Nov 2026 | $8 | $40 |
| GPT-6.2 Sol | 17 Nov 2026 | $2 | $10 |
| GPT-6.1 Terra | 26 Oct 2026 | $1 | $5 |
| GPT-6 Luna | 22 Sep 2026 | $0.10 | $0.50 |

All current Claude models have a 1M-token context window. Cache reads on Fable and Opus cost $0.20 per million, which matters for agents because they reread the same context on every step.

Anthropic's own [advice](https://platform.claude.com/docs/en/about-claude/models/overview) is to start with Opus 5.5 and move to Fable 5.2 only when Opus at higher effort still falls short.

### Judgement vs. grind

This part is working experience, not measurement.

In our use, the Anthropic models make better decisions over long stretches of work. They stay coherent across many interacting problems, notice dead ends early, and recognise when a reported problem is not a real one. That shows most on work that needs judgement: architecture, ambiguous requirements, qualitative trade-offs.

The OpenAI models are very goal-driven and token-efficient. Given a checkable target (a test suite, a numerical tolerance, 10,000 cases that must pass) they grind on it for hours. That suits quantitative work with a clear pass/fail.

Plenty of people who use both would put it differently. Try both on your own work.

### One public case

The [ts-rust](https://github.com/pingdotgg/ts-rust) project, a Rust port of the TypeScript 7 compiler, is one author's documented account. Over several months, more than $400,000 of API-priced tokens with GPT-5.6 Sol and GPT-6 Astra stalled at around 84% compatibility. Opus 5.5 restarted from scratch, had a working version in 10 hours, and finished over two weeks for about $24,000 of API-priced tokens. It is a single project with the author's own numbers, the OpenAI models involved are not the current ones, and a restart benefits from everything learned in the first attempt. It is an interesting data point, not a benchmark.

## Benchmarks vs. Practice

[Artificial Analysis](https://artificialanalysis.ai), which describes itself as "the independent benchmarking company for AI", publishes an Intelligence Index alongside cost, speed and token usage per model. Version 5 of the index combines 9 evaluations in four equally weighted groups: knowledge work, coding, science and general ([methodology](https://artificialanalysis.ai/methodology/intelligence-benchmarking)).

Scores at max effort, November 2026:

| Model | Index score |
|-------|-------------|
| Claude Fable 5.2 | 64.6 |
| GPT-6.2 Astra | 62.1 |
| Gemini 4 Carbon (high) | 60.0 |
| Claude Opus 5.5 | 59.1 |
| GPT-6.2 Sol | 57.3 |
| GPT-6.1 Terra | 51.3 |
| Claude Haiku 5.5 | 36.5 |
| GPT-6 Luna | 27.9 |

Useful as a map. It does not settle which model is better for your long-running work, for a structural reason: the evaluations are bounded tasks with a known answer, scored one at a time. Long agentic work depends on things a bounded task barely exercises, like staying consistent over hundreds of steps, recovering from your own earlier mistakes, and judging when to stop. Artificial Analysis says itself that the index "may not apply directly to every use case". Run two models on the same real task from your work and compare the diffs.

## The Price of Intelligence Is Falling

The same capability gets cheaper fast. GPT-6 Luna costs $0.10 / $0.50, which is 12.5× cheaper on input and 20× cheaper on output than GPT-5.1 ($1.25 / $10), OpenAI's flagship a year earlier. Whether Luna is as capable as GPT-5.1 cannot be checked directly, because the older model has no score on the current index.

The broader estimates: [a16z](https://a16z.com/llmflation-llm-inference-cost/) puts the drop at about 10× per year for a fixed level of capability. [Epoch AI](https://epoch.ai/data-insights/llm-inference-price-trends) finds 9× to 900× per year depending on the capability level, and 40× per year for GPT-4-level performance on science questions.

If you tried these tools a year ago and were disappointed, the models you tried are no longer the ones on offer, and the price of a given level of capability has fallen by an order of magnitude or more since. Try again.

## Thinking Levels

### What thinking is

Before answering, current models write tokens for themselves: working through the problem, checking intermediate steps, revising an approach. That is "thinking" or "reasoning". Three things about it matter in practice ([thinking docs](https://platform.claude.com/docs/en/build-with-claude/thinking)):

- Thinking tokens are billed as output tokens, the expensive kind, even when you do not see them.
- On current Claude models you see a summary of the thinking at most, not the full text.
- On Fable 5.2 and Opus 5.5 thinking is adaptive and always on. The model decides how much to think; the effort setting steers it.

### The effort levels

Claude Code and the Claude API offer low, medium, high, xhigh and max. Claude Code defaults to medium. Codex offers low, medium, high, extra high, max and ultra.

What the levels do on Opus 5.5, measured by [Artificial Analysis](https://artificialanalysis.ai/models/claude-opus-5-5) on its index:

| Effort | Index score | Output tokens per task | Cost per task |
|--------|-------------|------------------------|---------------|
| low | 34.8 | 19.1k | $0.98 |
| medium | 48.2 | 43.8k | $2.45 |
| high | 51.8 | 60.1k | $3.46 |
| xhigh | 57.4 | 103.4k | $6.05 |
| max | 59.1 | 173.3k | $10.04 |

The curve has a knee. Going from medium to xhigh buys 9.2 points for 2.5× the cost per task. Going from xhigh to max buys another 1.7 points for 1.7× more. Higher effort also means longer waits. In our experience, extra thinking on easy tasks mostly adds time.

Default to medium. Raise it for hard problems, for orchestrators making decisions that many workers depend on, and for long autonomous runs where a wrong turn early is expensive. Lower it for mechanical work.

### Why it drives cost

Output tokens cost five times input tokens on every current Claude model, and thinking is output. How much of a bill is output depends on the workload: agents reread a lot of context (input, often cached), and Anthropic's own [worked example](https://platform.claude.com/docs/en/about-claude/pricing) comes to about 60% output. Effort is the biggest knob you control directly.

## What It Costs

### Plans

| Provider | Plan | Monthly | Notes |
|----------|------|---------|-------|
| Claude | Pro | $20 | Claude Code included. Fable only via usage credits. |
| Claude | Max | $100 | 5× Pro usage. Fable included for up to half the weekly limit. |
| Claude | Ultra | $200 | 10× Pro per week (formerly "Max 20x"). Fable as on Max. |
| ChatGPT | Free / Go | $0 / $8 | Codex included, smallest model only. |
| ChatGPT | Plus | $20 | Codex included. |
| ChatGPT | Pro | $100, $200 or $500 | Codex included, no five-hour limit. |

Sources: [Claude pricing](https://claude.com/pricing), [Fable on plans](https://support.claude.com/en/articles/15424964), [Codex pricing](https://learn.chatgpt.com/docs/pricing). Claude Code is not on the free Claude plan.

### How limits work

Claude plans have a session limit that resets every five hours, plus weekly limits ([usage limits](https://support.claude.com/en/articles/11647753)). With usage credits turned on, work continues past the limit at API rates. Codex counts messages per five-hour period on Plus and Business, weekly limits may apply, and Pro has no five-hour limit.

Neither Anthropic nor OpenAI publishes a dollar or token value for a plan's limits. Two data points, both clearly not official:

- **One account, one afternoon (our observation):** the usage meter suggested roughly $30 of API-priced usage per five-hour window on Claude Pro and roughly $150 on Max. Your mix of models and effort will change this a lot.
- **One public project:** in the [ts-rust](https://github.com/pingdotgg/ts-rust) write-up, about $24,000 of API-priced usage came to roughly 9.5 weeks of a $200 plan's limit, so about $2,500 per week at list price.

Both suggest that for sustained agentic work a subscription costs far less than the same usage billed through the API.

### Recommendation

Start on a $20 plan. If you run agents most days, the $100 tier gets you a long way, and $200 is for running several long threads in parallel all week. If you want Fable regularly, note that on Pro it draws on usage credits.

### Programmes for scientists and startups

Anthropic runs [AI for Science](https://support.claude.com/en/articles/11199177) (API credits) and a [Team plan for verified principal investigators](https://claude.com/programs/team-plan-for-scientists). The Claude startup programme closed to new applications on 13 October 2026.

## Save Money Without Losing Smarts

- Use a cheaper strong model for the bulk of the work and the top model to orchestrate and give second opinions. See [Orchestration](./ways-of-working.md#orchestration-a-smart-manager-and-cheaper-workers).
- Keep effort on medium unless the task needs more. The table above shows where the returns flatten.
- Keep context lean. A long, stale thread is reread on every step; start a fresh one with a good `AGENTS.md` instead.
- On pay-as-you-go APIs, set spending limits. A runaway loop costs real money.
- Check the programmes above if you qualify.

## Privacy

Know what your account does with your data before you put work into it ([Claude Code data usage](https://code.claude.com/docs/en/data-usage), [API and data retention](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention), [OpenAI](https://developers.openai.com/api/docs/guides/your-data)):

- On Claude consumer plans (Free, Pro, Max, Ultra), training on your chats and code is a setting you choose. On: data kept up to five years. Off: 30 days.
- Claude Team, Enterprise and the API: no training unless the customer opts in.
- Zero data retention is a separate agreement for API and qualified Enterprise customers. It is not available on consumer plans, and not for Fable without Anthropic's approval.
- OpenAI API: not used for training unless you opt in; abuse-monitoring logs are kept up to 30 days; zero data retention needs approval. ChatGPT business plans: no training by default.
- ChatGPT consumer plans: we could not verify the current default from OpenAI's help pages. Check the setting under Data Controls yourself.

A private account is not permission to use employer or client data. When in doubt, build and verify with synthetic data in the right shape. See [Privacy with Work Data](./ways-of-working.md#privacy-with-work-data).

## Hardware: Linux vs. Mac

The solid reason to run agents on a separate Linux machine is that it stays on. A cheap Linux box or a rented server runs your agents all day, you connect from your laptop or phone (T3 Code supports this directly, see [T3 Code](./t3-code.md#remote-use-and-phone-apps)), and work continues when the laptop is closed.

Whether Linux is also faster for agentic work is our observation, not a measurement. It has felt faster to us, and there are plausible reasons (process spawning, file system performance, containers without a VM), but we found no controlled benchmark.

Apple-silicon Macs share one pool of memory between CPU and GPU, which lets them run sizeable local models, if slowly. Handy for local transcription or for data that must not leave the machine. They remain excellent personal machines.

A good setup: an always-on Linux machine for the agents, and whatever laptop you like for everything else.

---

**Related:**
- [T3 Code](./t3-code.md) - Run models from different providers side by side
- [Ways of Working](./ways-of-working.md) - Orchestration, verification, ambition
- [Sources and Fact-Check](./fact-check.md) - Every number on this page, with sources
