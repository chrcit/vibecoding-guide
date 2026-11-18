// Fig. 3, the window fills up: one thread working through the contact tidy, then a second task in
// the same thread, until the harness compacts it. The drawing and the readout both come from here.
//
// The token sizes of the steps are illustrative: a made-up session, sized the way such sessions
// run (instructions in the low tens of thousands, a prompt in the hundreds, a printed file in the
// hundreds of thousands). The window size and the compaction point are props from src/data/.

export type Kind = 'instructions' | 'prompt' | 'files' | 'output' | 'reply' | 'summary';

export interface WindowInputs {
  /** The context window, in tokens. */
  windowTokens: number;
  /** Where the harness compacts by default, in tokens. */
  compactAt: number;
}

export interface Block {
  kind: Kind;
  /** Illustrative size in tokens. */
  tokens: number;
}

export interface Step {
  /** Blocks this step adds. */
  adds: Block[];
  /** True for the compaction step: everything but the instructions is replaced. */
  compact?: boolean;
  says: (x: WindowInputs) => string;
}

export const KIND_NAME: Record<Kind, string> = {
  instructions: 'Instructions',
  prompt: 'Your prompt',
  files: 'Files read',
  output: 'Command output',
  reply: 'Replies',
  summary: 'Summary',
};

/** A thin layer is drawn at least this share of the window thick, so it can be seen at all. */
export const MIN_SHARE = 0.012;

export const STEPS: Step[] = [
  {
    adds: [{ kind: 'instructions', tokens: 15_000 }],
    says: () =>
      'A fresh thread. Before you type, the agent already holds its instructions: the harness’s own, your AGENTS.md, and the names of its tools and skills. About 15K tokens, a thin layer at the bottom.',
  },
  {
    adds: [{ kind: 'prompt', tokens: 300 }],
    says: () =>
      'You ask it to tidy contacts.csv: remove the duplicates, make the dates match, trim the stray spaces. The whole request is about 300 tokens, the thin orange line.',
  },
  {
    adds: [{ kind: 'files', tokens: 10_000 }],
    says: () => 'It reads its script and the first rows of the spreadsheet. About 10K tokens.',
  },
  {
    adds: [{ kind: 'output', tokens: 290_000 }],
    says: () =>
      'It runs the script, and the script prints all 25,000 cleaned rows. Every line it prints lands in the window: about 290K tokens in one go.',
  },
  {
    adds: [{ kind: 'reply', tokens: 6_000 }],
    says: () => 'It explains what it found and edits the script. About 6K tokens.',
  },
  {
    adds: [{ kind: 'output', tokens: 300_000 }],
    says: () => 'It runs the script again to check, and the whole file prints a second time. Another 300K.',
  },
  {
    adds: [{ kind: 'files', tokens: 60_000 }],
    says: () =>
      'Same thread, new task: you ask it to look at the club list app. It reads the app’s code, about 60K tokens, on top of everything from the spreadsheet.',
  },
  {
    adds: [{ kind: 'output', tokens: 290_000 }],
    says: (x) =>
      `It starts the app and runs the tests, and the full server log comes back. The window passes the mark at about ${tok(x.compactAt)}, where the harness compacts.`,
  },
  {
    adds: [
      { kind: 'files', tokens: 40_000 },
      { kind: 'summary', tokens: 8_000 },
    ],
    compact: true,
    says: () =>
      'Compaction. The harness reloads the instructions, reads the most recent files again, and swaps the whole conversation for a summary of a few thousand tokens. The window is nearly empty, and anything the summary left out is gone: the exact rows, what you said about date formats, why the first fix failed.',
  },
];

export interface Layer extends Block {
  /** Index of the step that added it. */
  step: number;
  /** Bottom and top as a share of the window, as drawn. */
  from: number;
  to: number;
}

/**
 * Every block that is ever in the window, with its drawn position. Positions are cumulative within
 * the run of blocks it sits on: blocks before compaction stack from the floor, and the blocks added
 * by the compaction step stack again on top of the instructions.
 */
export function layers(x: WindowInputs): Layer[] {
  const out: Layer[] = [];
  let at = 0;
  let base = 0;
  STEPS.forEach((s, step) => {
    if (s.compact) at = base;
    for (const b of s.adds) {
      const h = Math.max(b.tokens / x.windowTokens, MIN_SHARE);
      out.push({ ...b, step, from: at, to: at + h });
      at += h;
      if (b.kind === 'instructions') base = at;
    }
  });
  return out;
}

/** Which layers are in the window at a step. The instructions survive compaction. */
export function visibleAt(i: number, all: Layer[]): boolean[] {
  const compactStep = STEPS.findIndex((s) => s.compact);
  const compacted = compactStep >= 0 && i >= compactStep;
  return all.map((l) => l.step <= i && (!compacted || l.kind === 'instructions' || l.step >= compactStep));
}

export interface State {
  step: number;
  /** Tokens in the window. */
  tokens: number;
  /** Share of the window that is drawn full, 0 to 1. */
  drawn: number;
  /** Tokens by kind. */
  byKind: Partial<Record<Kind, number>>;
  /** The newest layer, the one to watch. */
  newest: number;
}

export function stateAt(i: number, x: WindowInputs): State {
  const all = layers(x);
  const on = visibleAt(i, all);
  const byKind: Partial<Record<Kind, number>> = {};
  let tokens = 0;
  let drawn = 0;
  all.forEach((l, j) => {
    if (!on[j]) return;
    tokens += l.tokens;
    drawn = Math.max(drawn, l.to);
    byKind[l.kind] = (byKind[l.kind] ?? 0) + l.tokens;
  });
  let newest = 0;
  all.forEach((l, j) => {
    if (on[j] && l.step === i) newest = j;
  });
  return { step: i, tokens, drawn, byKind, newest };
}

/** 290000 → 290K, 1000000 → 1M, 300 → 300. */
export function tok(n: number) {
  if (n >= 1e6) return `${Math.round((n / 1e6) * 10) / 10}M tokens`;
  if (n >= 1e3) return `${Math.round(n / 1e3)}K tokens`;
  return `${n} tokens`;
}

const pct = (v: number) => (v > 0 && v < 0.01 ? 'under 1%' : `${Math.round(v * 100)}%`);

export function describe(i: number, x: WindowInputs) {
  const s = stateAt(i, x);
  const step = STEPS[i]!;
  const out = s.byKind.output ?? 0;
  const prompt = s.byKind.prompt ?? 0;
  const total = `In the window: ${tok(s.tokens)} of ${tok(x.windowTokens)}, and every new turn sends all of it to the model again.`;
  const share =
    out > 0
      ? ` Command output is ${pct(out / s.tokens)} of it${prompt ? `; your prompt, ${pct(prompt / s.tokens)}` : ''}.`
      : '';
  return `${step.says(x)} ${total}${share}`;
}

/** Alt text: the first frame. */
export const ALT =
  'A tall empty glass container standing on a scale with a round dial. Above it, a press on two posts waits with its plate raised. A mark near the top of the glass shows where compaction happens. A thin layer, the agent’s instructions, lies on the floor of the glass.';
