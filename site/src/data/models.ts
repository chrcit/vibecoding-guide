// Models: release dates, context windows, API list prices, effort levels and
// the pages that describe each one. Shaped for the model card pages to come:
// one entry per model, keyed by a stable slug.
import { fact, unverified, type Fact } from './types.ts';

const CLAUDE_PRICING = 'https://platform.claude.com/docs/en/about-claude/pricing';
const CLAUDE_OVERVIEW = 'https://platform.claude.com/docs/en/models/overview';
const CLAUDE_EFFORT = 'https://platform.claude.com/docs/en/build-with-claude/effort';
const OPENAI_PRICING = 'https://developers.openai.com/api/docs/pricing';
const OPENAI_MODELS = 'https://learn.chatgpt.com/docs/models';

export interface ModelLinks {
  docs?: string;
  announcement?: string;
  systemCard?: string;
}

export interface Model {
  name: string;
  lab: 'Anthropic' | 'OpenAI' | 'Google';
  /** The id you pass to the API. */
  apiId?: string;
  links: ModelLinks;
  released?: Fact<string>;
  context?: Fact<number>;
  maxOutput?: Fact<number>;
  /** Per million tokens, standard tier. */
  price?: {
    input: Fact<number>;
    output: Fact<number>;
    cacheRead?: Fact<number>;
    /** Prices for prompts above a threshold, where a model has them. */
    longPrompt?: { threshold: Fact<number>; input: Fact<number>; output: Fact<number> };
    /** Fast mode, where offered. */
    fast?: { input: Fact<number>; output: Fact<number> };
  };
  effort?: {
    levels: Fact<string[]>;
    apiDefault?: Fact<string>;
  };
  thinking?: Fact<string>;
}

const claudeLevels = (name: string) =>
  fact(['low', 'medium', 'high', 'xhigh', 'max'], `${name} accepts the effort levels low, medium, high, xhigh and max.`, CLAUDE_EFFORT);

const docs = (slug: string) => `https://platform.claude.com/docs/en/models/${slug}/overview`;

export const models = {
  'claude-fable-5-2': {
    name: 'Claude Fable 5.2',
    lab: 'Anthropic',
    apiId: 'claude-fable-5-2',
    links: { docs: docs('fable-5-2'), announcement: 'https://www.anthropic.com/claude-fable-and-mythos-5-2' },
    released: fact('2026-11-09', 'Claude Fable 5.2 was released on 9 November 2026.', docs('fable-5-2'), { unit: 'date' }),
    context: fact(1_000_000, 'Claude Fable 5.2 has a 1M-token context window.', CLAUDE_OVERVIEW, { unit: 'tokens' }),
    maxOutput: fact(128_000, 'Claude Fable 5.2 writes at most 128K tokens per response.', CLAUDE_OVERVIEW, { unit: 'tokens' }),
    price: {
      input: fact(8, 'Claude Fable 5.2 costs $8 per million input tokens.', CLAUDE_PRICING, { unit: 'usd' }),
      output: fact(40, 'Claude Fable 5.2 costs $40 per million output tokens.', CLAUDE_PRICING, { unit: 'usd' }),
      cacheRead: fact(0.2, 'Cache reads on Claude Fable 5.2 cost $0.20 per million tokens.', CLAUDE_PRICING, { unit: 'usd' }),
    },
    effort: {
      levels: claudeLevels('Claude Fable 5.2'),
      apiDefault: fact('high', 'The API default effort for Claude Fable 5.2 is high.', CLAUDE_OVERVIEW),
    },
    thinking: fact('adaptive, always on', 'On Claude Fable 5.2 thinking is adaptive and always on: the model decides how much to think and effort steers it.', CLAUDE_OVERVIEW),
  },
  'claude-opus-5-5': {
    name: 'Claude Opus 5.5',
    lab: 'Anthropic',
    apiId: 'claude-opus-5-5',
    links: {
      docs: docs('opus-5-5'),
      announcement: 'https://www.anthropic.com/claude-opus-5-5',
      systemCard: 'https://www.anthropic.com/claude-opus-5-5-system-card',
    },
    released: fact('2026-09-22', 'Claude Opus 5.5 was released on 22 September 2026.', docs('opus-5-5'), { unit: 'date' }),
    context: fact(1_000_000, 'Claude Opus 5.5 has a 1M-token context window.', CLAUDE_OVERVIEW, { unit: 'tokens' }),
    maxOutput: fact(128_000, 'Claude Opus 5.5 writes at most 128K tokens per response.', CLAUDE_OVERVIEW, { unit: 'tokens' }),
    price: {
      input: fact(4, 'Claude Opus 5.5 costs $4 per million input tokens.', CLAUDE_PRICING, { unit: 'usd' }),
      output: fact(20, 'Claude Opus 5.5 costs $20 per million output tokens.', CLAUDE_PRICING, { unit: 'usd' }),
      cacheRead: fact(0.2, 'Cache reads on Claude Opus 5.5 cost $0.20 per million tokens.', CLAUDE_PRICING, { unit: 'usd' }),
      fast: {
        input: fact(8, 'Fast mode on Claude Opus 5.5 costs $8 per million input tokens.', CLAUDE_PRICING, { unit: 'usd' }),
        output: fact(40, 'Fast mode on Claude Opus 5.5 costs $40 per million output tokens.', CLAUDE_PRICING, { unit: 'usd' }),
      },
    },
    effort: {
      levels: claudeLevels('Claude Opus 5.5'),
      apiDefault: fact('medium', 'The API default effort for Claude Opus 5.5 is medium.', CLAUDE_OVERVIEW),
    },
    thinking: fact('adaptive, always on', 'On Claude Opus 5.5 thinking is adaptive and always on: the model decides how much to think and effort steers it.', CLAUDE_OVERVIEW),
  },
  'claude-sonnet-5-5': {
    name: 'Claude Sonnet 5.5',
    lab: 'Anthropic',
    apiId: 'claude-sonnet-5-5',
    links: { docs: docs('sonnet-5-5'), announcement: 'https://www.anthropic.com/claude-sonnet-5-5' },
    released: fact('2026-09-28', 'Claude Sonnet 5.5 was released on 28 September 2026.', docs('sonnet-5-5'), { unit: 'date' }),
    context: fact(1_000_000, 'Claude Sonnet 5.5 has a 1M-token context window.', CLAUDE_OVERVIEW, { unit: 'tokens' }),
    maxOutput: fact(128_000, 'Claude Sonnet 5.5 writes at most 128K tokens per response.', CLAUDE_OVERVIEW, { unit: 'tokens' }),
    price: {
      input: fact(2, 'Claude Sonnet 5.5 costs $2 per million input tokens.', CLAUDE_PRICING, { unit: 'usd' }),
      output: fact(10, 'Claude Sonnet 5.5 costs $10 per million output tokens.', CLAUDE_PRICING, { unit: 'usd' }),
      cacheRead: fact(0.1, 'Cache reads on Claude Sonnet 5.5 cost $0.10 per million tokens.', CLAUDE_PRICING, { unit: 'usd' }),
    },
    effort: {
      levels: claudeLevels('Claude Sonnet 5.5'),
      apiDefault: fact('high', 'The API default effort for Claude Sonnet 5.5 is high.', CLAUDE_OVERVIEW),
    },
    thinking: fact('adaptive', 'Claude Sonnet 5.5 uses adaptive thinking.', CLAUDE_OVERVIEW),
  },
  'claude-haiku-5-5': {
    name: 'Claude Haiku 5.5',
    lab: 'Anthropic',
    apiId: 'claude-haiku-5-5',
    links: { docs: docs('haiku-5-5'), announcement: 'https://www.anthropic.com/claude-haiku-5-5' },
    released: fact('2026-10-07', 'Claude Haiku 5.5 was released on 7 October 2026.', docs('haiku-5-5'), { unit: 'date' }),
    context: fact(1_000_000, 'Claude Haiku 5.5 has a 1M-token context window.', CLAUDE_OVERVIEW, { unit: 'tokens' }),
    maxOutput: fact(128_000, 'Claude Haiku 5.5 writes at most 128K tokens per response.', CLAUDE_OVERVIEW, { unit: 'tokens' }),
    price: {
      input: fact(0.1, 'Claude Haiku 5.5 costs $0.10 per million input tokens for prompts up to 100,000 tokens.', CLAUDE_PRICING, { unit: 'usd' }),
      output: fact(0.5, 'Claude Haiku 5.5 costs $0.50 per million output tokens for prompts up to 100,000 tokens.', CLAUDE_PRICING, { unit: 'usd' }),
      cacheRead: fact(0.01, 'Cache reads on Claude Haiku 5.5 cost $0.01 per million tokens for prompts up to 100,000 tokens.', CLAUDE_PRICING, { unit: 'usd' }),
      longPrompt: {
        threshold: fact(100_000, 'Claude Haiku 5.5 is priced by prompt length: prompts over 100,000 tokens pay higher prices, counting cache reads and writes.', CLAUDE_PRICING, { unit: 'tokens' }),
        input: fact(0.5, 'Claude Haiku 5.5 costs $0.50 per million input tokens for prompts over 100,000 tokens.', CLAUDE_PRICING, { unit: 'usd' }),
        output: fact(2.5, 'Claude Haiku 5.5 costs $2.50 per million output tokens for prompts over 100,000 tokens.', CLAUDE_PRICING, { unit: 'usd' }),
      },
    },
    effort: {
      levels: claudeLevels('Claude Haiku 5.5'),
      apiDefault: fact('medium', 'The API default effort for Claude Haiku 5.5 is medium.', CLAUDE_OVERVIEW),
    },
    thinking: fact('adaptive', 'Claude Haiku 5.5 uses adaptive thinking.', CLAUDE_OVERVIEW),
  },
  'gpt-6-2-astra': {
    name: 'GPT-6.2 Astra',
    lab: 'OpenAI',
    links: { docs: OPENAI_MODELS },
    released: unverified('2026-11-17', 'GPT-6.2 Astra was released on 17 November 2026.', OPENAI_MODELS, 'The OpenAI models page no longer shows release dates. Artificial Analysis covered the release on this date.', { unit: 'date' }),
    context: fact(1_000_000, 'GPT-6.2 Astra supports a context window of up to 1M tokens; Codex uses 272,000 by default.', OPENAI_MODELS, { unit: 'tokens' }),
    price: {
      input: fact(8, 'GPT-6.2 Astra costs $8 per million input tokens (standard tier, up to 272K input tokens).', OPENAI_PRICING, { unit: 'usd' }),
      output: fact(40, 'GPT-6.2 Astra costs $40 per million output tokens (standard tier, up to 272K input tokens).', OPENAI_PRICING, { unit: 'usd' }),
    },
  },
  'gpt-6-2-sol': {
    name: 'GPT-6.2 Sol',
    lab: 'OpenAI',
    links: { docs: OPENAI_MODELS },
    released: unverified('2026-11-17', 'GPT-6.2 Sol was released on 17 November 2026.', OPENAI_MODELS, 'The OpenAI models page no longer shows release dates.', { unit: 'date' }),
    context: fact(1_000_000, 'GPT-6.2 Sol supports a context window of up to 1M tokens; Codex uses 500,000 by default.', OPENAI_MODELS, { unit: 'tokens' }),
    price: {
      input: fact(2, 'GPT-6.2 Sol costs $2 per million input tokens.', OPENAI_PRICING, { unit: 'usd' }),
      output: fact(10, 'GPT-6.2 Sol costs $10 per million output tokens.', OPENAI_PRICING, { unit: 'usd' }),
    },
  },
  'gpt-6-1-terra': {
    name: 'GPT-6.1 Terra',
    lab: 'OpenAI',
    links: { docs: OPENAI_MODELS },
    released: unverified('2026-10-26', 'GPT-6.1 Terra was released on 26 October 2026.', OPENAI_MODELS, 'The OpenAI models page no longer shows release dates.', { unit: 'date' }),
    price: {
      input: fact(1, 'GPT-6.1 Terra costs $1 per million input tokens.', OPENAI_PRICING, { unit: 'usd' }),
      output: fact(5, 'GPT-6.1 Terra costs $5 per million output tokens.', OPENAI_PRICING, { unit: 'usd' }),
    },
  },
  'gpt-6-luna': {
    name: 'GPT-6 Luna',
    lab: 'OpenAI',
    links: { docs: OPENAI_MODELS },
    released: unverified('2026-09-22', 'GPT-6 Luna was released on 22 September 2026.', OPENAI_MODELS, 'The OpenAI models page no longer shows release dates.', { unit: 'date' }),
    price: {
      input: fact(0.1, 'GPT-6 Luna costs $0.10 per million input tokens.', OPENAI_PRICING, { unit: 'usd' }),
      output: fact(0.5, 'GPT-6 Luna costs $0.50 per million output tokens.', OPENAI_PRICING, { unit: 'usd' }),
    },
    effort: {
      levels: fact(['low', 'medium', 'high', 'extra high', 'max'], 'GPT-6 Luna supports reasoning effort up to max, but not ultra.', OPENAI_MODELS),
    },
  },
  'gpt-5-5': {
    name: 'GPT-5.5',
    lab: 'OpenAI',
    links: {},
    price: {
      input: fact(5, 'GPT-5.5 (April 2026) costs $5 per million input tokens.', OPENAI_PRICING, { unit: 'usd' }),
      output: fact(30, 'GPT-5.5 (April 2026) costs $30 per million output tokens.', OPENAI_PRICING, { unit: 'usd' }),
    },
  },
  'gpt-5-1': {
    name: 'GPT-5.1',
    lab: 'OpenAI',
    links: {},
    price: {
      input: fact(1.25, 'GPT-5.1, the OpenAI flagship of November 2025, costs $1.25 per million input tokens.', OPENAI_PRICING, { unit: 'usd' }),
      output: fact(10, 'GPT-5.1 costs $10 per million output tokens.', OPENAI_PRICING, { unit: 'usd' }),
    },
  },
} satisfies Record<string, Model>;

/** Lab-wide facts that are not about one model. */
export const lineup = {
  anthropicAdvice: fact(
    'Start with Opus 5.5; use Fable 5.2 when Opus at higher effort still falls short.',
    "Anthropic's own advice: start with Claude Opus 5.5 for most workloads, and use Fable 5.2 for demanding reasoning and long-horizon agentic work, or when evals on Opus 5.5 at higher effort still fall short.",
    CLAUDE_OVERVIEW,
  ),
  claudeOutputRatio: fact(5, 'Output tokens cost five times input tokens on every current Claude model.', CLAUDE_PRICING, { unit: 'multiplier' }),
  thinkingBilledAsOutput: fact(
    'billed as output',
    'Thinking tokens are billed as output tokens, including when the text is not shown. On current models you see a summary at most.',
    'https://platform.claude.com/docs/en/build-with-claude/thinking',
  ),
  workedExampleOutputShare: fact(
    60,
    "Anthropic's worked example (an Opus 5.5 session with 50,000 input and 15,000 output tokens) comes to 60% output by cost.",
    CLAUDE_PRICING,
    { unit: 'percent', note: '50k × $4 = $0.20 input, 15k × $20 = $0.30 output.' },
  ),
  batchDiscount: fact(50, 'Batch API requests are 50% off on Claude models.', CLAUDE_OVERVIEW, { unit: 'percent' }),
  codexEffortLevels: fact(
    ['low', 'medium', 'high', 'extra high', 'max', 'ultra'],
    'Codex offers reasoning effort low (called light in the app), medium, high, extra high, and on some models max and ultra. Ultra uses subagents.',
    OPENAI_MODELS,
  ),
} as const;
