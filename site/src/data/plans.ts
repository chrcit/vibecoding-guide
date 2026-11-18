// Subscription plans per provider: price, what is included, how limits work,
// what "usage" means and what the API credit covers.
import { fact, unverified } from './types.ts';

const CLAUDE_PRICING = 'https://claude.com/pricing';
const CLAUDE_LIMITS = 'https://support.claude.com/en/articles/11647753';
const CLAUDE_ULTRA = 'https://support.claude.com/en/articles/17728952';
const CLAUDE_FABLE = 'https://support.claude.com/en/articles/15424964';
const CLAUDE_CREDITS = 'https://support.claude.com/en/articles/17154008';
const CLAUDE_COSTS = 'https://code.claude.com/docs/en/costs';
const CODEX_PRICING = 'https://learn.chatgpt.com/docs/pricing';
const CLAUDE_RATE_LIMITS = 'https://platform.claude.com/docs/en/api/rate-limits';

export const plans = {
  claude: {
    free: {
      price: fact(0, 'Claude Free costs nothing.', CLAUDE_PRICING, { unit: 'usd' }),
      claudeCode: fact(false, 'Claude Code is not included on the free Claude plan.', CLAUDE_PRICING),
      models: fact('Sonnet and Haiku', 'Claude Free includes Sonnet and Haiku but not Opus.', CLAUDE_PRICING),
    },
    pro: {
      price: fact(20, 'Claude Pro costs $20 a month billed monthly ($17 a month billed yearly).', CLAUDE_PRICING, { unit: 'usd' }),
      claudeCode: fact(true, 'Claude Code is included from Pro up.', CLAUDE_PRICING),
      fable: fact('usage credits', 'On Pro, Fable runs on pay-as-you-go usage credits from the start; it is outside the plan limits.', CLAUDE_FABLE),
      opus: fact(true, 'Pro adds Opus to the models Free includes.', CLAUDE_PRICING),
      surfaces: fact(
        ['Claude on web, desktop and mobile', 'Claude Code', 'Claude in Chrome'],
        'Pro includes Claude on the web, desktop and mobile, Claude in Chrome and Claude Code. Max and Ultra include everything in Pro.',
        CLAUDE_PRICING,
      ),
      apiCredit: fact(false, 'Pro includes no monthly API credit; Max and Ultra do.', CLAUDE_PRICING),
    },
    max: {
      price: fact(100, 'Claude Max costs $100 a month.', CLAUDE_PRICING, { unit: 'usd' }),
      usage: fact(5, 'Max gives 5× Pro usage every five hours and every week.', CLAUDE_PRICING, { unit: 'multiplier' }),
      fable: fact(50, 'On Max, up to 50% of the weekly limit can be spent on Fable at no extra cost; after that Fable continues on usage credits.', CLAUDE_FABLE, { unit: 'percent' }),
      apiCredit: fact(100, 'Max includes $100 a month of Claude API credit. It cannot be spent in interactive Claude Code, the Claude apps or on extra usage, and does not change plan limits.', CLAUDE_CREDITS, { unit: 'usd' }),
    },
    ultra: {
      price: fact(200, 'Claude Ultra costs $200 a month (web subscriptions; mobile prices may differ).', CLAUDE_ULTRA, { unit: 'usd' }),
      usage: fact(10, 'Ultra gives 10× Pro usage every week.', CLAUDE_ULTRA, { unit: 'multiplier' }),
      formerName: fact('Max 20x', 'The plan formerly called Max 20x is now Ultra, at the same price.', CLAUDE_ULTRA),
      noFiveHourLimit: fact(true, "Verified Ultra accounts don't have a five-hour limit. Unverified accounts have a temporary one until verification.", CLAUDE_ULTRA),
      fable: fact(50, 'On Ultra, as on Max, up to 50% of the weekly limit can be spent on Fable at no extra cost.', CLAUDE_FABLE, { unit: 'percent' }),
      apiCredit: fact(200, 'Ultra includes $200 a month of Claude API credit, with the same restrictions as on Max.', CLAUDE_CREDITS, { unit: 'usd' }),
    },
    limits: {
      fiveHour: fact('five hours', 'Claude plans have a five-hour limit: the period starts with your first message and the limit resets in full five hours later. Verified Ultra accounts have none.', CLAUDE_LIMITS),
      weekly: fact('weekly', 'Weekly limits apply across all models, and some plans also have a separate weekly limit for Fable. They reset at a fixed weekly time assigned to the account.', CLAUDE_LIMITS),
      sharedAcrossModels: fact(true, 'Session and weekly limits are shared across all models, so switching model with /model does not restore access.', CLAUDE_COSTS),
      usageCredits: fact('continue at API rates', 'With usage credits enabled, work continues on usage credits instead of stopping.', CLAUDE_LIMITS),
      whatUsageMeans: fact(
        'not published',
        'Anthropic publishes no dollar, token or message figure for a plan limit. How fast you use it depends on factors including which model you use.',
        CLAUDE_LIMITS,
      ),
      sharedAcrossSurfaces: fact(true, 'Usage on claude.ai, Claude Code and Claude Desktop counts towards the same usage limit.', CLAUDE_LIMITS),
      effort: fact('higher effort uses more', 'How fast you use a limit depends on the model and the effort level you select; higher effort uses more tokens, and tools and connectors are token-intensive.', CLAUDE_LIMITS),
      longConversations: fact('use more', 'Longer conversations that trigger automatic context management consume more of the usage limit.', CLAUDE_LIMITS),
      atTheLimit: fact('wait, upgrade or use credits', 'At a session or weekly limit you can wait for the reset or upgrade, and a new plan\'s limits apply right away. With usage credits enabled, work continues on credits instead of stopping.', CLAUDE_LIMITS),
      whereToSee: fact('Settings > Usage', 'Claude shows how much of the current session you have used and the time remaining under Settings > Usage.', CLAUDE_LIMITS),
      usageCommand: fact('/usage', 'In Claude Code, /usage shows plan usage bars and a breakdown of recent usage by skills, subagents, plugins and MCP servers; its dollar figure is for API users.', CLAUDE_COSTS),
      subagentsDraw: fact(true, 'Every subagent sends its own requests on top of the main conversation\'s, and they draw on the same plan usage.', CLAUDE_COSTS),
      wholeConversation: fact(
        'whole conversation each request',
        'Claude Code sends the full conversation with every request, so a one-line question in a session open all day still draws usage for the whole conversation.',
        CLAUDE_COSTS,
      ),
      windowHours: fact(5, 'The Claude session limit resets in full five hours after the first message of the period.', CLAUDE_LIMITS),
    },
    programmes: {
      aiForScience: fact('API credits', 'Anthropic runs AI for Science, which gives API credits to researchers.', 'https://support.claude.com/en/articles/11199177'),
      teamForPIs: fact('Team plan', 'A Team plan programme exists for verified principal investigators.', 'https://claude.com/programs/team-plan-for-scientists'),
      startupClosed: fact('2026-10-13', 'The Claude startup programme closed to new applications on 13 October 2026.', 'https://claude.com/programs/team-plan-for-scientists', { unit: 'date' }),
    },
    api: {
      rateLimits: fact(
        ['RPM', 'ITPM', 'OTPM'],
        'Claude API rate limits are measured in requests, input tokens and output tokens per minute, per model, and depend on the organisation\'s usage tier. Capacity refills continuously rather than at fixed times.',
        CLAUDE_RATE_LIMITS,
      ),
      cacheAwareLimits: fact(true, 'Cache reads do not count towards the Claude API input-token rate limit; uncached input and cache writes do.', CLAUDE_RATE_LIMITS),
      startSpendCap: fact(500, 'The Start usage tier of the Claude API carries a monthly spend cap of $500; Build is $1,000 and Scale $200,000.', CLAUDE_RATE_LIMITS, { unit: 'usd' }),
    },
  },
  chatgpt: {
    free: { price: fact(0, 'ChatGPT Free costs nothing and includes Codex.', CODEX_PRICING, { unit: 'usd' }) },
    go: { price: fact(8, 'ChatGPT Go costs $8 a month and includes Codex.', CODEX_PRICING, { unit: 'usd' }) },
    plus: {
      price: fact(20, 'ChatGPT Plus costs $20 a month and includes Codex.', CODEX_PRICING, { unit: 'usd' }),
      messages: {
        astra: fact('6–50', 'Estimated local Codex messages per five hours on Plus with GPT-6.2 Astra: 6 to 50.', CODEX_PRICING),
        sol: fact('17–180', 'Estimated local Codex messages per five hours on Plus with GPT-6.2 Sol: 17 to 180.', CODEX_PRICING),
        terra: fact('35–285', 'Estimated local Codex messages per five hours on Plus with GPT-6.1 Terra: 35 to 285.', CODEX_PRICING),
        luna: fact('350–3,000', 'Estimated local Codex messages per five hours on Plus with GPT-6 Luna: 350 to 3,000.', CODEX_PRICING),
      },
    },
    pro: {
      price: fact([100, 200, 500], 'ChatGPT Pro comes at $100, $200 or $500 a month.', CODEX_PRICING),
      noFiveHourLimit: fact(true, 'ChatGPT Pro plans currently have no five-hour limit.', CODEX_PRICING),
    },
    business: {
      price: fact(20, 'ChatGPT Business costs $20 per user a month billed yearly ($25 monthly), for two or more users.', CODEX_PRICING, { unit: 'usd' }),
    },
    limits: {
      estimates: fact('estimates', 'OpenAI publishes estimated message ranges per five hours for Plus and Business; they are estimates, not fixed limits, and weekly limits may also apply.', CODEX_PRICING),
      codexOnEveryPlan: fact(true, 'Codex is included on every ChatGPT plan, from Free up.', CODEX_PRICING),
      smallModelOnFree: unverified(
        'smallest model only',
        'On Free and Go, Codex offers only the smallest model.',
        CODEX_PRICING,
        'Not found on the pricing page when re-read on 2026-11-18.',
      ),
      proNoEstimates: fact('not published', 'OpenAI publishes no message estimates for the Pro plans at $100, $200 or $500.', CODEX_PRICING),
      cloudTasks: fact('use more', 'Codex cloud tasks may use more of the allowance than local messages.', CODEX_PRICING),
      atTheLimit: fact(
        'finish the turn, then credits',
        'If a Codex usage limit is reached during an active turn, the agent can finish that turn; Plus and Pro users can buy additional credits to keep working without upgrading.',
        CODEX_PRICING,
      ),
      apiKey: fact(true, 'Anyone can run extra local Codex chats with an API key, charged at standard API rates and outside the ChatGPT allowance.', CODEX_PRICING),
    },
  },
} as const;
