# Sources and Fact-Check

Every number and tool claim in the essay and the core guides, with where it comes from. Checked on **18 November 2026**. Models, prices and limits change every few months, so treat this page as a dated snapshot and follow the links.

Status means:

- **verified**: the source says what the guide says.
- **corrected**: an earlier version of this guide had it wrong. The row shows the old claim and what replaced it.
- **observation**: one person's experience. The guide labels it that way and does not present it as a general fact.

## Corrections Made in This Version

| Earlier claim | Status | What the sources say | Source |
|---|---|---|---|
| Claude Opus writes about 44k / 60k / 103k / 173k tokens at medium / high / xhigh / max | corrected | The numbers are right but they are **output tokens per task** on the Artificial Analysis Intelligence Index, not totals. Totals for the whole index are 42.5M / 56M / 101M / 218M. Low is 19.1k per task. | [AA: Claude Opus 5.5](https://artificialanalysis.ai/models/claude-opus-5-5) |
| "Max scores a couple of points above xhigh for nearly twice the cost" | verified | Opus 5.5 scores 59.1 at max and 57.4 at xhigh. Cost to run the index: $8,910 against $4,766 (1.87×). | [AA: Claude Opus 5.5](https://artificialanalysis.ai/models/claude-opus-5-5) |
| "Output is about 80% of your bill" | corrected | No source gives a fixed share. Output tokens cost 5× input tokens on every current Claude model, and thinking is billed as output. The share depends on the workload: Anthropic's own worked example comes to about 60%. The guide no longer states a share. | [Claude pricing](https://platform.claude.com/docs/en/about-claude/pricing), [thinking docs](https://platform.claude.com/docs/en/build-with-claude/thinking) |
| "$20 plan ≈ $30 of usage per 5-hour window, $100 plan ≈ $150" | observation | Anthropic publishes no dollar or token figure for plan limits. Official: a session limit that resets every five hours, weekly limits, Max is 5× Pro, Ultra is 10× Pro per week. The dollar figures were one account's reading on one afternoon. | [Usage limits](https://support.claude.com/en/articles/11647753), [Claude pricing](https://claude.com/pricing) |
| "Fable is roughly 2× the price of Opus" | verified | Fable 5.2 is $8 in / $40 out per million tokens. Opus 5.5 is $4 / $20. Exactly 2×. | [Claude pricing](https://platform.claude.com/docs/en/about-claude/pricing) |
| "The cheap ChatGPT model scores close to last year's flagship at 50–60× less cost" | corrected | GPT-6 Luna ($0.10 / $0.50) is 12.5× cheaper on input and 20× cheaper on output than GPT-5.1 ($1.25 / $10), the flagship of November 2025. The 50–60× gap is against GPT-5.5 ($5 / $30) from April 2026. The quality half of the claim cannot be checked: older models have no score on the current index, and Luna scores 27.9, well below today's top models. | [OpenAI API pricing](https://developers.openai.com/api/docs/pricing), [AA: GPT-6 Luna](https://artificialanalysis.ai/models/gpt-6-luna) |
| "The cost of a given level of intelligence dropped about 100× in a year" | corrected | Published estimates: about 10× per year (a16z), and 9× to 900× per year depending on the capability level, with 40× per year for GPT-4-level science questions (Epoch AI). | [a16z: LLMflation](https://a16z.com/llmflation-llm-inference-cost/), [Epoch AI](https://epoch.ai/data-insights/llm-inference-price-trends) |
| "A codebase port that OpenAI models ground on for weeks was done by Opus in about nine days" | corrected | The public account: a Rust port of the TypeScript 7 compiler. Over $400,000 of API-priced tokens with GPT-5.6 Sol and GPT-6 Astra over several months stalled around 84% compatibility. Opus 5.5 restarted from scratch, had a working version in 10 hours, and finished over two weeks for about $24,000 of API-priced tokens. One author's project, his own numbers. | [pingdotgg/ts-rust README](https://github.com/pingdotgg/ts-rust) |
| "Around June 2026 the models became coherent for hours" | corrected | The change was gradual. METR's 50% time horizon (the length of task, measured in human time, that a model completes half the time) went from about 1 hour in February 2025 to about 5 hours in November 2025, 12 hours in February 2026 and 17 hours in April 2026. It has doubled roughly every 129 days since 2023. METR calls estimates above 16 hours unreliable and stopped updating the page in September 2026. The June date was one person's usage chart. | [METR time horizons](https://metr.org/time-horizons/) |
| "The intelligence index combines about 100 benchmarks" | corrected | Version 5 combines 9 evaluations in four equally weighted groups: knowledge work, coding, science, general. | [AA methodology](https://artificialanalysis.ai/methodology/intelligence-benchmarking) |
| "Claude Code and Codex are both proprietary" | corrected | The Codex CLI is open source (Apache-2.0). Claude Code is not. The models behind both are proprietary. | [openai/codex](https://github.com/openai/codex) |
| "Codex only runs OpenAI models" | corrected | Codex is built for OpenAI models but can be pointed at other providers (Ollama, LM Studio, Amazon Bedrock, any Responses-compatible endpoint). Claude Code officially supports Claude models only. | [Codex config](https://learn.chatgpt.com/docs/config-file/config-advanced), [Claude Code gateways](https://code.claude.com/docs/en/llm-gateway) |
| T3 Code supports "Claude Code, Codex, Cursor, OpenCode and other agents" | corrected | Current list: Claude Code, Codex, Cursor, OpenCode, Grok Build, Antigravity, Kiro, Pi, Muse Code, fx, and any ACP agent. | [T3 Code README](https://github.com/pingdotgg/t3code) |
| T3 Code "keeps skills in sync across machines" | corrected | Not a documented feature. T3 Code uses each agent's own skill folders. It can update the agent CLIs from its provider cards. Asking an agent to install a skill on a machine still works, because that is just an agent doing a task. | [T3 Code docs](https://github.com/pingdotgg/t3code/tree/main/docs/user) |
| "Phone apps that connect to your computer" | verified | Native iOS and Android apps. The phone is a remote: the computer does the work and has to stay on. | [T3 Code remote access](https://github.com/pingdotgg/t3code/blob/main/docs/user/remote-access.md) |
| Codex skills location "per the Codex docs" | corrected | `.agents/skills/` in the project or any parent folder, `~/.agents/skills/` for everything. | [Codex skills](https://learn.chatgpt.com/docs/build-skills) |
| "The newest OpenAI flagship scores above Opus 5.5; everybody agrees Opus is better" | verified + observation | GPT-6.2 Astra (17 November 2026) scores 62.1 at max effort against 59.1 for Opus 5.5. Fable 5.2 leads at 64.6. Which one is better for long work is opinion; the guide says so and points to one public case. | [AA: GPT-6.2 release note](https://artificialanalysis.ai/articles/openai-has-the-2-model-in-the-intelligence-index-with-the-release-of-gpt-6-2-astra-and-gpt-6-2-sol) |
| "The very top model may not be included on the cheapest plan" | verified | On Pro ($20), Fable is paid for with usage credits. On Max and Ultra it is included for up to half of the weekly limit. | [Fable on plans](https://support.claude.com/en/articles/15424964) |
| "Speaking is three times faster than typing" | verified | 153 against 52 words per minute for English on a phone keyboard (2.93×), Stanford 2016. Against a fast desk typist the gap is smaller. | [Ruan et al., arXiv 1608.07323](https://arxiv.org/abs/1608.07323) |
| "Linux is noticeably faster for agentic work" | observation | No controlled benchmark found. Plausible reasons (process spawning, file system, containers without a VM) are anecdotal. The solid argument for a Linux box is that it stays on. | none |

## Time Horizons

| Claim | Status | Source |
|---|---|---|
| 50% time horizons (state-of-the-art models): GPT-4 4 min (Mar 2023), Claude 3.7 Sonnet 60 min (Feb 2025), GPT-5 3.4 h (Aug 2025), Claude Opus 4.5 4.9 h (Nov 2025), GPT-5.2 5.9 h (Dec 2025), Claude Opus 4.6 12 h (Feb 2026, 95% interval 5 to 61 h), Claude Mythos Preview 17.4 h (Apr 2026, interval 8.5 to 55 h). | verified | [METR results file](https://metr.org/assets/benchmark_results_1_1.yaml) |
| Doubling time since 2023: 128.7 days (interval 104 to 158). | verified | [METR time horizons](https://metr.org/time-horizons/) |
| At 80% reliability the horizons are five to ten times shorter: Opus 4.5 49 min, GPT-5.2 66 min, Opus 4.6 70 min, Mythos Preview 186 min. | verified | [METR results file](https://metr.org/assets/benchmark_results_1_1.yaml) |
| The horizon is the time a task takes a skilled person, not how long the agent runs. | verified | [METR time horizons](https://metr.org/time-horizons/) |

## Models and Prices

| Claim | Status | Source |
|---|---|---|
| Anthropic lineup: Fable 5.2 (9 Nov 2026), Opus 5.5 (22 Sep 2026), Sonnet 5.5 (28 Sep 2026), Haiku 5.5 (7 Oct 2026). All have a 1M-token context window. | verified | [Claude models overview](https://platform.claude.com/docs/en/about-claude/models/overview) |
| API list prices per million tokens, input / output: Fable 5.2 $8 / $40, Opus 5.5 $4 / $20, Sonnet 5.5 $2 / $10, Haiku 5.5 $0.10 / $0.50. Cache reads $0.20 on Fable and Opus. | verified | [Claude pricing](https://platform.claude.com/docs/en/about-claude/pricing) |
| Anthropic's own advice: start with Opus 5.5 and move to Fable when Opus at higher effort still falls short. | verified | [Claude models overview](https://platform.claude.com/docs/en/about-claude/models/overview) |
| OpenAI lineup: GPT-6.2 Astra and GPT-6.2 Sol (17 Nov 2026), GPT-6.1 Terra (26 Oct 2026), GPT-6 Luna (22 Sep 2026). | verified | [OpenAI models](https://learn.chatgpt.com/docs/models) |
| OpenAI list prices: GPT-6.2 Astra $8 / $40, GPT-6.2 Sol $2 / $10, GPT-6.1 Terra $1 / $5, GPT-6 Luna $0.10 / $0.50. | verified | [OpenAI API pricing](https://developers.openai.com/api/docs/pricing) |
| Intelligence Index v5 scores at max effort: Fable 5.2 64.6, GPT-6.2 Astra 62.1, Gemini 4 Carbon 60.0 (high), Opus 5.5 59.1, GPT-6.2 Sol 57.3, GPT-6.1 Terra 51.3, Haiku 5.5 36.5, GPT-6 Luna 27.9. | verified | [Artificial Analysis](https://artificialanalysis.ai/leaderboards/models) |
| Opus 5.5 by effort (score, output tokens per task, cost per task): low 34.8, 19.1k, $0.98. medium 48.2, 43.8k, $2.45. high 51.8, 60.1k, $3.46. xhigh 57.4, 103.4k, $6.05. max 59.1, 173.3k, $10.04. | verified | [AA: Claude Opus 5.5](https://artificialanalysis.ai/models/claude-opus-5-5) |
| Fable 5.2 by effort (score): medium 56.4, high 61.8, xhigh 62.2, max 64.6. | verified | [AA: Claude Fable 5.2](https://artificialanalysis.ai/models/claude-fable-5-2) |
| Artificial Analysis describes itself as "the independent benchmarking company for AI" and says of its index that it "may not apply directly to every use case". | verified | [AA about](https://artificialanalysis.ai/about), [methodology](https://artificialanalysis.ai/methodology/intelligence-benchmarking) |
| "Anthropic models for judgement, OpenAI models for grinding" | observation | Working experience, not a measurement. |

## Thinking and Effort

| Claim | Status | Source |
|---|---|---|
| Effort levels in Claude Code and the API: low, medium, high, xhigh, max. Claude Code defaults to medium. | verified | [Claude Code model config](https://code.claude.com/docs/en/model-config), [effort](https://platform.claude.com/docs/en/build-with-claude/effort) |
| Thinking tokens are billed as output tokens, including when the text is not shown. On current models you see a summary at most. | verified | [Thinking docs](https://platform.claude.com/docs/en/build-with-claude/thinking) |
| On Fable 5.2 and Opus 5.5 thinking is adaptive and always on: the model decides how much to think, and effort steers it. | verified | [Thinking docs](https://platform.claude.com/docs/en/build-with-claude/thinking) |
| Codex effort levels: low, medium, high, extra high, max, ultra. | verified | [Codex models](https://learn.chatgpt.com/docs/models) |

## Plans and Limits

| Claim | Status | Source |
|---|---|---|
| Claude: Pro $20, Max $100 (5× Pro), Ultra $200 (10× Pro per week, formerly "Max 20x"). Claude Code is included from Pro up, not on Free. | verified | [Claude pricing](https://claude.com/pricing), [Ultra rename](https://support.claude.com/en/articles/17728952) |
| Claude limits: a session limit that resets every five hours, plus weekly limits. With usage credits on, work continues at API rates. | verified | [Usage limits](https://support.claude.com/en/articles/11647753) |
| ChatGPT: Free, Go $8, Plus $20, Pro at $100, $200 or $500. Codex is included on every plan, with the smallest model only on Free and Go. | verified | [Codex pricing](https://learn.chatgpt.com/docs/pricing) |
| Codex limits: messages per five-hour period on Plus and Business, weekly limits may apply, Pro has no five-hour limit. | verified | [Codex pricing](https://learn.chatgpt.com/docs/pricing) |
| One public data point on plan value: about $24,000 of API-priced usage came to roughly 9.5 weeks of a $200 plan's limit, so one week was worth about $2,500 at list price. | observation | [pingdotgg/ts-rust README](https://github.com/pingdotgg/ts-rust) |
| Programmes: AI for Science (API credits), a Team plan for verified principal investigators. The Claude startup programme closed to new applications on 13 October 2026. | verified | [AI for Science](https://support.claude.com/en/articles/11199177), [Team plan for scientists](https://claude.com/programs/team-plan-for-scientists) |

## T3 Code

All from the [README](https://github.com/pingdotgg/t3code) and the [user docs](https://github.com/pingdotgg/t3code/tree/main/docs/user) at version 0.1.10 (17 November 2026).

| Claim | Status |
|---|---|
| Open source, MIT licence, copyright T3 Tools Inc. Does not resell tokens; free, with no paid tier. | verified |
| Drives the agent CLIs installed on your machine with your own logins. API keys are optional. | verified |
| Install: desktop app for macOS, Windows and Linux; `npx t3@latest` to try it; a hosted web client; iOS and Android apps. | verified |
| Threads without a project live in a scratch folder and can be turned into a project later. | verified |
| A thread can run in its own Git worktree. Commit, push and pull request actions are built in, with a diff view per turn. | verified |
| Change models in the middle of a thread; hand a task from one provider's agent to another's; follow subagents from the sidebar. | verified |
| Agents can answer with a self-contained HTML page that renders in the thread, on every provider. | verified |
| Each environment has a browser that you and the agent both see, plus a file viewer and a terminal. | verified |
| Follow-up messages either queue or steer. Queued messages can be edited or removed before they send. Steering needs provider support. | verified |
| Remote: pair over your network or Tailscale, SSH environments, or T3 Connect (a tunnel, free for up to 3 machines). | verified |
| Permission modes: Supervised, Auto-accept edits, Auto, Full access. Full access is the initial default. T3 Code itself is not a sandbox. | verified |
| Scheduled tasks and voice dictation exist. | verified |
| Outside pull requests for new features are not wanted; small fixes are. | verified ([CONTRIBUTING](https://github.com/pingdotgg/t3code/blob/main/CONTRIBUTING.md)) |
| Made by Theo | verified, indirectly: the FAQ is written in his voice and links his accounts; the licence names the company. |

## Claude Code and Codex

| Claim | Status | Source |
|---|---|---|
| Claude Code skills: `.claude/skills/<name>/SKILL.md` in a project, `~/.claude/skills/` for everything. Run with `/name`, or Claude loads one when its description matches the task. | verified | [Claude Code skills](https://code.claude.com/docs/en/skills) |
| Codex skills: `.agents/skills/` and `~/.agents/skills/`. Mention one with `$name`. | verified | [Codex skills](https://learn.chatgpt.com/docs/build-skills) |
| `AGENTS.md`: Codex reads `~/.codex/AGENTS.md` and then every `AGENTS.md` from the repository root down to the working directory. Claude Code reads `CLAUDE.md`, and reads `AGENTS.md` only when no `CLAUDE.md` exists; otherwise import it with `@AGENTS.md`. | verified | [Codex AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md), [Claude Code memory](https://code.claude.com/docs/en/memory) |
| Claude Code: worktrees (`claude --worktree`), checkpoints (`/rewind`, not for changes made by shell commands), permission modes including plan mode, an optional OS sandbox (`/sandbox`; macOS and Linux), hooks. | verified | [worktrees](https://code.claude.com/docs/en/worktrees), [checkpointing](https://code.claude.com/docs/en/checkpointing), [permission modes](https://code.claude.com/docs/en/permission-modes), [sandboxing](https://code.claude.com/docs/en/sandboxing), [hooks](https://code.claude.com/docs/en/hooks-guide) |
| Codex: sandbox modes `read-only`, `workspace-write` (default) and `danger-full-access`; `/review`; worktrees; cloud tasks. | verified | [Codex sandboxing](https://learn.chatgpt.com/docs/sandboxing), [code review](https://learn.chatgpt.com/docs/code-review) |
| Both queue a message you send while the agent is working. | verified | [Claude Code interactive mode](https://code.claude.com/docs/en/interactive-mode), [Codex CLI](https://learn.chatgpt.com/docs/codex/cli) |
| Sign in with `claude auth login` and `codex login`. | verified | [Claude Code quickstart](https://code.claude.com/docs/en/quickstart), [Codex auth](https://learn.chatgpt.com/docs/auth) |
| Anthropic: "Before a run goes unattended, make sure it knows what done looks like, can check its own work, and can only touch what it should." | verified | [Claude Code best practices](https://code.claude.com/docs/en/best-practices) |

## Skills

| Claim | Status | Source |
|---|---|---|
| Humanizer: MIT, built on Wikipedia's "Signs of AI writing". | verified | [blader/humanizer](https://github.com/blader/humanizer) |
| Grill Me: part of Matt Pocock's skills collection, MIT. | verified | [mattpocock/skills](https://github.com/mattpocock/skills) |
| Be Ambitious: based on Felix Rieseberg's article on altitude, depth and range. He published no skill; community versions exist. | verified | [the article](https://felixrieseberg.com/how-to-be-more-ambitious-a-tutorial-for-humans-with-models/) |
| A skill is a folder with a `SKILL.md` file. The format is an open standard. `npx skills add <owner/repo>` installs one for most agents. | verified | [agentskills.io](https://agentskills.io/), [vercel-labs/skills](https://github.com/vercel-labs/skills) |

## Privacy

| Claim | Status | Source |
|---|---|---|
| Claude consumer plans (Free, Pro, Max, Ultra): whether your chats and code are used for training is a setting you choose. On: kept up to 5 years. Off: 30 days. | verified | [Claude Code data usage](https://code.claude.com/docs/en/data-usage) |
| Claude Team, Enterprise and API: no training unless the customer opts in. Zero data retention is a separate agreement for API and qualified Enterprise customers, not available on consumer plans, and not available for Fable without Anthropic's approval. | verified | [API and data retention](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention) |
| OpenAI API: not used for training unless you opt in; abuse-monitoring logs kept up to 30 days; zero data retention needs approval. Business plans: no training by default. | verified | [OpenAI: your data](https://developers.openai.com/api/docs/guides/your-data) |
| ChatGPT consumer plans train on your content by default, with an opt-out under Data Controls. | not fetched: OpenAI's help pages blocked automated access. Check the setting yourself. | [OpenAI privacy portal](https://privacy.openai.com/) |

## Sharing and Hosting

| Claim | Status | Source |
|---|---|---|
| A GitHub Pages site is public even when its repository is private. Publishing from a private repository needs a paid plan. A private site needs GitHub Enterprise Cloud. | verified | [GitHub Pages docs](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site) |
| Cloudflare: requests to static assets are free and unlimited on Workers and Pages. The paid Workers plan starts at $5 a month. | verified | [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/) |
| Cloudflare Access is free for up to 50 users and can put an email one-time code in front of a site. | verified | [Cloudflare Access](https://www.cloudflare.com/sase/products/access/), [one-time PIN](https://developers.cloudflare.com/cloudflare-one/identity/one-time-pin/) |
| Tailscale's Personal plan is free for up to 6 users. `tailscale serve` shares a local port with your own devices only. | verified | [Tailscale pricing](https://tailscale.com/pricing), [serve](https://tailscale.com/kb/1312/serve) |
| Apple-silicon Macs share one pool of memory between CPU and GPU, which lets them run larger local models. | verified | [Apple newsroom](https://www.apple.com/newsroom/2025/10/apple-unleashes-m5-the-next-big-leap-in-ai-performance-for-apple-silicon/) |

## Could Not Verify

- Any dollar value for subscription limits. Neither Anthropic nor OpenAI publishes one.
- Whether last year's flagship models and today's cheap models are equally capable. Artificial Analysis no longer scores the older ones.
- METR time horizons for anything released after April 2026, including Opus 5.5, Fable 5.2 and the GPT-6 family.
- ChatGPT consumer privacy defaults (pages blocked automated fetching).
- Any benchmark showing agents run faster on Linux than on macOS.

---

**Related:**
- [Models and Costs](./models-and-costs.md) - The numbers in context
- [T3 Code](./t3-code.md) - Capabilities and limits
- [Ways of Working](./ways-of-working.md) - The habits
