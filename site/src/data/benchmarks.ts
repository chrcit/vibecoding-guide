// Benchmark numbers: the Artificial Analysis Intelligence Index and METR time
// horizons. Each entry names the page it came from and the day it was read.
// Artificial Analysis requires a visible credit wherever its data is shown.
// There is no API key yet; refresh by hand (see UPDATE.md at the repo root).
import { fact, unverified, type Fact } from './types.ts';

const AA = 'https://artificialanalysis.ai';
const AA_BOARD = 'https://artificialanalysis.ai/leaderboards/models';
const AA_OPUS = 'https://artificialanalysis.ai/models/claude-opus-5-5';
const AA_FABLE = 'https://artificialanalysis.ai/models/claude-fable-5-2';
const AA_METHOD = 'https://artificialanalysis.ai/methodology/intelligence-benchmarking';
const AA_GPT62 = 'https://artificialanalysis.ai/articles/openai-has-the-2-model-in-the-intelligence-index-with-the-release-of-gpt-6-2-astra-and-gpt-6-2-sol';
const METR = 'https://metr.org/time-horizons/';
const METR_FILE = 'https://metr.org/assets/benchmark_results_1_1.yaml';

const ROUNDED = 'The leaderboard shows whole numbers; the decimal is from the model page read the same day.';

const score = (name: string, v: number, effort: string, source = AA_BOARD, note = ROUNDED): Fact<number> =>
  fact(v, `${name} scores ${v} on the Artificial Analysis Intelligence Index at ${effort} effort.`, source, { note });

export const benchmarks = {
  aa: {
    attribution: fact(
      'credit required',
      'Artificial Analysis requires visible attribution wherever its data is displayed or shared; a byline or footer link is enough.',
      'https://artificialanalysis.ai/data-api/docs',
    ),
    freeApi: fact(
      100,
      'The Artificial Analysis free API allows 100 requests per 24-hour window.',
      'https://artificialanalysis.ai/data-api/docs',
    ),
    selfDescription: fact(
      'the independent benchmarking company for AI',
      'Artificial Analysis describes itself as "the independent benchmarking company for AI".',
      `${AA}/about`,
    ),
    caveat: fact(
      'may not apply directly to every use case',
      'Artificial Analysis says of its index that it "may not apply directly to every use case".',
      AA_METHOD,
    ),
    method: fact(
      9,
      'Version 5 of the Intelligence Index combines 9 evaluations in four equally weighted groups: knowledge work, coding, science, general.',
      AA_METHOD,
    ),
    index: {
      'claude-fable-5-2': score('Claude Fable 5.2', 64.6, 'max'),
      'gpt-6-2-astra': score('GPT-6.2 Astra', 62.1, 'max', AA_GPT62),
      'gemini-4-carbon': score('Gemini 4 Carbon', 60.0, 'high'),
      'claude-opus-5-5': score('Claude Opus 5.5', 59.1, 'max'),
      'gpt-6-2-sol': score('GPT-6.2 Sol', 57.3, 'max', AA_GPT62),
      'claude-sonnet-5-5': fact(55, 'Claude Sonnet 5.5 scores 55 on the Artificial Analysis Intelligence Index at max effort.', AA_BOARD),
      'gpt-6-1-terra': score('GPT-6.1 Terra', 51.3, 'max'),
      'claude-haiku-5-5': score('Claude Haiku 5.5', 36.5, 'max'),
      'gpt-6-luna': score('GPT-6 Luna', 27.9, 'max'),
    },
    opusByEffort: {
      low: {
        score: score('Claude Opus 5.5', 34.8, 'low', AA_OPUS, 'The model page shows 35.'),
        totalTokens: fact(21.1e6, 'Claude Opus 5.5 at low effort wrote 21.1M output tokens over the whole index run.', AA_OPUS, { unit: 'tokens' }),
        tokensPerTask: unverified(19_100, 'Claude Opus 5.5 at low effort writes about 19.1k output tokens per index task.', AA_OPUS, 'Could not be re-read on 2026-11-18; the page now gives a 21.1M total for low, which does not match.', { unit: 'tokens' }),
        costPerTask: unverified(0.98, 'Claude Opus 5.5 at low effort costs $0.98 per index task.', AA_OPUS, 'The page gives a per-task cost only for max.', { unit: 'usd' }),
      },
      medium: {
        score: score('Claude Opus 5.5', 48.2, 'medium', AA_OPUS, 'The model page shows 48.'),
        totalTokens: fact(42.5e6, 'Claude Opus 5.5 at medium effort wrote 42.5M output tokens over the whole index run.', AA_OPUS, { unit: 'tokens' }),
        tokensPerTask: unverified(43_800, 'Claude Opus 5.5 at medium effort writes about 43.8k output tokens per index task.', AA_OPUS, 'Not shown per task on the page on 2026-11-18.', { unit: 'tokens' }),
        costPerTask: unverified(2.45, 'Claude Opus 5.5 at medium effort costs $2.45 per index task.', AA_OPUS, 'The page gives a per-task cost only for max.', { unit: 'usd' }),
      },
      high: {
        score: score('Claude Opus 5.5', 51.8, 'high', AA_OPUS, 'The model page shows 52.'),
        totalTokens: fact(56.1e6, 'Claude Opus 5.5 at high effort wrote 56.1M output tokens over the whole index run.', AA_OPUS, { unit: 'tokens' }),
        tokensPerTask: unverified(60_100, 'Claude Opus 5.5 at high effort writes about 60.1k output tokens per index task.', AA_OPUS, 'Not shown per task on the page on 2026-11-18.', { unit: 'tokens' }),
        costPerTask: unverified(3.46, 'Claude Opus 5.5 at high effort costs $3.46 per index task.', AA_OPUS, 'The page gives a per-task cost only for max.', { unit: 'usd' }),
      },
      xhigh: {
        score: score('Claude Opus 5.5', 57.4, 'xhigh', AA_OPUS, 'The model page shows 57.'),
        totalTokens: fact(101e6, 'Claude Opus 5.5 at xhigh effort wrote 101M output tokens over the whole index run.', AA_OPUS, { unit: 'tokens' }),
        tokensPerTask: unverified(103_400, 'Claude Opus 5.5 at xhigh effort writes about 103.4k output tokens per index task.', AA_OPUS, 'Not shown per task on the page on 2026-11-18.', { unit: 'tokens' }),
        costPerTask: unverified(6.05, 'Claude Opus 5.5 at xhigh effort costs $6.05 per index task.', AA_OPUS, 'The page gives a per-task cost only for max.', { unit: 'usd' }),
        indexCost: unverified(4766, 'Running the whole index on Claude Opus 5.5 at xhigh costs $4,766.', AA_OPUS, 'Not shown on the page on 2026-11-18.', { unit: 'usd' }),
      },
      max: {
        score: score('Claude Opus 5.5', 59.1, 'max', AA_OPUS, 'The model page shows 59.'),
        totalTokens: fact(218e6, 'Claude Opus 5.5 at max effort wrote 218M output tokens over the whole index run.', AA_OPUS, { unit: 'tokens' }),
        tokensPerTask: unverified(173_300, 'Claude Opus 5.5 at max effort writes about 173.3k output tokens per index task.', AA_OPUS, 'Not shown per task on the page on 2026-11-18.', { unit: 'tokens' }),
        costPerTask: fact(10.04, 'Claude Opus 5.5 at max effort costs $10.04 per index task.', AA_OPUS, { unit: 'usd' }),
        indexCost: unverified(8910, 'Running the whole index on Claude Opus 5.5 at max costs $8,910.', AA_OPUS, 'Not shown on the page on 2026-11-18.', { unit: 'usd' }),
      },
    },
    fableByEffort: {
      medium: score('Claude Fable 5.2', 56.4, 'medium', AA_FABLE, 'Read from the model page.'),
      high: score('Claude Fable 5.2', 61.8, 'high', AA_FABLE, 'Read from the model page.'),
      xhigh: score('Claude Fable 5.2', 62.2, 'xhigh', AA_FABLE, 'Read from the model page.'),
      max: score('Claude Fable 5.2', 64.6, 'max', AA_FABLE, 'Read from the model page.'),
    },
  },
  metr: {
    definition: fact(
      'human time',
      "METR's time horizon is the length of task, measured by how long it takes a human expert, at which a model is predicted to succeed with a given reliability. It is not how long the agent runs.",
      METR,
    ),
    doublingDays: fact(128.7, 'Since 2023 the 50% time horizon has doubled every 128.7 days (95% interval 104 to 158), excluding estimates above 16 hours.', METR_FILE, { unit: 'days' }),
    unreliableAbove: fact(16 * 60, 'METR calls measurements above 16 hours unreliable with its current task suite.', METR, { unit: 'minutes' }),
    lastUpdate: fact('2026-09-08', 'METR no longer actively updates the time-horizons page; its last update was on 8 September 2026.', METR, { unit: 'date' }),
    /** 50% horizons of models METR marks state of the art, in minutes of human task time, with 95% intervals. */
    p50: metrPoints(),
    p80: {
      'claude-opus-4-5': fact(49.4, 'At 80% reliability the horizon of Claude Opus 4.5 is 49 minutes.', METR_FILE, { unit: 'minutes' }),
      'gpt-5-2': fact(66.0, 'At 80% reliability the horizon of GPT-5.2 is 66 minutes.', METR_FILE, { unit: 'minutes' }),
      'claude-opus-4-6': fact(69.9, 'At 80% reliability the horizon of Claude Opus 4.6 is 70 minutes.', METR_FILE, { unit: 'minutes' }),
      'claude-mythos-preview': fact(185.9, 'At 80% reliability the horizon of Claude Mythos Preview is 186 minutes.', METR_FILE, { unit: 'minutes' }),
    },
  },
} as const;

export interface HorizonPoint {
  name: string;
  released: string;
  /** Minutes of human task time. */
  minutes: Fact<number>;
  low: number;
  high: number;
}

function metrPoints() {
  const p = (name: string, released: string, minutes: number, low: number, high: number): HorizonPoint => ({
    name,
    released,
    minutes: fact(minutes, `${name} (released ${released}) has a 50% time horizon of ${minutes} minutes of human task time (95% interval ${low} to ${high}).`, METR_FILE, { unit: 'minutes' }),
    low,
    high,
  });
  return {
    'gpt-2': p('GPT-2', '2019-02-14', 0.054, 0.01, 0.142),
    'gpt-3': p('GPT-3', '2020-05-28', 0.144, 0.093, 0.221),
    'gpt-3-5': p('GPT-3.5', '2022-03-15', 0.599, 0.255, 1.116),
    'gpt-4': p('GPT-4', '2023-03-14', 3.987, 1.933, 7.995),
    'gpt-4o': p('GPT-4o', '2024-05-13', 6.991, 4.001, 12.906),
    'claude-3-5-sonnet': p('Claude 3.5 Sonnet', '2024-06-20', 11.395, 5.49, 22.384),
    'o1-preview': p('o1-preview', '2024-09-12', 20.327, 11.716, 33.38),
    o1: p('o1', '2024-12-05', 38.832, 21.165, 64.952),
    'claude-3-7-sonnet': p('Claude 3.7 Sonnet', '2025-02-24', 60.389, 33.006, 104.226),
    o3: p('o3', '2025-04-16', 119.733, 74.615, 190.944),
    'gpt-5': p('GPT-5', '2025-08-07', 203.013, 112.641, 405.552),
    'claude-opus-4-5': p('Claude Opus 4.5', '2025-11-24', 292.995, 161.718, 623.705),
    'gpt-5-2': p('GPT-5.2', '2025-12-11', 352.249, 198.067, 815.177),
    'claude-opus-4-6': p('Claude Opus 4.6', '2026-02-05', 718.807, 316.686, 3633.786),
    'claude-mythos-preview': p('Claude Mythos Preview', '2026-04-07', 1044.78, 508.877, 3304.261),
  };
}
