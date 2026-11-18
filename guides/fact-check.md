# Sources and Fact-Check

<!-- Generated from site/src/data/ by `node site/scripts/check-facts.mjs --write`. Do not edit by hand: change the data file and regenerate. -->

Every number and tool claim in the guide, with where it comes from. Last checked on **18 November 2026**. Models, prices and limits change every few months, so treat this page as a dated snapshot and follow the links. The same data drives the site's sources page.

Status means:

- **verified**: checked against the primary source on the date given.
- **observation**: someone's dated, attributed estimate or experience. The guide labels it that way and never presents it as a general fact.
- **unverified**: could not be confirmed. Listed under Could Not Verify at the end, never stated as a fact.

## Corrections

What an earlier version said, and what the sources say now.

| Date | Earlier claim | What the sources say | Source |
|---|---|---|---|
| 18 Nov 2026 | Claude plans have a session limit that resets every five hours. | Verified Ultra accounts don't have a five-hour limit. | [support.claude.com/en/articles/17728952](https://support.claude.com/en/articles/17728952) |
| 18 Nov 2026 | Haiku 5.5 costs $0.10 / $0.50 per million tokens. | Only for prompts up to 100,000 tokens; above that it is $0.50 / $2.50. | [platform.claude.com/docs/en/about-claude/pricing](https://platform.claude.com/docs/en/about-claude/pricing) |
| 18 Nov 2026 | Opus 5.5 by effort: 19.1k / 43.8k / 60.1k / 103.4k / 173.3k output tokens and $0.98 / $2.45 / $3.46 / $6.05 / $10.04 per task. | Could not be re-verified. The page now shows whole-index totals (21.1M at low, 218M at max) and a per-task cost only for max ($10.04). The other per-task figures are marked unverified. | [artificialanalysis.ai/models/claude-opus-5-5](https://artificialanalysis.ai/models/claude-opus-5-5) |
| 18 Nov 2026 | The Claude models overview is at platform.claude.com/docs/en/about-claude/models/overview. | It moved to platform.claude.com/docs/en/models/overview. | [platform.claude.com/docs/en/models/overview](https://platform.claude.com/docs/en/models/overview) |
| 18 Nov 2026 | T3 Code's FAQ links Theo's accounts. | The FAQ links one t3.gg blog post, one post on X, one YouTube video and one GitHub gist. No account pages. | [github.com/pingdotgg/t3code/blob/main/docs/user/faq.md](https://github.com/pingdotgg/t3code/blob/main/docs/user/faq.md) |
| 18 Nov 2026 | Neither Anthropic nor OpenAI publishes a figure for plan limits. | OpenAI publishes estimated Codex messages per five hours on Plus and Business: Astra 6–50, Sol 17–180, Terra 35–285, Luna 350–3,000. Anthropic publishes none. | [learn.chatgpt.com/docs/pricing](https://learn.chatgpt.com/docs/pricing) |
| 18 Nov 2026 | Grill Me is the skill for being interviewed about a plan. | A model-invoked grilling skill now sits alongside the user-invoked grill-me in the same collection. | [github.com/mattpocock/skills](https://github.com/mattpocock/skills) |
| 18 Nov 2026 | Felix Rieseberg published no skill; community versions exist. | The original is his article, which publishes a prompt. An MIT-licensed skill exists by robonuggets, which credits an earlier prompt-only version by DannyMac180. | [github.com/robonuggets/be-ambitious](https://github.com/robonuggets/be-ambitious) |
| 18 Nov 2026 | Max and Ultra are 5× and 10× Pro usage. | They also include $100 and $200 a month of Claude API credit, which cannot be spent in interactive Claude Code or the Claude apps. | [support.claude.com/en/articles/17154008](https://support.claude.com/en/articles/17154008) |
| 18 Nov 2026 | Codex docs at developers.openai.com/codex/*. | Those addresses now redirect (308) to learn.chatgpt.com/docs/*. | [learn.chatgpt.com/docs/pricing](https://learn.chatgpt.com/docs/pricing) |
| 18 Nov 2026 | Claude Code defaults to medium effort. | Effort defaults are per model: medium on Opus 5.5 (Claude Code's default model) and Haiku 5.5, high on Fable 5.2 and Sonnet 5.5. | [platform.claude.com/docs/en/build-with-claude/effort](https://platform.claude.com/docs/en/build-with-claude/effort) |
| 18 Nov 2026 | METR's time-horizons page gives a doubling time of 129 days. | The page no longer states one. The 128.7-day figure (interval 104 to 158) is in METR's results file. The page was last updated on 8 September 2026. | [metr.org/assets/benchmark_results_1_1.yaml](https://metr.org/assets/benchmark_results_1_1.yaml) |
| 18 Nov 2026 | OpenAI release dates (Astra and Sol 17 Nov, Terra 26 Oct, Luna 22 Sep 2026) are on the OpenAI models page. | That page no longer lists release dates. The dates are kept but marked unverified. | [learn.chatgpt.com/docs/models](https://learn.chatgpt.com/docs/models) |
| 18 Nov 2026 | "Anthropic models for judgement, OpenAI models for grinding" (working experience). | Removed. The guide does not rank labs in its own voice. The owner's two opinions are stored, dated, as opinions. | [github.com/chrcit/vibecoding-guide](https://github.com/chrcit/vibecoding-guide) |
| 18 Nov 2026 | Claude Opus writes about 44k / 60k / 103k / 173k tokens at medium / high / xhigh / max. | Those were output tokens per index task, not totals. | [artificialanalysis.ai/models/claude-opus-5-5](https://artificialanalysis.ai/models/claude-opus-5-5) |
| 18 Nov 2026 | Output is about 80% of your bill. | No source gives a fixed share. Output costs 5× input on every current Claude model; Anthropic's worked example comes to 60% output. | [platform.claude.com/docs/en/about-claude/pricing](https://platform.claude.com/docs/en/about-claude/pricing) |
| 18 Nov 2026 | $20 plan ≈ $30 of usage per five-hour window, $100 plan ≈ $150. | One account's reading on one afternoon, now labelled as such. Anthropic publishes no dollar figure. | [support.claude.com/en/articles/11647753](https://support.claude.com/en/articles/11647753) |
| 18 Nov 2026 | The cheap ChatGPT model scores close to last year's flagship at 50–60× less cost. | GPT-6 Luna is 12.5× cheaper on input and 20× on output than GPT-5.1. The 50–60× gap is against GPT-5.5. The quality half cannot be checked. | [developers.openai.com/api/docs/pricing](https://developers.openai.com/api/docs/pricing) |
| 18 Nov 2026 | The cost of a given level of intelligence dropped about 100× in a year. | Published estimates: about 10× per year (a16z); 9× to 900× per year by capability level (Epoch AI). | [epoch.ai/data-insights/llm-inference-price-trends](https://epoch.ai/data-insights/llm-inference-price-trends) |
| 18 Nov 2026 | A codebase port that OpenAI models ground on for weeks was done by Opus in about nine days. | Working version in 10 hours, finished over two weeks for about $24,000, after over $400,000 on OpenAI models stalled near 84%. | [github.com/pingdotgg/ts-rust](https://github.com/pingdotgg/ts-rust) |
| 18 Nov 2026 | Around June 2026 the models became coherent for hours. | The change was gradual: METR horizons went from about 1 hour (Feb 2025) to about 17 hours (Apr 2026). | [metr.org/time-horizons](https://metr.org/time-horizons/) |
| 18 Nov 2026 | The intelligence index combines about 100 benchmarks. | Version 5 combines 9 evaluations in four groups. | [artificialanalysis.ai/methodology/intelligence-benchmarking](https://artificialanalysis.ai/methodology/intelligence-benchmarking) |
| 18 Nov 2026 | Claude Code and Codex are both proprietary. | The Codex CLI is open source (Apache-2.0). Claude Code is not. | [github.com/openai/codex](https://github.com/openai/codex) |
| 18 Nov 2026 | Codex only runs OpenAI models. | Codex can be pointed at other providers. Claude Code officially supports Claude models only. | [learn.chatgpt.com/docs/config-file/config-advanced](https://learn.chatgpt.com/docs/config-file/config-advanced) |
| 18 Nov 2026 | T3 Code supports Claude Code, Codex, Cursor, OpenCode and other agents. | The full list: Claude Code, Codex, Cursor, OpenCode, Grok Build, Antigravity, Kiro, Pi, Muse Code, fx, and any ACP agent. | [github.com/pingdotgg/t3code](https://github.com/pingdotgg/t3code) |
| 18 Nov 2026 | T3 Code keeps skills in sync across machines. | Not a documented feature. T3 Code uses each agent's own skill folders. | [github.com/pingdotgg/t3code/tree/main/docs/user](https://github.com/pingdotgg/t3code/tree/main/docs/user) |

## Models

Release dates, context windows, API list prices and effort levels. From `site/src/data/models.ts`.

| Claim | Value | Status | Source |
|---|---|---|---|
| Claude Fable 5.2 was released on 9 November 2026. | 9 Nov 2026 | verified | [platform.claude.com/docs/en/models/fable-5-2/overview](https://platform.claude.com/docs/en/models/fable-5-2/overview) |
| Claude Fable 5.2 has a 1M-token context window. | 1M tokens | verified | [platform.claude.com/docs/en/models/overview](https://platform.claude.com/docs/en/models/overview) |
| Claude Fable 5.2 writes at most 128K tokens per response. | 128K tokens | verified | [platform.claude.com/docs/en/models/overview](https://platform.claude.com/docs/en/models/overview) |
| Claude Fable 5.2 costs $8 per million input tokens. | $8 | verified | [platform.claude.com/docs/en/about-claude/pricing](https://platform.claude.com/docs/en/about-claude/pricing) |
| Claude Fable 5.2 costs $40 per million output tokens. | $40 | verified | [platform.claude.com/docs/en/about-claude/pricing](https://platform.claude.com/docs/en/about-claude/pricing) |
| Cache reads on Claude Fable 5.2 cost $0.20 per million tokens. | $0.20 | verified | [platform.claude.com/docs/en/about-claude/pricing](https://platform.claude.com/docs/en/about-claude/pricing) |
| Claude Fable 5.2 accepts the effort levels low, medium, high, xhigh and max. | low, medium, high, xhigh, max | verified | [platform.claude.com/docs/en/build-with-claude/effort](https://platform.claude.com/docs/en/build-with-claude/effort) |
| The API default effort for Claude Fable 5.2 is high. | high | verified | [platform.claude.com/docs/en/models/overview](https://platform.claude.com/docs/en/models/overview) |
| On Claude Fable 5.2 thinking is adaptive and always on: the model decides how much to think and effort steers it. | adaptive, always on | verified | [platform.claude.com/docs/en/models/overview](https://platform.claude.com/docs/en/models/overview) |
| Claude Opus 5.5 was released on 22 September 2026. | 22 Sep 2026 | verified | [platform.claude.com/docs/en/models/opus-5-5/overview](https://platform.claude.com/docs/en/models/opus-5-5/overview) |
| Claude Opus 5.5 has a 1M-token context window. | 1M tokens | verified | [platform.claude.com/docs/en/models/overview](https://platform.claude.com/docs/en/models/overview) |
| Claude Opus 5.5 writes at most 128K tokens per response. | 128K tokens | verified | [platform.claude.com/docs/en/models/overview](https://platform.claude.com/docs/en/models/overview) |
| Claude Opus 5.5 costs $4 per million input tokens. | $4 | verified | [platform.claude.com/docs/en/about-claude/pricing](https://platform.claude.com/docs/en/about-claude/pricing) |
| Claude Opus 5.5 costs $20 per million output tokens. | $20 | verified | [platform.claude.com/docs/en/about-claude/pricing](https://platform.claude.com/docs/en/about-claude/pricing) |
| Cache reads on Claude Opus 5.5 cost $0.20 per million tokens. | $0.20 | verified | [platform.claude.com/docs/en/about-claude/pricing](https://platform.claude.com/docs/en/about-claude/pricing) |
| Fast mode on Claude Opus 5.5 costs $8 per million input tokens. | $8 | verified | [platform.claude.com/docs/en/about-claude/pricing](https://platform.claude.com/docs/en/about-claude/pricing) |
| Fast mode on Claude Opus 5.5 costs $40 per million output tokens. | $40 | verified | [platform.claude.com/docs/en/about-claude/pricing](https://platform.claude.com/docs/en/about-claude/pricing) |
| Claude Opus 5.5 accepts the effort levels low, medium, high, xhigh and max. | low, medium, high, xhigh, max | verified | [platform.claude.com/docs/en/build-with-claude/effort](https://platform.claude.com/docs/en/build-with-claude/effort) |
| The API default effort for Claude Opus 5.5 is medium. | medium | verified | [platform.claude.com/docs/en/models/overview](https://platform.claude.com/docs/en/models/overview) |
| On Claude Opus 5.5 thinking is adaptive and always on: the model decides how much to think and effort steers it. | adaptive, always on | verified | [platform.claude.com/docs/en/models/overview](https://platform.claude.com/docs/en/models/overview) |
| Claude Sonnet 5.5 was released on 28 September 2026. | 28 Sep 2026 | verified | [platform.claude.com/docs/en/models/sonnet-5-5/overview](https://platform.claude.com/docs/en/models/sonnet-5-5/overview) |
| Claude Sonnet 5.5 has a 1M-token context window. | 1M tokens | verified | [platform.claude.com/docs/en/models/overview](https://platform.claude.com/docs/en/models/overview) |
| Claude Sonnet 5.5 writes at most 128K tokens per response. | 128K tokens | verified | [platform.claude.com/docs/en/models/overview](https://platform.claude.com/docs/en/models/overview) |
| Claude Sonnet 5.5 costs $2 per million input tokens. | $2 | verified | [platform.claude.com/docs/en/about-claude/pricing](https://platform.claude.com/docs/en/about-claude/pricing) |
| Claude Sonnet 5.5 costs $10 per million output tokens. | $10 | verified | [platform.claude.com/docs/en/about-claude/pricing](https://platform.claude.com/docs/en/about-claude/pricing) |
| Cache reads on Claude Sonnet 5.5 cost $0.10 per million tokens. | $0.10 | verified | [platform.claude.com/docs/en/about-claude/pricing](https://platform.claude.com/docs/en/about-claude/pricing) |
| Claude Sonnet 5.5 accepts the effort levels low, medium, high, xhigh and max. | low, medium, high, xhigh, max | verified | [platform.claude.com/docs/en/build-with-claude/effort](https://platform.claude.com/docs/en/build-with-claude/effort) |
| The API default effort for Claude Sonnet 5.5 is high. | high | verified | [platform.claude.com/docs/en/models/overview](https://platform.claude.com/docs/en/models/overview) |
| Claude Sonnet 5.5 uses adaptive thinking. | adaptive | verified | [platform.claude.com/docs/en/models/overview](https://platform.claude.com/docs/en/models/overview) |
| Claude Haiku 5.5 was released on 7 October 2026. | 7 Oct 2026 | verified | [platform.claude.com/docs/en/models/haiku-5-5/overview](https://platform.claude.com/docs/en/models/haiku-5-5/overview) |
| Claude Haiku 5.5 has a 1M-token context window. | 1M tokens | verified | [platform.claude.com/docs/en/models/overview](https://platform.claude.com/docs/en/models/overview) |
| Claude Haiku 5.5 writes at most 128K tokens per response. | 128K tokens | verified | [platform.claude.com/docs/en/models/overview](https://platform.claude.com/docs/en/models/overview) |
| Claude Haiku 5.5 costs $0.10 per million input tokens for prompts up to 100,000 tokens. | $0.10 | verified | [platform.claude.com/docs/en/about-claude/pricing](https://platform.claude.com/docs/en/about-claude/pricing) |
| Claude Haiku 5.5 costs $0.50 per million output tokens for prompts up to 100,000 tokens. | $0.50 | verified | [platform.claude.com/docs/en/about-claude/pricing](https://platform.claude.com/docs/en/about-claude/pricing) |
| Cache reads on Claude Haiku 5.5 cost $0.01 per million tokens for prompts up to 100,000 tokens. | $0.01 | verified | [platform.claude.com/docs/en/about-claude/pricing](https://platform.claude.com/docs/en/about-claude/pricing) |
| Claude Haiku 5.5 is priced by prompt length: prompts over 100,000 tokens pay higher prices, counting cache reads and writes. | 100K tokens | verified | [platform.claude.com/docs/en/about-claude/pricing](https://platform.claude.com/docs/en/about-claude/pricing) |
| Claude Haiku 5.5 costs $0.50 per million input tokens for prompts over 100,000 tokens. | $0.50 | verified | [platform.claude.com/docs/en/about-claude/pricing](https://platform.claude.com/docs/en/about-claude/pricing) |
| Claude Haiku 5.5 costs $2.50 per million output tokens for prompts over 100,000 tokens. | $2.50 | verified | [platform.claude.com/docs/en/about-claude/pricing](https://platform.claude.com/docs/en/about-claude/pricing) |
| Claude Haiku 5.5 accepts the effort levels low, medium, high, xhigh and max. | low, medium, high, xhigh, max | verified | [platform.claude.com/docs/en/build-with-claude/effort](https://platform.claude.com/docs/en/build-with-claude/effort) |
| The API default effort for Claude Haiku 5.5 is medium. | medium | verified | [platform.claude.com/docs/en/models/overview](https://platform.claude.com/docs/en/models/overview) |
| Claude Haiku 5.5 uses adaptive thinking. | adaptive | verified | [platform.claude.com/docs/en/models/overview](https://platform.claude.com/docs/en/models/overview) |
| GPT-6.2 Astra supports a context window of up to 1M tokens; Codex uses 272,000 by default. | 1M tokens | verified | [learn.chatgpt.com/docs/models](https://learn.chatgpt.com/docs/models) |
| GPT-6.2 Astra costs $8 per million input tokens (standard tier, up to 272K input tokens). | $8 | verified | [developers.openai.com/api/docs/pricing](https://developers.openai.com/api/docs/pricing) |
| GPT-6.2 Astra costs $40 per million output tokens (standard tier, up to 272K input tokens). | $40 | verified | [developers.openai.com/api/docs/pricing](https://developers.openai.com/api/docs/pricing) |
| GPT-6.2 Sol supports a context window of up to 1M tokens; Codex uses 500,000 by default. | 1M tokens | verified | [learn.chatgpt.com/docs/models](https://learn.chatgpt.com/docs/models) |
| GPT-6.2 Sol costs $2 per million input tokens. | $2 | verified | [developers.openai.com/api/docs/pricing](https://developers.openai.com/api/docs/pricing) |
| GPT-6.2 Sol costs $10 per million output tokens. | $10 | verified | [developers.openai.com/api/docs/pricing](https://developers.openai.com/api/docs/pricing) |
| GPT-6.1 Terra costs $1 per million input tokens. | $1 | verified | [developers.openai.com/api/docs/pricing](https://developers.openai.com/api/docs/pricing) |
| GPT-6.1 Terra costs $5 per million output tokens. | $5 | verified | [developers.openai.com/api/docs/pricing](https://developers.openai.com/api/docs/pricing) |
| GPT-6 Luna costs $0.10 per million input tokens. | $0.10 | verified | [developers.openai.com/api/docs/pricing](https://developers.openai.com/api/docs/pricing) |
| GPT-6 Luna costs $0.50 per million output tokens. | $0.50 | verified | [developers.openai.com/api/docs/pricing](https://developers.openai.com/api/docs/pricing) |
| GPT-6 Luna supports reasoning effort up to max, but not ultra. | low, medium, high, extra high, max | verified | [learn.chatgpt.com/docs/models](https://learn.chatgpt.com/docs/models) |
| GPT-5.5 (April 2026) costs $5 per million input tokens. | $5 | verified | [developers.openai.com/api/docs/pricing](https://developers.openai.com/api/docs/pricing) |
| GPT-5.5 (April 2026) costs $30 per million output tokens. | $30 | verified | [developers.openai.com/api/docs/pricing](https://developers.openai.com/api/docs/pricing) |
| GPT-5.1, the OpenAI flagship of November 2025, costs $1.25 per million input tokens. | $1.25 | verified | [developers.openai.com/api/docs/pricing](https://developers.openai.com/api/docs/pricing) |
| GPT-5.1 costs $10 per million output tokens. | $10 | verified | [developers.openai.com/api/docs/pricing](https://developers.openai.com/api/docs/pricing) |
| Anthropic's own advice: start with Claude Opus 5.5 for most workloads, and use Fable 5.2 for demanding reasoning and long-horizon agentic work, or when evals on Opus 5.5 at higher effort still fall short. | Start with Opus 5.5; use Fable 5.2 when Opus at higher effort still falls short. | verified | [platform.claude.com/docs/en/models/overview](https://platform.claude.com/docs/en/models/overview) |
| Output tokens cost five times input tokens on every current Claude model. | 5× | verified | [platform.claude.com/docs/en/about-claude/pricing](https://platform.claude.com/docs/en/about-claude/pricing) |
| Thinking tokens are billed as output tokens, including when the text is not shown. On current models you see a summary at most. | billed as output | verified | [platform.claude.com/docs/en/build-with-claude/thinking](https://platform.claude.com/docs/en/build-with-claude/thinking) |
| Anthropic's worked example (an Opus 5.5 session with 50,000 input and 15,000 output tokens) comes to 60% output by cost. | 60% | verified: 50k × $4 = $0.20 input, 15k × $20 = $0.30 output. | [platform.claude.com/docs/en/about-claude/pricing](https://platform.claude.com/docs/en/about-claude/pricing) |
| Batch API requests are 50% off on Claude models. | 50% | verified | [platform.claude.com/docs/en/models/overview](https://platform.claude.com/docs/en/models/overview) |
| Codex offers reasoning effort low (called light in the app), medium, high, extra high, and on some models max and ultra. Ultra uses subagents. | low, medium, high, extra high, max, ultra | verified | [learn.chatgpt.com/docs/models](https://learn.chatgpt.com/docs/models) |

## Plans and limits

Subscription prices, what each includes, how limits work and what the API credit covers. From `site/src/data/plans.ts`.

| Claim | Value | Status | Source |
|---|---|---|---|
| Claude Free costs nothing. | $0 | verified | [claude.com/pricing](https://claude.com/pricing) |
| Claude Code is not included on the free Claude plan. | no | verified | [claude.com/pricing](https://claude.com/pricing) |
| Claude Pro costs $20 a month billed monthly ($17 a month billed yearly). | $20 | verified | [claude.com/pricing](https://claude.com/pricing) |
| Claude Code is included from Pro up. | yes | verified | [claude.com/pricing](https://claude.com/pricing) |
| On Pro, Fable runs on pay-as-you-go usage credits from the start; it is outside the plan limits. | usage credits | verified | [support.claude.com/en/articles/15424964](https://support.claude.com/en/articles/15424964) |
| Claude Max costs $100 a month. | $100 | verified | [claude.com/pricing](https://claude.com/pricing) |
| Max gives 5× Pro usage every five hours and every week. | 5× | verified | [claude.com/pricing](https://claude.com/pricing) |
| On Max, up to 50% of the weekly limit can be spent on Fable at no extra cost; after that Fable continues on usage credits. | 50% | verified | [support.claude.com/en/articles/15424964](https://support.claude.com/en/articles/15424964) |
| Max includes $100 a month of Claude API credit. It cannot be spent in interactive Claude Code, the Claude apps or on extra usage, and does not change plan limits. | $100 | verified | [support.claude.com/en/articles/17154008](https://support.claude.com/en/articles/17154008) |
| Claude Ultra costs $200 a month (web subscriptions; mobile prices may differ). | $200 | verified | [support.claude.com/en/articles/17728952](https://support.claude.com/en/articles/17728952) |
| Ultra gives 10× Pro usage every week. | 10× | verified | [support.claude.com/en/articles/17728952](https://support.claude.com/en/articles/17728952) |
| The plan formerly called Max 20x is now Ultra, at the same price. | Max 20x | verified | [support.claude.com/en/articles/17728952](https://support.claude.com/en/articles/17728952) |
| Verified Ultra accounts don't have a five-hour limit. Unverified accounts have a temporary one until verification. | yes | verified | [support.claude.com/en/articles/17728952](https://support.claude.com/en/articles/17728952) |
| On Ultra, as on Max, up to 50% of the weekly limit can be spent on Fable at no extra cost. | 50% | verified | [support.claude.com/en/articles/15424964](https://support.claude.com/en/articles/15424964) |
| Ultra includes $200 a month of Claude API credit, with the same restrictions as on Max. | $200 | verified | [support.claude.com/en/articles/17154008](https://support.claude.com/en/articles/17154008) |
| Claude plans have a five-hour limit: the period starts with your first message and the limit resets in full five hours later. Verified Ultra accounts have none. | five hours | verified | [support.claude.com/en/articles/11647753](https://support.claude.com/en/articles/11647753) |
| Weekly limits apply across all models, and some plans also have a separate weekly limit for Fable. They reset at a fixed weekly time assigned to the account. | weekly | verified | [support.claude.com/en/articles/11647753](https://support.claude.com/en/articles/11647753) |
| Session and weekly limits are shared across all models, so switching model with /model does not restore access. | yes | verified | [code.claude.com/docs/en/costs](https://code.claude.com/docs/en/costs) |
| With usage credits enabled, work continues on usage credits instead of stopping. | continue at API rates | verified | [support.claude.com/en/articles/11647753](https://support.claude.com/en/articles/11647753) |
| Anthropic publishes no dollar, token or message figure for a plan limit. How fast you use it depends on factors including which model you use. | not published | verified | [support.claude.com/en/articles/11647753](https://support.claude.com/en/articles/11647753) |
| Anthropic runs AI for Science, which gives API credits to researchers. | API credits | verified | [support.claude.com/en/articles/11199177](https://support.claude.com/en/articles/11199177) |
| A Team plan programme exists for verified principal investigators. | Team plan | verified | [claude.com/programs/team-plan-for-scientists](https://claude.com/programs/team-plan-for-scientists) |
| The Claude startup programme closed to new applications on 13 October 2026. | 13 Oct 2026 | verified | [claude.com/programs/team-plan-for-scientists](https://claude.com/programs/team-plan-for-scientists) |
| ChatGPT Free costs nothing and includes Codex. | $0 | verified | [learn.chatgpt.com/docs/pricing](https://learn.chatgpt.com/docs/pricing) |
| ChatGPT Go costs $8 a month and includes Codex. | $8 | verified | [learn.chatgpt.com/docs/pricing](https://learn.chatgpt.com/docs/pricing) |
| ChatGPT Plus costs $20 a month and includes Codex. | $20 | verified | [learn.chatgpt.com/docs/pricing](https://learn.chatgpt.com/docs/pricing) |
| Estimated local Codex messages per five hours on Plus with GPT-6.2 Astra: 6 to 50. | 6–50 | verified | [learn.chatgpt.com/docs/pricing](https://learn.chatgpt.com/docs/pricing) |
| Estimated local Codex messages per five hours on Plus with GPT-6.2 Sol: 17 to 180. | 17–180 | verified | [learn.chatgpt.com/docs/pricing](https://learn.chatgpt.com/docs/pricing) |
| Estimated local Codex messages per five hours on Plus with GPT-6.1 Terra: 35 to 285. | 35–285 | verified | [learn.chatgpt.com/docs/pricing](https://learn.chatgpt.com/docs/pricing) |
| Estimated local Codex messages per five hours on Plus with GPT-6 Luna: 350 to 3,000. | 350–3,000 | verified | [learn.chatgpt.com/docs/pricing](https://learn.chatgpt.com/docs/pricing) |
| ChatGPT Pro comes at $100, $200 or $500 a month. | 100, 200, 500 | verified | [learn.chatgpt.com/docs/pricing](https://learn.chatgpt.com/docs/pricing) |
| ChatGPT Pro plans currently have no five-hour limit. | yes | verified | [learn.chatgpt.com/docs/pricing](https://learn.chatgpt.com/docs/pricing) |
| ChatGPT Business costs $20 per user a month billed yearly ($25 monthly), for two or more users. | $20 | verified | [learn.chatgpt.com/docs/pricing](https://learn.chatgpt.com/docs/pricing) |
| OpenAI publishes estimated message ranges per five hours for Plus and Business; they are estimates, not fixed limits, and weekly limits may also apply. | estimates | verified | [learn.chatgpt.com/docs/pricing](https://learn.chatgpt.com/docs/pricing) |
| Codex is included on every ChatGPT plan, from Free up. | yes | verified | [learn.chatgpt.com/docs/pricing](https://learn.chatgpt.com/docs/pricing) |

## Benchmarks

Artificial Analysis Intelligence Index and METR time horizons, each with the page it came from. From `site/src/data/benchmarks.ts`.

| Claim | Value | Status | Source |
|---|---|---|---|
| Artificial Analysis requires visible attribution wherever its data is displayed or shared; a byline or footer link is enough. | credit required | verified | [artificialanalysis.ai/data-api/docs](https://artificialanalysis.ai/data-api/docs) |
| The Artificial Analysis free API allows 100 requests per 24-hour window. | 100 | verified | [artificialanalysis.ai/data-api/docs](https://artificialanalysis.ai/data-api/docs) |
| Artificial Analysis describes itself as "the independent benchmarking company for AI". | the independent benchmarking company for AI | verified | [artificialanalysis.ai/about](https://artificialanalysis.ai/about) |
| Artificial Analysis says of its index that it "may not apply directly to every use case". | may not apply directly to every use case | verified | [artificialanalysis.ai/methodology/intelligence-benchmarking](https://artificialanalysis.ai/methodology/intelligence-benchmarking) |
| Version 5 of the Intelligence Index combines 9 evaluations in four equally weighted groups: knowledge work, coding, science, general. | 9 | verified | [artificialanalysis.ai/methodology/intelligence-benchmarking](https://artificialanalysis.ai/methodology/intelligence-benchmarking) |
| Claude Fable 5.2 scores 64.6 on the Artificial Analysis Intelligence Index at max effort. | 64.6 | verified: The leaderboard shows whole numbers; the decimal is from the model page read the same day. | [artificialanalysis.ai/leaderboards/models](https://artificialanalysis.ai/leaderboards/models) |
| GPT-6.2 Astra scores 62.1 on the Artificial Analysis Intelligence Index at max effort. | 62.1 | verified: The leaderboard shows whole numbers; the decimal is from the model page read the same day. | [artificialanalysis.ai/articles/openai-has-the-2-model-in-th…](https://artificialanalysis.ai/articles/openai-has-the-2-model-in-the-intelligence-index-with-the-release-of-gpt-6-2-astra-and-gpt-6-2-sol) |
| Gemini 4 Carbon scores 60 on the Artificial Analysis Intelligence Index at high effort. | 60 | verified: The leaderboard shows whole numbers; the decimal is from the model page read the same day. | [artificialanalysis.ai/leaderboards/models](https://artificialanalysis.ai/leaderboards/models) |
| Claude Opus 5.5 scores 59.1 on the Artificial Analysis Intelligence Index at max effort. | 59.1 | verified: The leaderboard shows whole numbers; the decimal is from the model page read the same day. | [artificialanalysis.ai/leaderboards/models](https://artificialanalysis.ai/leaderboards/models) |
| GPT-6.2 Sol scores 57.3 on the Artificial Analysis Intelligence Index at max effort. | 57.3 | verified: The leaderboard shows whole numbers; the decimal is from the model page read the same day. | [artificialanalysis.ai/articles/openai-has-the-2-model-in-th…](https://artificialanalysis.ai/articles/openai-has-the-2-model-in-the-intelligence-index-with-the-release-of-gpt-6-2-astra-and-gpt-6-2-sol) |
| Claude Sonnet 5.5 scores 55 on the Artificial Analysis Intelligence Index at max effort. | 55 | verified | [artificialanalysis.ai/leaderboards/models](https://artificialanalysis.ai/leaderboards/models) |
| GPT-6.1 Terra scores 51.3 on the Artificial Analysis Intelligence Index at max effort. | 51.3 | verified: The leaderboard shows whole numbers; the decimal is from the model page read the same day. | [artificialanalysis.ai/leaderboards/models](https://artificialanalysis.ai/leaderboards/models) |
| Claude Haiku 5.5 scores 36.5 on the Artificial Analysis Intelligence Index at max effort. | 36.5 | verified: The leaderboard shows whole numbers; the decimal is from the model page read the same day. | [artificialanalysis.ai/leaderboards/models](https://artificialanalysis.ai/leaderboards/models) |
| GPT-6 Luna scores 27.9 on the Artificial Analysis Intelligence Index at max effort. | 27.9 | verified: The leaderboard shows whole numbers; the decimal is from the model page read the same day. | [artificialanalysis.ai/leaderboards/models](https://artificialanalysis.ai/leaderboards/models) |
| Claude Opus 5.5 scores 34.8 on the Artificial Analysis Intelligence Index at low effort. | 34.8 | verified: The model page shows 35. | [artificialanalysis.ai/models/claude-opus-5-5](https://artificialanalysis.ai/models/claude-opus-5-5) |
| Claude Opus 5.5 at low effort wrote 21.1M output tokens over the whole index run. | 21.1M tokens | verified | [artificialanalysis.ai/models/claude-opus-5-5](https://artificialanalysis.ai/models/claude-opus-5-5) |
| Claude Opus 5.5 scores 48.2 on the Artificial Analysis Intelligence Index at medium effort. | 48.2 | verified: The model page shows 48. | [artificialanalysis.ai/models/claude-opus-5-5](https://artificialanalysis.ai/models/claude-opus-5-5) |
| Claude Opus 5.5 at medium effort wrote 42.5M output tokens over the whole index run. | 42.5M tokens | verified | [artificialanalysis.ai/models/claude-opus-5-5](https://artificialanalysis.ai/models/claude-opus-5-5) |
| Claude Opus 5.5 scores 51.8 on the Artificial Analysis Intelligence Index at high effort. | 51.8 | verified: The model page shows 52. | [artificialanalysis.ai/models/claude-opus-5-5](https://artificialanalysis.ai/models/claude-opus-5-5) |
| Claude Opus 5.5 at high effort wrote 56.1M output tokens over the whole index run. | 56.1M tokens | verified | [artificialanalysis.ai/models/claude-opus-5-5](https://artificialanalysis.ai/models/claude-opus-5-5) |
| Claude Opus 5.5 scores 57.4 on the Artificial Analysis Intelligence Index at xhigh effort. | 57.4 | verified: The model page shows 57. | [artificialanalysis.ai/models/claude-opus-5-5](https://artificialanalysis.ai/models/claude-opus-5-5) |
| Claude Opus 5.5 at xhigh effort wrote 101M output tokens over the whole index run. | 101M tokens | verified | [artificialanalysis.ai/models/claude-opus-5-5](https://artificialanalysis.ai/models/claude-opus-5-5) |
| Claude Opus 5.5 scores 59.1 on the Artificial Analysis Intelligence Index at max effort. | 59.1 | verified: The model page shows 59. | [artificialanalysis.ai/models/claude-opus-5-5](https://artificialanalysis.ai/models/claude-opus-5-5) |
| Claude Opus 5.5 at max effort wrote 218M output tokens over the whole index run. | 218M tokens | verified | [artificialanalysis.ai/models/claude-opus-5-5](https://artificialanalysis.ai/models/claude-opus-5-5) |
| Claude Opus 5.5 at max effort costs $10.04 per index task. | $10.04 | verified | [artificialanalysis.ai/models/claude-opus-5-5](https://artificialanalysis.ai/models/claude-opus-5-5) |
| Claude Fable 5.2 scores 56.4 on the Artificial Analysis Intelligence Index at medium effort. | 56.4 | verified: Read from the model page. | [artificialanalysis.ai/models/claude-fable-5-2](https://artificialanalysis.ai/models/claude-fable-5-2) |
| Claude Fable 5.2 scores 61.8 on the Artificial Analysis Intelligence Index at high effort. | 61.8 | verified: Read from the model page. | [artificialanalysis.ai/models/claude-fable-5-2](https://artificialanalysis.ai/models/claude-fable-5-2) |
| Claude Fable 5.2 scores 62.2 on the Artificial Analysis Intelligence Index at xhigh effort. | 62.2 | verified: Read from the model page. | [artificialanalysis.ai/models/claude-fable-5-2](https://artificialanalysis.ai/models/claude-fable-5-2) |
| Claude Fable 5.2 scores 64.6 on the Artificial Analysis Intelligence Index at max effort. | 64.6 | verified: Read from the model page. | [artificialanalysis.ai/models/claude-fable-5-2](https://artificialanalysis.ai/models/claude-fable-5-2) |
| METR's time horizon is the length of task, measured by how long it takes a human expert, at which a model is predicted to succeed with a given reliability. It is not how long the agent runs. | human time | verified | [metr.org/time-horizons](https://metr.org/time-horizons/) |
| Since 2023 the 50% time horizon has doubled every 128.7 days (95% interval 104 to 158), excluding estimates above 16 hours. | 128.7 days | verified | [metr.org/assets/benchmark_results_1_1.yaml](https://metr.org/assets/benchmark_results_1_1.yaml) |
| METR calls measurements above 16 hours unreliable with its current task suite. | 16 hours | verified | [metr.org/time-horizons](https://metr.org/time-horizons/) |
| METR no longer actively updates the time-horizons page; its last update was on 8 September 2026. | 8 Sep 2026 | verified | [metr.org/time-horizons](https://metr.org/time-horizons/) |
| GPT-2 (released 2019-02-14) has a 50% time horizon of 0.054 minutes of human task time (95% interval 0.01 to 0.142). | 3 seconds | verified | [metr.org/assets/benchmark_results_1_1.yaml](https://metr.org/assets/benchmark_results_1_1.yaml) |
| GPT-3 (released 2020-05-28) has a 50% time horizon of 0.144 minutes of human task time (95% interval 0.093 to 0.221). | 9 seconds | verified | [metr.org/assets/benchmark_results_1_1.yaml](https://metr.org/assets/benchmark_results_1_1.yaml) |
| GPT-3.5 (released 2022-03-15) has a 50% time horizon of 0.599 minutes of human task time (95% interval 0.255 to 1.116). | 36 seconds | verified | [metr.org/assets/benchmark_results_1_1.yaml](https://metr.org/assets/benchmark_results_1_1.yaml) |
| GPT-4 (released 2023-03-14) has a 50% time horizon of 3.987 minutes of human task time (95% interval 1.933 to 7.995). | 4 minutes | verified | [metr.org/assets/benchmark_results_1_1.yaml](https://metr.org/assets/benchmark_results_1_1.yaml) |
| GPT-4o (released 2024-05-13) has a 50% time horizon of 6.991 minutes of human task time (95% interval 4.001 to 12.906). | 7 minutes | verified | [metr.org/assets/benchmark_results_1_1.yaml](https://metr.org/assets/benchmark_results_1_1.yaml) |
| Claude 3.5 Sonnet (released 2024-06-20) has a 50% time horizon of 11.395 minutes of human task time (95% interval 5.49 to 22.384). | 11 minutes | verified | [metr.org/assets/benchmark_results_1_1.yaml](https://metr.org/assets/benchmark_results_1_1.yaml) |
| o1-preview (released 2024-09-12) has a 50% time horizon of 20.327 minutes of human task time (95% interval 11.716 to 33.38). | 20 minutes | verified | [metr.org/assets/benchmark_results_1_1.yaml](https://metr.org/assets/benchmark_results_1_1.yaml) |
| o1 (released 2024-12-05) has a 50% time horizon of 38.832 minutes of human task time (95% interval 21.165 to 64.952). | 39 minutes | verified | [metr.org/assets/benchmark_results_1_1.yaml](https://metr.org/assets/benchmark_results_1_1.yaml) |
| Claude 3.7 Sonnet (released 2025-02-24) has a 50% time horizon of 60.389 minutes of human task time (95% interval 33.006 to 104.226). | 60 minutes | verified | [metr.org/assets/benchmark_results_1_1.yaml](https://metr.org/assets/benchmark_results_1_1.yaml) |
| o3 (released 2025-04-16) has a 50% time horizon of 119.733 minutes of human task time (95% interval 74.615 to 190.944). | 2 hours | verified | [metr.org/assets/benchmark_results_1_1.yaml](https://metr.org/assets/benchmark_results_1_1.yaml) |
| GPT-5 (released 2025-08-07) has a 50% time horizon of 203.013 minutes of human task time (95% interval 112.641 to 405.552). | 3.4 hours | verified | [metr.org/assets/benchmark_results_1_1.yaml](https://metr.org/assets/benchmark_results_1_1.yaml) |
| Claude Opus 4.5 (released 2025-11-24) has a 50% time horizon of 292.995 minutes of human task time (95% interval 161.718 to 623.705). | 4.9 hours | verified | [metr.org/assets/benchmark_results_1_1.yaml](https://metr.org/assets/benchmark_results_1_1.yaml) |
| GPT-5.2 (released 2025-12-11) has a 50% time horizon of 352.249 minutes of human task time (95% interval 198.067 to 815.177). | 5.9 hours | verified | [metr.org/assets/benchmark_results_1_1.yaml](https://metr.org/assets/benchmark_results_1_1.yaml) |
| Claude Opus 4.6 (released 2026-02-05) has a 50% time horizon of 718.807 minutes of human task time (95% interval 316.686 to 3633.786). | 12 hours | verified | [metr.org/assets/benchmark_results_1_1.yaml](https://metr.org/assets/benchmark_results_1_1.yaml) |
| Claude Mythos Preview (released 2026-04-07) has a 50% time horizon of 1044.78 minutes of human task time (95% interval 508.877 to 3304.261). | 17.4 hours | verified | [metr.org/assets/benchmark_results_1_1.yaml](https://metr.org/assets/benchmark_results_1_1.yaml) |
| At 80% reliability the horizon of Claude Opus 4.5 is 49 minutes. | 49 minutes | verified | [metr.org/assets/benchmark_results_1_1.yaml](https://metr.org/assets/benchmark_results_1_1.yaml) |
| At 80% reliability the horizon of GPT-5.2 is 66 minutes. | 66 minutes | verified | [metr.org/assets/benchmark_results_1_1.yaml](https://metr.org/assets/benchmark_results_1_1.yaml) |
| At 80% reliability the horizon of Claude Opus 4.6 is 70 minutes. | 70 minutes | verified | [metr.org/assets/benchmark_results_1_1.yaml](https://metr.org/assets/benchmark_results_1_1.yaml) |
| At 80% reliability the horizon of Claude Mythos Preview is 186 minutes. | 3.1 hours | verified | [metr.org/assets/benchmark_results_1_1.yaml](https://metr.org/assets/benchmark_results_1_1.yaml) |

## T3 Code

What T3 Code does, from its README and user docs. From `site/src/data/t3code.ts`.

| Claim | Value | Status | Source |
|---|---|---|---|
| The newest T3 Code builds on 18 November 2026 were nightlies of version 0.1.11. The guide was last read against 0.1.10. | 0.1.11 nightly | verified | [github.com/pingdotgg/t3code/releases](https://github.com/pingdotgg/t3code/releases) |
| T3 Code is open source under the MIT licence, copyright T3 Tools Inc. | MIT | verified | [github.com/pingdotgg/t3code](https://github.com/pingdotgg/t3code) |
| T3 Code is free, has no paid tier and does not resell tokens. | free | verified | [github.com/pingdotgg/t3code](https://github.com/pingdotgg/t3code) |
| T3 Code drives the agent CLIs installed on your machine, signed in with your own accounts. API keys are optional. | yes | verified | [github.com/pingdotgg/t3code](https://github.com/pingdotgg/t3code) |
| T3 Code supports Claude Code, Codex, Cursor, OpenCode, Grok Build, Antigravity, Kiro, Pi, Muse Code, fx, and any agent that speaks the Agent Client Protocol (ACP). | Claude Code, Codex, Cursor, OpenCode, Grok Build, Antigravity, Kiro, Pi, Muse Code, fx, any ACP agent | verified | [github.com/pingdotgg/t3code](https://github.com/pingdotgg/t3code) |
| Install as a desktop app for macOS, Windows and Linux, try it with npx t3@latest, use the hosted web client, or use the iOS and Android apps. | desktop app (macOS, Windows, Linux), npx t3@latest, web client, iOS and Android apps | verified | [github.com/pingdotgg/t3code](https://github.com/pingdotgg/t3code) |
| Threads without a project live in a scratch folder and can be turned into a project later. | yes | verified | [github.com/pingdotgg/t3code/tree/main/docs/user](https://github.com/pingdotgg/t3code/tree/main/docs/user) |
| A thread can run in its own Git worktree. Commit, push and pull request actions are built in, with a diff view per turn. | yes | verified | [github.com/pingdotgg/t3code/blob/main/docs/user/source-cont…](https://github.com/pingdotgg/t3code/blob/main/docs/user/source-control.md) |
| Handing a task from one provider to another passes "a budgeted selection, not an agent-written summary" of the conversation. You can change models in the middle of a thread. | budgeted selection | verified | [github.com/pingdotgg/t3code/blob/main/docs/user/portable-ha…](https://github.com/pingdotgg/t3code/blob/main/docs/user/portable-handoffs.md) |
| Agents on every provider can answer with a self-contained HTML page that renders in the thread. | yes | verified | [github.com/pingdotgg/t3code/blob/main/docs/user/html-render…](https://github.com/pingdotgg/t3code/blob/main/docs/user/html-renders.md) |
| Each environment has a browser that you and the agent both see, plus a file viewer and a terminal. | yes | verified | [github.com/pingdotgg/t3code/tree/main/docs/user](https://github.com/pingdotgg/t3code/tree/main/docs/user) |
| Follow-up messages either queue or steer. Queued messages can be edited or removed before they send. Steering needs provider support. | yes | verified | [github.com/pingdotgg/t3code/blob/main/docs/user/composer.md](https://github.com/pingdotgg/t3code/blob/main/docs/user/composer.md) |
| Use it remotely by pairing over your network or Tailscale, through SSH environments, or with T3 Connect. | local network, Tailscale, SSH environments, T3 Connect | verified | [github.com/pingdotgg/t3code/blob/main/docs/user/remote-acce…](https://github.com/pingdotgg/t3code/blob/main/docs/user/remote-access.md) |
| Each T3 Connect account can link up to 3 machines free; phones and browsers do not count. A paid T3 Chat plan raises this to 10 (Pro) or 100. | 3 | verified | [github.com/pingdotgg/t3code/blob/main/docs/user/remote-acce…](https://github.com/pingdotgg/t3code/blob/main/docs/user/remote-access.md) |
| The iOS and Android apps are remotes: the computer does the work and has to stay on. | yes | verified | [github.com/pingdotgg/t3code/blob/main/docs/user/remote-acce…](https://github.com/pingdotgg/t3code/blob/main/docs/user/remote-access.md) |
| Permission modes are Supervised, Auto-accept edits, Auto and Full access. T3 Code itself is not a sandbox. | Supervised, Auto-accept edits, Auto, Full access | verified | [github.com/pingdotgg/t3code/blob/main/docs/user/permission-…](https://github.com/pingdotgg/t3code/blob/main/docs/user/permission-modes.md) |
| The initial default permission mode for new threads is Full access. | Full access | verified | [github.com/pingdotgg/t3code/blob/main/docs/user/permission-…](https://github.com/pingdotgg/t3code/blob/main/docs/user/permission-modes.md) |
| T3 Code has voice dictation in the composer, in comments and in review replies. | yes | verified | [github.com/pingdotgg/t3code/blob/main/docs/user/voice-input…](https://github.com/pingdotgg/t3code/blob/main/docs/user/voice-input.md) |
| On desktop and web you choose where transcription runs: a model downloaded to an environment, or a cloud provider (OpenAI or Grok Voice Transcribe) with your own key. Phones transcribe on the device by default. | local model or your key | verified | [github.com/pingdotgg/t3code/blob/main/docs/user/voice-input…](https://github.com/pingdotgg/t3code/blob/main/docs/user/voice-input.md) |
| A single voice recording in T3 Code is limited to five minutes. | 5 minutes | verified | [github.com/pingdotgg/t3code/blob/main/docs/user/voice-input…](https://github.com/pingdotgg/t3code/blob/main/docs/user/voice-input.md) |
| Agents that T3 Code did not start can work with an environment through its MCP server, at the environment address followed by /mcp. | <environment>/mcp | verified | [github.com/pingdotgg/t3code/blob/main/docs/user/outside-age…](https://github.com/pingdotgg/t3code/blob/main/docs/user/outside-agents.md) |
| Tasks can run on a schedule. | yes | verified | [github.com/pingdotgg/t3code/tree/main/docs/user](https://github.com/pingdotgg/t3code/tree/main/docs/user) |
| Outside pull requests for new features, providers or UI overhauls are closed; bug fixes from daily users are welcome. | no feature PRs | verified | [github.com/pingdotgg/t3code/blob/main/CONTRIBUTING.md](https://github.com/pingdotgg/t3code/blob/main/CONTRIBUTING.md) |
| The T3 Code FAQ is written in Theo's voice and links one t3.gg blog post, one post on X, one YouTube video and one GitHub gist. It links no account pages. | one blog post, one X post, one video, one gist | verified | [github.com/pingdotgg/t3code/blob/main/docs/user/faq.md](https://github.com/pingdotgg/t3code/blob/main/docs/user/faq.md) |
| The newest stable T3 Code release on 18 November 2026 was 0.1.10, published on 17 November 2026. | 0.1.10 | verified | [github.com/pingdotgg/t3code/releases](https://github.com/pingdotgg/t3code/releases) |
| T3 Code is copyright T3 Tools Inc. Its FAQ is written by Theo in the first person and links his own posts. | T3 Tools Inc. | verified | [github.com/pingdotgg/t3code/blob/main/docs/user/faq.md](https://github.com/pingdotgg/t3code/blob/main/docs/user/faq.md) |
| A new installation opens on a Welcome page that lists the agents found on the computer. For Claude Code, Install or Sign in opens a terminal with the command ready to run; for Codex, Set up offers sign-in with a ChatGPT account. | Welcome page | verified | [github.com/pingdotgg/t3code/blob/main/docs/user/welcome-pag…](https://github.com/pingdotgg/t3code/blob/main/docs/user/welcome-page.md) |
| Codex can be connected with a ChatGPT account from inside T3 Code, which then installs Codex itself; no terminal is needed. | yes | verified | [github.com/pingdotgg/t3code/blob/main/docs/user/providers-c…](https://github.com/pingdotgg/t3code/blob/main/docs/user/providers-codex.md) |
| New project makes a Git repository in ~/.t3/projects with a README, an icon and a first commit, then opens a thread in it. | ~/.t3/projects | verified | [github.com/pingdotgg/t3code/blob/main/docs/user/source-cont…](https://github.com/pingdotgg/t3code/blob/main/docs/user/source-control.md) |
| Shift-click several models in a new thread to send the same prompt to each; every selection starts its own thread and worktree. | yes | verified | [github.com/pingdotgg/t3code/blob/main/docs/user/thread-side…](https://github.com/pingdotgg/t3code/blob/main/docs/user/thread-sidebar.md) |
| New worktrees go in the worktrees folder of the T3 home directory unless Settings → Worktrees names another location. | worktrees folder in the T3 home | verified | [github.com/pingdotgg/t3code/blob/main/docs/user/project-set…](https://github.com/pingdotgg/t3code/blob/main/docs/user/project-settings.md) |
| Automatically named worktree branches use the prefix t3/ by default; a model-chosen prefix such as feat/ or custom instructions are the alternatives. | t3/ | verified | [github.com/pingdotgg/t3code/blob/main/docs/user/project-set…](https://github.com/pingdotgg/t3code/blob/main/docs/user/project-settings.md) |
| Edit from here rewinds a thread to before a message. Reverting the files too is offered only for threads in a worktree; a thread in the project folder rewinds the conversation only. | Edit from here | verified | [github.com/pingdotgg/t3code/blob/main/docs/user/composer.md](https://github.com/pingdotgg/t3code/blob/main/docs/user/composer.md) |
| The thread details card lists local servers the thread started, with their ports; selecting one opens it in the browser panel. | yes | verified | [github.com/pingdotgg/t3code/blob/main/docs/user/thread-side…](https://github.com/pingdotgg/t3code/blob/main/docs/user/thread-sidebar.md) |
| mod+shift+m opens the model picker (mod is Command on macOS, Ctrl elsewhere). | mod+shift+m | verified | [github.com/pingdotgg/t3code/blob/main/docs/user/keybindings…](https://github.com/pingdotgg/t3code/blob/main/docs/user/keybindings.md) |
| mod+shift+e opens the effort picker. | mod+shift+e | verified | [github.com/pingdotgg/t3code/blob/main/docs/user/keybindings…](https://github.com/pingdotgg/t3code/blob/main/docs/user/keybindings.md) |
| mod+shift+a opens the permission mode picker. | mod+shift+a | verified | [github.com/pingdotgg/t3code/blob/main/docs/user/keybindings…](https://github.com/pingdotgg/t3code/blob/main/docs/user/keybindings.md) |
| mod+shift+x opens the workspace menu: the current checkout, a new worktree, or the previous worktree. | mod+shift+x | verified | [github.com/pingdotgg/t3code/blob/main/docs/user/keybindings…](https://github.com/pingdotgg/t3code/blob/main/docs/user/keybindings.md) |
| In a new thread, mod+Enter sends the prompt, keeps the thread running in the background and opens a fresh composer. | mod+Enter | verified | [github.com/pingdotgg/t3code/blob/main/docs/user/keybindings…](https://github.com/pingdotgg/t3code/blob/main/docs/user/keybindings.md) |
| While an agent works, mod+Enter does the opposite of your default follow-up behaviour: it steers when the default is queue, and queues when it is steer. | mod+Enter | verified | [github.com/pingdotgg/t3code/blob/main/docs/user/composer.md](https://github.com/pingdotgg/t3code/blob/main/docs/user/composer.md) |
| mod+shift+d starts and finishes dictation; Esc discards the recording. | mod+shift+d | verified | [github.com/pingdotgg/t3code/blob/main/docs/user/keybindings…](https://github.com/pingdotgg/t3code/blob/main/docs/user/keybindings.md) |
| mod+u opens the Usage page. | mod+u | verified | [github.com/pingdotgg/t3code/blob/main/docs/user/usage.md](https://github.com/pingdotgg/t3code/blob/main/docs/user/usage.md) |
| mod+k opens the command palette. | mod+k | verified | [github.com/pingdotgg/t3code/blob/main/docs/user/source-cont…](https://github.com/pingdotgg/t3code/blob/main/docs/user/source-control.md) |
| A handoff starts with a history allowance of 16,000 tokens by default; server operators can set it between 1,024 and 64,000. | 16K tokens | verified | [github.com/pingdotgg/t3code/blob/main/docs/user/portable-ha…](https://github.com/pingdotgg/t3code/blob/main/docs/user/portable-handoffs.md) |
| A handoff does not copy the outgoing provider's reasoning, tool-call state or attachments. The new agent can read omitted history with T3 Code's thread-reading tool. | reasoning, tool-call state, attachments | verified | [github.com/pingdotgg/t3code/blob/main/docs/user/portable-ha…](https://github.com/pingdotgg/t3code/blob/main/docs/user/portable-handoffs.md) |
| An agent in a thread can hand a task to another agent with delegate_task, including to a linked machine, and its thread wakes with the result. Typing @ and a model name, such as @opus, names that model for the agent without changing the thread's model. | delegate_task | verified | [github.com/pingdotgg/t3code/blob/main/docs/user/remote-acce…](https://github.com/pingdotgg/t3code/blob/main/docs/user/remote-access.md) |
| In the composer, / opens commands and $ adds a skill. After adding skills or MCP servers, Restart agent session picks them up. | $ | verified | [github.com/pingdotgg/t3code/blob/main/docs/user/composer.md](https://github.com/pingdotgg/t3code/blob/main/docs/user/composer.md) |
| The Usage page combines token use across providers and shows an estimated API-equivalent cost, which is not your subscription bill. | estimate, not your bill | verified | [github.com/pingdotgg/t3code/blob/main/docs/user/usage.md](https://github.com/pingdotgg/t3code/blob/main/docs/user/usage.md) |
| Claude can still ask for approval in Full access when its own settings require it, so Claude Code's permission settings keep working underneath. | yes | verified | [github.com/pingdotgg/t3code/blob/main/docs/user/permission-…](https://github.com/pingdotgg/t3code/blob/main/docs/user/permission-modes.md) |
| T3 Code does not support local models. | yes | verified | [github.com/pingdotgg/t3code/blob/main/docs/user/faq.md](https://github.com/pingdotgg/t3code/blob/main/docs/user/faq.md) |
| Code and prompts go from your machine to your provider, not to T3 servers. T3 Code sends basic product usage events without prompts or file contents; T3CODE_TELEMETRY_ENABLED=false turns them off. | provider only | verified | [github.com/pingdotgg/t3code/blob/main/docs/user/faq.md](https://github.com/pingdotgg/t3code/blob/main/docs/user/faq.md) |
| There is no t3 command-line build for Intel Macs; the desktop app works there. | yes | verified | [github.com/pingdotgg/t3code/blob/main/docs/user/install.md](https://github.com/pingdotgg/t3code/blob/main/docs/user/install.md) |
| The command-line install is curl -fsSL https://t3.codes/install.sh \| sh (irm https://t3.codes/install.ps1 \| iex on Windows); t3 starts the server and opens the web app. | curl -fsSL https://t3.codes/install.sh \| sh | verified | [github.com/pingdotgg/t3code/blob/main/docs/user/install.md](https://github.com/pingdotgg/t3code/blob/main/docs/user/install.md) |
| With the desktop app running, t3 app opens a new thread for the current directory and adds it as a project if needed. | t3 app | verified | [github.com/pingdotgg/t3code/blob/main/docs/user/install.md](https://github.com/pingdotgg/t3code/blob/main/docs/user/install.md) |
| The README says you can change models in the middle of a thread and "let Claude hand a task to Codex". | yes | verified | [github.com/pingdotgg/t3code](https://github.com/pingdotgg/t3code) |
| A thread marked Limited stopped on a provider usage or rate limit. Resume at reset schedules a continuation when the provider reports a reset time; you can also switch to another provider instance. | Limited | verified | [github.com/pingdotgg/t3code/blob/main/docs/user/thread-side…](https://github.com/pingdotgg/t3code/blob/main/docs/user/thread-sidebar.md) |
| For GitHub, T3 Code needs a token: one saved in Settings → Source control & issues, GH_TOKEN in the server environment, or the GitHub CLI signed in with gh auth login. | saved token, GH_TOKEN, gh auth login | verified | [github.com/pingdotgg/t3code/blob/main/docs/user/source-cont…](https://github.com/pingdotgg/t3code/blob/main/docs/user/source-control.md) |
| A provider that does not show up is almost always not installed or not on the PATH of the machine running the server; set its Binary path in provider settings. | Binary path | verified | [github.com/pingdotgg/t3code/blob/main/docs/user/faq.md](https://github.com/pingdotgg/t3code/blob/main/docs/user/faq.md) |
| Start a message with /side or /btw to ask about a thread in a side chat without adding to it. | /side | verified | [github.com/pingdotgg/t3code/blob/main/docs/user/thread-side…](https://github.com/pingdotgg/t3code/blob/main/docs/user/thread-sidebar.md) |

## Claude Code and Codex

Subagents, nesting, agent teams, MCP config, voice, skills and sandboxing in each harness. From `site/src/data/harnesses.ts`.

| Claim | Value | Status | Source |
|---|---|---|---|
| Claude Code is not open source. | no | verified | [github.com/anthropics/claude-code](https://github.com/anthropics/claude-code) |
| Claude Code officially supports Claude models only; gateways route to Claude on other platforms. | Claude only | verified | [code.claude.com/docs/en/llm-gateway](https://code.claude.com/docs/en/llm-gateway) |
| On Pro, Max, Ultra, Team, Enterprise and the Anthropic API, Claude Code defaults to Opus 5.5, whose default effort is medium. | Opus 5.5 | verified | [code.claude.com/docs/en/model-config](https://code.claude.com/docs/en/model-config) |
| A Claude Code subagent runs in its own fresh context window and can be given its own model. | yes | verified | [code.claude.com/docs/en/sub-agents](https://code.claude.com/docs/en/sub-agents) |
| By default a Claude Code subagent can spawn subagents of its own, up to three layers below the main conversation (CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH changes it). | 3 | verified | [code.claude.com/docs/en/sub-agents](https://code.claude.com/docs/en/sub-agents) |
| Subagents send their own requests, which count toward the same usage limits as the main conversation. | same limits | verified | [code.claude.com/docs/en/sub-agents](https://code.claude.com/docs/en/sub-agents) |
| Agent teams are experimental and disabled by default (CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1 turns them on). | off by default | verified | [code.claude.com/docs/en/costs](https://code.claude.com/docs/en/costs) |
| Agent teams use approximately 7× more tokens than standard sessions when teammates run in plan mode. | 7× | verified | [code.claude.com/docs/en/costs](https://code.claude.com/docs/en/costs) |
| Claude Code stores project-scoped MCP servers in .mcp.json at the project root and local and user-scoped ones in ~/.claude.json; add one with claude mcp add. | .mcp.json (project), ~/.claude.json (local and user) | verified | [code.claude.com/docs/en/mcp](https://code.claude.com/docs/en/mcp) |
| Claude Code has voice dictation (/voice, hold or tap to record). Audio is streamed to Anthropic for transcription, needs a claude.ai login, and does not count toward plan limits. | /voice | verified | [code.claude.com/docs/en/voice-dictation](https://code.claude.com/docs/en/voice-dictation) |
| Claude Code skills live in .claude/skills/<name>/SKILL.md in a project or ~/.claude/skills/ for everything. Run one with /name, or Claude loads it when its description matches. | .claude/skills/<name>/SKILL.md, ~/.claude/skills/ | verified | [code.claude.com/docs/en/skills](https://code.claude.com/docs/en/skills) |
| Claude Code reads CLAUDE.md, and reads AGENTS.md only when no CLAUDE.md exists; otherwise import it with @AGENTS.md. | CLAUDE.md | verified | [code.claude.com/docs/en/memory](https://code.claude.com/docs/en/memory) |
| Claude Code has worktrees (claude --worktree), checkpoints (/rewind, not for changes made by shell commands), permission modes including plan mode, an optional OS sandbox (/sandbox, macOS and Linux) and hooks. | worktrees, checkpoints, plan mode, sandbox, hooks | verified | [code.claude.com/docs/en/worktrees](https://code.claude.com/docs/en/worktrees) |
| Claude Code queues a message you send while it is working. | yes | verified | [code.claude.com/docs/en/interactive-mode](https://code.claude.com/docs/en/interactive-mode) |
| Claude Code also runs on the web, in cloud sessions that work on your GitHub repositories. | yes | verified | [code.claude.com/docs/en/claude-code-on-the-web](https://code.claude.com/docs/en/claude-code-on-the-web) |
| Sign in to Claude Code with claude auth login. | claude auth login | verified | [code.claude.com/docs/en/quickstart](https://code.claude.com/docs/en/quickstart) |
| Anthropic: "Before a run goes unattended, make sure it knows what done looks like, can check its own work, and can only touch what it should." | Before a run goes unattended, make sure it knows what done looks like, can check its own work, and can only touch what it should. | verified | [code.claude.com/docs/en/best-practices](https://code.claude.com/docs/en/best-practices) |
| Across enterprise deployments Claude Code averages about $13 per developer per active day and $150 to $250 per month. | $13 | verified | [code.claude.com/docs/en/costs](https://code.claude.com/docs/en/costs) |
| In Claude Code, /init generates a starting CLAUDE.md from the codebase: build commands, test instructions and conventions it finds. It suggests improvements when one exists. | /init | verified | [code.claude.com/docs/en/memory](https://code.claude.com/docs/en/memory) |
| Claude Code permission rules live in settings files such as .claude/settings.json, as permissions.allow and permissions.deny lists like "Bash(npm run *)". They are enforced by Claude Code, not by the model; /permissions shows and edits them. | .claude/settings.json | verified | [code.claude.com/docs/en/permissions](https://code.claude.com/docs/en/permissions) |
| In Claude Code, /usage shows plan usage bars and a breakdown of what counted against the limits for subscribers; the session dollar figure is for API users. | /usage | verified | [code.claude.com/docs/en/costs](https://code.claude.com/docs/en/costs) |
| Add a remote MCP server to Claude Code with claude mcp add --transport http <name> <url>. | claude mcp add --transport http <name> <url> | verified | [code.claude.com/docs/en/mcp](https://code.claude.com/docs/en/mcp) |
| The Codex CLI is open source under Apache-2.0. The models behind it are proprietary. | Apache-2.0 | verified | [github.com/openai/codex](https://github.com/openai/codex) |
| Codex is built for OpenAI models but can be pointed at other providers such as Ollama, LM Studio, Amazon Bedrock or any Responses-compatible endpoint. | OpenAI first, others possible | verified | [learn.chatgpt.com/docs/config-file/config-advanced](https://learn.chatgpt.com/docs/config-file/config-advanced) |
| Current Codex releases enable subagent workflows by default; they consume more tokens than comparable single-agent runs. | yes | verified | [learn.chatgpt.com/docs/agent-configuration/subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents) |
| Codex stores MCP servers as [mcp_servers.<name>] tables in ~/.codex/config.toml, or .codex/config.toml in a trusted project. STDIO and streamable HTTP servers are supported. | ~/.codex/config.toml, .codex/config.toml | verified | [learn.chatgpt.com/docs/extend/mcp](https://learn.chatgpt.com/docs/extend/mcp) |
| The ChatGPT desktop app has voice dictation for prompt text in Codex. The docs say nothing about voice in the Codex command line. | desktop app only | verified | [learn.chatgpt.com/docs/features/voice](https://learn.chatgpt.com/docs/features/voice) |
| Codex skills live in .agents/skills/ in the project or any parent folder, and ~/.agents/skills/ for everything. Mention one with $name. | .agents/skills/, ~/.agents/skills/ | verified | [learn.chatgpt.com/docs/build-skills](https://learn.chatgpt.com/docs/build-skills) |
| Codex reads ~/.codex/AGENTS.md and then every AGENTS.md from the repository root down to the working directory. | AGENTS.md | verified | [learn.chatgpt.com/docs/agent-configuration/agents-md](https://learn.chatgpt.com/docs/agent-configuration/agents-md) |
| Codex sandbox modes are read-only, workspace-write (the default) and danger-full-access. It also has /review, worktrees and cloud tasks. | read-only, workspace-write, danger-full-access | verified | [learn.chatgpt.com/docs/sandboxing](https://learn.chatgpt.com/docs/sandboxing) |
| Codex queues a message you send while it is working. | yes | verified | [learn.chatgpt.com/docs/codex/cli](https://learn.chatgpt.com/docs/codex/cli) |
| Sign in to Codex with codex login. | codex login | verified | [learn.chatgpt.com/docs/auth](https://learn.chatgpt.com/docs/auth) |
| The Codex docs moved: developers.openai.com/codex/* now redirects (308) to learn.chatgpt.com/docs/*. | learn.chatgpt.com/docs | verified | [learn.chatgpt.com/docs/pricing](https://learn.chatgpt.com/docs/pricing) |
| T3 Code is an agentic development environment: it drives the harnesses above and adds threads, diffs, previews and mixing providers. What an agent can do still comes from the harness underneath. | ADE | verified | [github.com/pingdotgg/t3code](https://github.com/pingdotgg/t3code) |

## Skills

Recommended skills with author, source and licence. From `site/src/data/skills.ts`.

| Claim | Value | Status | Source |
|---|---|---|---|
| Humanizer is MIT-licensed. | MIT | verified | [github.com/blader/humanizer](https://github.com/blader/humanizer) |
| Humanizer rewrites AI-sounding text, built on Wikipedia's "Signs of AI writing". | rewrites AI-sounding text | verified | [github.com/blader/humanizer](https://github.com/blader/humanizer) |
| Matt Pocock's skills collection is MIT-licensed. | MIT | verified | [github.com/mattpocock/skills](https://github.com/mattpocock/skills) |
| grill-me: "Get relentlessly interviewed about a plan or design until every branch of the design tree is resolved." You invoke it yourself. | interviews you about a plan | verified | [github.com/mattpocock/skills](https://github.com/mattpocock/skills) |
| grilling is in the same MIT-licensed collection as grill-me. | MIT | verified | [github.com/mattpocock/skills](https://github.com/mattpocock/skills) |
| grilling is the model-invoked interview routine behind grill-me and several other skills in the same collection: the agent can reach for it on its own. | the interview routine the agent can call | verified | [github.com/mattpocock/skills](https://github.com/mattpocock/skills) |
| The robonuggets be-ambitious skill is MIT-licensed. | MIT | verified | [github.com/robonuggets/be-ambitious](https://github.com/robonuggets/be-ambitious) |
| robonuggets/be-ambitious turns Felix Rieseberg's article into steps the agent follows (altitude, depth and range) and credits him for the ideas. | turns the article into steps | verified | [github.com/robonuggets/be-ambitious](https://github.com/robonuggets/be-ambitious) |
| A skill is a folder with a SKILL.md file: YAML frontmatter with a name and a description, then instructions. The format is an open standard. | SKILL.md | verified | [agentskills.io](https://agentskills.io/) |
| npx skills add <owner/repo> installs a skill for most agents. | npx skills add <owner/repo> | verified | [github.com/vercel-labs/skills](https://github.com/vercel-labs/skills) |
| Be Ambitious comes from Felix Rieseberg's article "How to be more ambitious: a tutorial for humans with models" (13 October 2026), which publishes example prompts and a prompt template, not a skill. | 13 Oct 2026 | verified | [felixrieseberg.com/how-to-be-more-ambitious-a-tutorial-for-…](https://felixrieseberg.com/how-to-be-more-ambitious-a-tutorial-for-humans-with-models/) |

## MCP and connectors

How agents reach outside systems. From `site/src/data/connectors.ts`.

| Claim | Value | Status | Source |
|---|---|---|---|
| The Model Context Protocol describes itself as "an open-source standard for connecting AI applications to external systems". | an open-source standard for connecting AI applications to external systems | verified | [modelcontextprotocol.io](https://modelcontextprotocol.io/) |
| An MCP server runs either as a local process the agent starts (stdio) or at an address it connects to (streamable HTTP). | stdio, streamable HTTP | verified | [learn.chatgpt.com/docs/extend/mcp](https://learn.chatgpt.com/docs/extend/mcp) |
| In Claude Code, MCP tool definitions are deferred by default: only tool names and server instructions enter context until a tool is used. | deferred | verified | [code.claude.com/docs/en/costs](https://code.claude.com/docs/en/costs) |
| Anthropic notes that command-line tools such as gh, aws, gcloud and sentry-cli are still more context-efficient than MCP servers, because they add no per-tool listing. | CLI tools are more context-efficient | verified | [code.claude.com/docs/en/costs](https://code.claude.com/docs/en/costs) |
| Claude Code has three MCP scopes: local (the default, this project only), project (shared through .mcp.json) and user (all your projects). | local, project, user | verified | [code.claude.com/docs/en/mcp](https://code.claude.com/docs/en/mcp) |
| T3 Code runs an MCP server per environment, so agents it did not start (Claude Code or Codex in your own terminal, ChatGPT, MCP-capable bots) can work with it. | yes | verified | [github.com/pingdotgg/t3code/blob/main/docs/user/outside-age…](https://github.com/pingdotgg/t3code/blob/main/docs/user/outside-agents.md) |

## Privacy

From `site/src/data/claims.ts`.

| Claim | Value | Status | Source |
|---|---|---|---|
| On Claude consumer plans (Free, Pro, Max, Ultra), training on your chats and code is a setting you choose. On: kept up to 5 years. Off: 30 days. | your choice | verified | [code.claude.com/docs/en/data-usage](https://code.claude.com/docs/en/data-usage) |
| Claude Team, Enterprise and the API: no training unless the customer opts in. | no training | verified | [platform.claude.com/docs/en/manage-claude/api-and-data-rete…](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention) |
| Zero data retention is a separate agreement for API and qualified Enterprise customers. It is not available on consumer plans, and not for Fable without Anthropic's approval. | separate agreement | verified | [platform.claude.com/docs/en/manage-claude/api-and-data-rete…](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention) |
| OpenAI API data is not used for training unless you opt in; abuse-monitoring logs are kept up to 30 days; zero data retention needs approval. Business plans: no training by default. | no training by default | verified | [developers.openai.com/api/docs/guides/your-data](https://developers.openai.com/api/docs/guides/your-data) |

## Sharing and Hosting

From `site/src/data/claims.ts`.

| Claim | Value | Status | Source |
|---|---|---|---|
| A GitHub Pages site is public even when its repository is private. Publishing from a private repository needs a paid plan; a private site needs GitHub Enterprise Cloud. | public | verified | [docs.github.com/en/pages/getting-started-with-github-pages/…](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site) |
| Requests to static assets are free and unlimited on Cloudflare Workers and Pages. | free | verified | [developers.cloudflare.com/workers/platform/pricing](https://developers.cloudflare.com/workers/platform/pricing/) |
| The paid Cloudflare Workers plan starts at $5 a month. | $5 | verified | [developers.cloudflare.com/workers/platform/pricing](https://developers.cloudflare.com/workers/platform/pricing/) |
| Cloudflare Access is free for up to 50 users and can put an email one-time code in front of a site. | 50 | verified | [cloudflare.com/sase/products/access](https://www.cloudflare.com/sase/products/access/) |
| Tailscale's Personal plan is free for up to 6 users. | 6 | verified | [tailscale.com/pricing](https://tailscale.com/pricing) |
| tailscale serve shares a local port with your own devices only. | your devices only | verified | [tailscale.com/kb/1312/serve](https://tailscale.com/kb/1312/serve) |

## Price Trends

From `site/src/data/claims.ts`.

| Claim | Value | Status | Source |
|---|---|---|---|
| a16z estimates the price of a fixed level of capability falls about 10× per year. | 10× | verified | [a16z.com/llmflation-llm-inference-cost](https://a16z.com/llmflation-llm-inference-cost/) |
| Epoch AI finds prices fall 9× to 900× per year depending on the capability level, and 40× per year for GPT-4-level performance on science questions. | 9× to 900× per year | verified | [epoch.ai/data-insights/llm-inference-price-trends](https://epoch.ai/data-insights/llm-inference-price-trends) |

## Research

From `site/src/data/claims.ts`.

| Claim | Value | Status | Source |
|---|---|---|---|
| Speech input was about three times faster than typing on a phone keyboard in a Stanford study: 153 against 52 words per minute for English. | 2.93× | verified | [arxiv.org/abs/1608.07323](https://arxiv.org/abs/1608.07323) |

## Hardware

From `site/src/data/claims.ts`.

| Claim | Value | Status | Source |
|---|---|---|---|
| Apple-silicon Macs share one pool of memory between CPU and GPU, which lets them run larger local models. | shared memory | verified | [apple.com/newsroom/2025/10/apple-unleashes-m5-the-next-big-…](https://www.apple.com/newsroom/2025/10/apple-unleashes-m5-the-next-big-leap-in-ai-performance-for-apple-silicon/) |

## Observations and opinions

Attributed estimates and experience, and the owner's own dated opinions. Kept apart from the verified facts. From `site/src/data/observations.ts`.

| Claim | Value | Status | Source |
|---|---|---|---|
| A $200 Claude plan gets you around $8,000 of tokens a month at API prices, of which only $4,000 can be Fable because of the separate Fable limit. | $8,000 a month | observation: Theo's own estimate, at 6:09 in the video of 2026-10-02. | [youtube.com/watch](https://www.youtube.com/watch?v=D8PikZ1KhUo) |
| The $200 Claude subscription is "$200 in, $12,000 out": about $12,000 of API-priced tokens a month. | $12,000 a month | observation: Theo's own estimate, at 5:05 in the video of 2026-11-02. | [youtube.com/watch](https://www.youtube.com/watch?v=y5TEATUDDfc) |
| With the 50% Fable cap, the $200 Claude plan gets about $6,000 of usage a month and the $200 OpenAI plan about $4,300. | $6,000 vs $4,300 | observation: Theo's own estimate, at 4:06 in the video of 2026-11-03. | [youtube.com/watch](https://www.youtube.com/watch?v=Hq2c7pww1Ds) |
| Using only Opus 5.5, the $200 Claude plan returns about 73 times its price in API-priced usage; using only Fable it drops to about 15 times. | 73× | observation: Theo's own estimate, at 26:27 in the video of 2026-11-10. | [youtube.com/watch](https://www.youtube.com/watch?v=yh5IAUow4Hc) |
| A $100 Claude subscription gets "like three to five grand" of API-priced usage. | $3,000–5,000 | observation: Theo's own estimate, at 3:03 in the video of 2026-11-13. | [youtube.com/watch](https://www.youtube.com/watch?v=XtykeVoSmP8) |
| In the ts-rust write-up, about $24,000 of API-priced usage came to roughly 9.5 weeks of a $200 plan's limit: about $2,500 a week at list price. | $2,500 a week | observation: One project, the author's own numbers. | [github.com/pingdotgg/ts-rust](https://github.com/pingdotgg/ts-rust) |
| A Rust port of the TypeScript 7 compiler: over $400,000 of API-priced tokens with GPT-5.6 Sol and GPT-6 Astra stalled near 84% compatibility; Opus 5.5 restarted, had a working version in 10 hours and finished over two weeks for about $24,000. One author's project and numbers. | $24,000 on Opus 5.5 after $400,000 stalled | observation | [github.com/pingdotgg/ts-rust](https://github.com/pingdotgg/ts-rust) |
| One account on one afternoon: the usage meter suggested roughly $30 of API-priced usage per five-hour window on Claude Pro and roughly $150 on Max. | $30 / $150 per five hours | observation: The source is the limits page, which publishes no such figure; the reading is the first version's own. | [support.claude.com/en/articles/11647753](https://support.claude.com/en/articles/11647753) |
| In the guide's own use, runs of 30 to 60 minutes without input are routine, and longer ones work when the agent can check itself. | 30 to 60 minutes | observation: Working experience, not a measurement. | [code.claude.com/docs/en/best-practices](https://code.claude.com/docs/en/best-practices) |
| In the guide's own use, past three to five parallel threads the agents start waiting on you and review quality drops. | three to five | observation: Working experience, not a measurement. | [code.claude.com/docs/en/best-practices](https://code.claude.com/docs/en/best-practices) |
| Linux has felt faster for agentic work in the guide's own use. No controlled benchmark was found. | felt faster | observation: The solid argument for a Linux box is that it stays on. | [github.com/chrcit/vibecoding-guide](https://github.com/chrcit/vibecoding-guide) |
| The guide owner's opinion (18 November 2026): Claude is better at design work. | Claude is better at design work. | observation: Opinion of the guide owner. | [github.com/chrcit/vibecoding-guide](https://github.com/chrcit/vibecoding-guide) |
| The guide owner's opinion (18 November 2026): the current class of Fable 5.2 and Opus 5.5 is better at high-level decision making. | The current class of Fable 5.2 and Opus 5.5 is better at high-level decision making. | observation: Opinion of the guide owner. | [github.com/chrcit/vibecoding-guide](https://github.com/chrcit/vibecoding-guide) |

## Could Not Verify

- GPT-6.2 Astra was released on 17 November 2026. The OpenAI models page no longer shows release dates. Artificial Analysis covered the release on this date.
- GPT-6.2 Sol was released on 17 November 2026. The OpenAI models page no longer shows release dates.
- GPT-6.1 Terra was released on 26 October 2026. The OpenAI models page no longer shows release dates.
- GPT-6 Luna was released on 22 September 2026. The OpenAI models page no longer shows release dates.
- On Free and Go, Codex offers only the smallest model. Not found on the pricing page when re-read on 2026-11-18.
- Claude Opus 5.5 at low effort writes about 19.1k output tokens per index task. Could not be re-read on 2026-11-18; the page now gives a 21.1M total for low, which does not match.
- Claude Opus 5.5 at low effort costs $0.98 per index task. The page gives a per-task cost only for max.
- Claude Opus 5.5 at medium effort writes about 43.8k output tokens per index task. Not shown per task on the page on 2026-11-18.
- Claude Opus 5.5 at medium effort costs $2.45 per index task. The page gives a per-task cost only for max.
- Claude Opus 5.5 at high effort writes about 60.1k output tokens per index task. Not shown per task on the page on 2026-11-18.
- Claude Opus 5.5 at high effort costs $3.46 per index task. The page gives a per-task cost only for max.
- Claude Opus 5.5 at xhigh effort writes about 103.4k output tokens per index task. Not shown per task on the page on 2026-11-18.
- Claude Opus 5.5 at xhigh effort costs $6.05 per index task. The page gives a per-task cost only for max.
- Running the whole index on Claude Opus 5.5 at xhigh costs $4,766. Not shown on the page on 2026-11-18.
- Claude Opus 5.5 at max effort writes about 173.3k output tokens per index task. Not shown per task on the page on 2026-11-18.
- Running the whole index on Claude Opus 5.5 at max costs $8,910. Not shown on the page on 2026-11-18.
- Codex limits how deeply subagents can nest. The subagents page does not state a nesting depth; only a per-session cap on concurrent agent threads.
- DannyMac180 publishes an MIT-licensed Be Ambitious skill. The robonuggets README credits DannyMac180 for an earlier prompt-only version. No DannyMac180 repository could be found to confirm a skill or its licence.
- ChatGPT consumer plans train on your content by default, with an opt-out under Data Controls. OpenAI's help pages blocked automated access. Check the setting yourself.
- Railway gives a $5 monthly credit. Never sourced; not re-checked.
- A .com domain typically costs $10 to $15 a year. Never sourced; not re-checked.

---

**Related:**
- [Models and Costs](./models-and-costs.md) - The numbers in context
- [T3 Code](./t3-code.md) - Capabilities and limits
- [Ways of Working](./ways-of-working.md) - The habits
