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

export const plans = {
  claude: {
    free: {
      price: fact(0, 'Claude Free costs nothing.', CLAUDE_PRICING, { unit: 'usd' }),
      claudeCode: fact(false, 'Claude Code is not included on the free Claude plan.', CLAUDE_PRICING),
      models: fact(['Sonnet', 'Haiku'], 'Claude Free includes Sonnet and Haiku in the Claude apps, but not Opus or Fable, and not Claude Code.', CLAUDE_PRICING),
    },
    pro: {
      price: fact(20, 'Claude Pro costs $20 a month billed monthly ($17 a month billed yearly).', CLAUDE_PRICING, { unit: 'usd' }),
      claudeCode: fact(true, 'Claude Code is included from Pro up.', CLAUDE_PRICING),
      fable: fact('usage credits', 'On Pro, Fable runs on pay-as-you-go usage credits from the start; it is outside the plan limits.', CLAUDE_FABLE),
      models: fact(['Opus', 'Sonnet', 'Haiku'], 'Claude Pro includes Opus, Sonnet and Haiku within the plan limits.', CLAUDE_PRICING),
    },
    max: {
      price: fact(100, 'Claude Max costs $100 a month.', CLAUDE_PRICING, { unit: 'usd' }),
      usage: fact(5, 'Max gives 5× Pro usage every five hours and every week.', CLAUDE_PRICING, { unit: 'multiplier' }),
      fable: fact(50, 'On Max, up to 50% of the weekly limit can be spent on Fable at no extra cost; after that Fable continues on usage credits.', CLAUDE_FABLE, { unit: 'percent' }),
      apiCredit: fact(100, 'Max includes $100 a month of Claude API credit. It cannot be spent in interactive Claude Code, the Claude apps or on extra usage, and does not change plan limits.', CLAUDE_CREDITS, { unit: 'usd' }),
      models: fact(['Opus', 'Sonnet', 'Haiku'], 'Claude Max includes Opus, Sonnet and Haiku within the plan limits.', CLAUDE_PRICING),
    },
    ultra: {
      price: fact(200, 'Claude Ultra costs $200 a month (web subscriptions; mobile prices may differ).', CLAUDE_ULTRA, { unit: 'usd' }),
      usage: fact(10, 'Ultra gives 10× Pro usage every week.', CLAUDE_ULTRA, { unit: 'multiplier' }),
      formerName: fact('Max 20x', 'The plan formerly called Max 20x is now Ultra, at the same price.', CLAUDE_ULTRA),
      noFiveHourLimit: fact(true, "Verified Ultra accounts don't have a five-hour limit. Unverified accounts have a temporary one until verification.", CLAUDE_ULTRA),
      fable: fact(50, 'On Ultra, as on Max, up to 50% of the weekly limit can be spent on Fable at no extra cost.', CLAUDE_FABLE, { unit: 'percent' }),
      apiCredit: fact(200, 'Ultra includes $200 a month of Claude API credit, with the same restrictions as on Max.', CLAUDE_CREDITS, { unit: 'usd' }),
      models: fact(['Opus', 'Sonnet', 'Haiku'], 'Claude Ultra includes Opus, Sonnet and Haiku within the plan limits.', CLAUDE_PRICING),
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
    },
    programmes: {
      aiForScience: fact('API credits', 'Anthropic runs AI for Science, which gives API credits to researchers.', 'https://support.claude.com/en/articles/11199177'),
      teamForPIs: fact('Team plan', 'A Team plan programme exists for verified principal investigators.', 'https://claude.com/programs/team-plan-for-scientists'),
      startupClosed: fact('2026-10-13', 'The Claude startup programme closed to new applications on 13 October 2026.', 'https://claude.com/programs/team-plan-for-scientists', { unit: 'date' }),
    },
  },
  chatgpt: {
    free: {
      price: fact(0, 'ChatGPT Free costs nothing and includes Codex.', CODEX_PRICING, { unit: 'usd' }),
      luna: fact('desktop app', 'On ChatGPT Free and Go, GPT-6 Luna is available in the Codex desktop app.', 'https://learn.chatgpt.com/docs/models'),
    },
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
    },
  },
} as const;
