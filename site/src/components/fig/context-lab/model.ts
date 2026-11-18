// Fig. 3, the context lab: a window the reader fills. Pure: the page passes the sourced numbers
// (window sizes, compaction point, prices, skill sizes) in as a `Facts` object built with fact(),
// and everything below that is an assumption is a named constant with a comment. The long read
// lists the same constants under "How the model works" (explain/context/read/#how-the-model-works).

// ---------- assumptions (illustrative, not sourced) ----------

/** The harness's own system prompt and built-in tool definitions, before anything of yours. */
export const HARNESS_TOKENS = 16_000;
/** One line of an instruction file. A short Markdown line is about ten to fifteen tokens. */
export const TOKENS_PER_LINE = 12;
/** Tools a connector (an MCP server) offers. Real servers range from one tool to dozens. */
export const TOOLS_PER_CONNECTOR = 10;
/** One tool definition loaded up front: a name, a description and a JSON schema. */
export const TOKENS_PER_TOOL = 450;
/** One tool while its definition is deferred: the name, plus a share of the server's instructions. */
export const TOKENS_PER_DEFERRED_TOOL = 30;
/** A skill body the agent has loaded. The standard asks for under 5,000 tokens; most are smaller. */
export const SKILL_BODY_TOKENS = 3_000;
/** One source file the agent has read in full, about 300 lines of code. */
export const FILE_TOKENS = 3_000;
/** Turns in an hour of steady work: a message from you or a step of the agent's loop. */
export const TURNS_PER_HOUR = 25;
/** Your message and the agent's reply in one turn, tool results apart. */
export const MESSAGE_TOKENS = 1_000;
/** What one turn's tool results add, by how the agent is told to run things. */
export const RESULT_TOKENS = { trimmed: 400, typical: 2_500, whole: 12_000 } as const;
/** The summary that replaces the conversation at compaction. */
export const SUMMARY_TOKENS = 6_000;
/** Where a harness without a published compaction point compacts, as a share of its window. Taken from Claude Code's. */
export const DEFAULT_COMPACT_SHARE = 0.967;

// ---------- inputs ----------

export type Results = keyof typeof RESULT_TOKENS;

export interface ModelInfo {
  id: string;
  name: string;
  /** The window this harness gives the model, in tokens. */
  window: number;
  /** Where it compacts, in tokens. */
  compactAt: number;
  /** Claude Code: skill listing capped, files re-read after compaction. */
  claudeCode: boolean;
  /** Per million tokens. */
  input?: number;
  cacheRead?: number;
  /** Above this prompt length a model may charge more (Haiku). */
  longAbove?: number;
  longInput?: number;
}

export interface Facts {
  models: ModelInfo[];
  /** Tokens per skill name and description at startup (Agent Skills standard). */
  skillMeta: number;
  /** Claude Code's skill listing budget, as a share of the window. */
  skillBudget: number;
  /** Files Claude Code re-reads after compaction. */
  reread: number;
  /** The line count Anthropic suggests a CLAUDE.md stays under. */
  lineAdvice: number;
}

export interface LabState {
  model: string;
  /** Lines in the instruction file. */
  lines: number;
  connectors: number;
  /** Tool definitions loaded up front rather than on demand. */
  upfront: boolean;
  /** Skills installed: only their names and descriptions load. */
  skills: number;
  /** Skills loaded in full during the task. */
  loaded: number;
  /** Files the agent has read. */
  files: number;
  /** Minutes of conversation so far. */
  minutes: number;
  results: Results;
}

export const LIMITS = {
  lines: [0, 2000],
  connectors: [0, 40],
  skills: [0, 150],
  loaded: [0, 6],
  files: [0, 100],
  minutes: [0, 240],
} as const;

export const PRESETS: { id: string; name: string; state: Omit<LabState, 'model'> }[] = [
  { id: 'fresh', name: 'Fresh thread', state: { lines: 60, connectors: 2, upfront: false, skills: 10, loaded: 0, files: 0, minutes: 0, results: 'typical' } },
  { id: 'kept', name: 'Well-kept project', state: { lines: 120, connectors: 3, upfront: false, skills: 15, loaded: 1, files: 12, minutes: 40, results: 'trimmed' } },
  { id: 'afternoon', name: 'All afternoon', state: { lines: 120, connectors: 3, upfront: false, skills: 15, loaded: 3, files: 60, minutes: 240, results: 'whole' } },
  { id: 'everything', name: 'Everything on', state: { lines: 2000, connectors: 40, upfront: true, skills: 150, loaded: 6, files: 100, minutes: 240, results: 'whole' } },
];

// ---------- the parts of a window ----------

export type Part = 'harness' | 'file' | 'tools' | 'skills' | 'summary' | 'files' | 'loaded' | 'talk' | 'results';
/** Bottom to top, the order a harness builds a request in. */
export const PARTS: Part[] = ['harness', 'tools', 'file', 'skills', 'summary', 'files', 'loaded', 'talk', 'results'];
export const FIXED: Part[] = ['harness', 'tools', 'file', 'skills'];
export const PART_NAME: Record<Part, string> = {
  harness: 'Harness',
  file: 'Instruction file',
  tools: 'Tool definitions',
  skills: 'Skill descriptions',
  summary: 'Summary',
  files: 'Files read',
  loaded: 'Skills loaded',
  talk: 'Conversation',
  results: 'Tool results',
};

export type Amounts = Record<Part, number>;
const zero = (): Amounts => ({ harness: 0, file: 0, tools: 0, skills: 0, summary: 0, files: 0, loaded: 0, talk: 0, results: 0 });

export interface Lab {
  m: ModelInfo;
  /** What is in the window now. */
  now: Amounts;
  /** What fell out at the last compaction, or what would if it compacted now. */
  lost: Amounts;
  /** True when `lost` is what did fall out. */
  compacted: boolean;
  compactions: number;
  /** Before the first word of the task. */
  fixed: number;
  total: number;
  turns: number;
  perTurn: number;
  /** Turns until the next compaction; 0 when it compacts on every turn. */
  toGo: number;
  /** The instructions alone pass the compaction point. */
  fullAtStart: boolean;
  /** It compacts on every turn: no room for a turn after the summary. */
  thrash: boolean;
  /** Skill descriptions dropped because the listing budget overflowed (Claude Code). */
  skillsCut: boolean;
}

export const model = (f: Facts, id: string) => f.models.find((m) => m.id === id) ?? f.models[0]!;

export function run(f: Facts, s: LabState): Lab {
  const m = model(f, s.model);
  const now = zero();
  now.harness = HARNESS_TOKENS;
  now.file = s.lines * TOKENS_PER_LINE;
  now.tools = s.connectors * TOOLS_PER_CONNECTOR * (s.upfront ? TOKENS_PER_TOOL : TOKENS_PER_DEFERRED_TOOL);
  const listing = s.skills * f.skillMeta;
  const budget = m.window * f.skillBudget;
  const skillsCut = m.claudeCode && listing > budget;
  now.skills = skillsCut ? budget : listing;
  const fixed = FIXED.reduce((a, p) => a + now[p], 0);

  const turns = Math.round((s.minutes / 60) * TURNS_PER_HOUR);
  const perTurn = MESSAGE_TOKENS + RESULT_TOKENS[s.results];
  const reread = m.claudeCode ? Math.min(s.files, f.reread) * FILE_TOKENS : 0;

  // The agent reads its files and loads its skills early, then works turn by turn.
  now.files = s.files * FILE_TOKENS;
  now.loaded = s.loaded * SKILL_BODY_TOKENS;
  let lost = zero();
  let compactions = 0;
  const work = () => now.summary + now.files + now.loaded + now.talk + now.results;
  const compact = () => {
    lost = zero();
    lost.files = Math.max(0, now.files - reread);
    lost.loaded = now.loaded;
    lost.talk = now.talk;
    lost.results = now.results;
    lost.summary = now.summary;
    now.summary = SUMMARY_TOKENS;
    now.files = Math.min(now.files, reread);
    now.loaded = 0;
    now.talk = 0;
    now.results = 0;
    compactions++;
  };
  const fullAtStart = fixed >= m.compactAt;
  if (!fullAtStart) {
    if (fixed + work() >= m.compactAt) compact();
    for (let t = 0; t < turns; t++) {
      now.talk += MESSAGE_TOKENS;
      now.results += RESULT_TOKENS[s.results];
      if (fixed + work() >= m.compactAt) compact();
    }
  }
  const total = fixed + work();
  const thrash = !fullAtStart && fixed + SUMMARY_TOKENS + reread + perTurn >= m.compactAt;
  const toGo = fullAtStart || thrash ? 0 : Math.max(0, Math.ceil((m.compactAt - total) / perTurn));
  const compacted = compactions > 0;
  if (!compacted) {
    // What a compaction now would throw away.
    lost.files = Math.max(0, now.files - reread);
    lost.loaded = now.loaded;
    lost.talk = now.talk;
    lost.results = now.results;
  }
  return { m, now, lost, compacted, compactions, fixed, total, turns, perTurn, toGo, fullAtStart, thrash, skillsCut };
}

export const sum = (a: Amounts) => PARTS.reduce((t, p) => t + a[p], 0);

// ---------- money ----------

/** The cost of sending the whole window once, at list price per million tokens. */
export function turnCost(l: Lab): { full?: number; cached?: number } {
  const m = l.m;
  if (m.input === undefined) return {};
  const long = m.longAbove !== undefined && l.total > m.longAbove;
  const price = long && m.longInput !== undefined ? m.longInput : m.input;
  const full = (l.total * price) / 1e6;
  // Cached: everything but this turn's new tokens is read from the cache.
  const cached = m.cacheRead !== undefined && !long ? ((l.total - l.perTurn) * m.cacheRead + l.perTurn * price) / 1e6 : undefined;
  return { full, cached };
}

// ---------- words ----------

/** 290000 → 290K, 1000000 → 1M, 300 → 300. */
export function k(n: number) {
  if (n >= 999_500) return `${(Math.round(n / 1e5) / 10).toString()}M`;
  if (n >= 10_000) return `${Math.round(n / 1e3)}K`;
  if (n >= 1_000) return `${(Math.round(n / 100) / 10).toString()}K`;
  return `${Math.round(n)}`;
}
export const pct = (v: number) => (v > 0 && v < 0.005 ? '<1%' : `${Math.round(v * 100)}%`);
export function usd(v: number) {
  if (v < 0.01) return '<$0.01';
  if (v < 10) return `$${v.toFixed(2)}`;
  return `$${Math.round(v)}`;
}

const biggest = (a: Amounts, parts: Part[]) => parts.reduce((b, p) => (a[p] > a[b] ? p : b), parts[0]!);

/** The sentence under the lab. Plain text with <b> for the number to look at. */
export function finding(l: Lab): string {
  const share = l.fixed / l.m.window;
  if (l.fullAtStart)
    return `The instructions alone pass the compaction point: <b>${pct(share)}</b> of the window is gone before the task starts, and there is no room to work.`;
  if (l.thrash)
    return `After each compaction the summary and the instructions leave less than one turn of room, so it <b>compacts on every turn</b>.`;
  const big = biggest(l.now, FIXED);
  if (l.compacted) {
    const lostBig = biggest(l.lost, ['files', 'talk', 'results']);
    return `It has compacted <b>${l.compactions === 1 ? 'once' : `${l.compactions} times`}</b>. The last time, ${k(sum(l.lost))} tokens, mostly ${PART_NAME[lostBig].toLowerCase()}, became a ${k(SUMMARY_TOKENS)} summary.`;
  }
  if (share >= 0.1)
    return `<b>${pct(share)}</b> of the window is gone before your first word, most of it ${PART_NAME[big].toLowerCase()}.`;
  if (l.turns === 0) return `A fresh thread: <b>${k(l.fixed)}</b> tokens of instructions and descriptions, ${pct(share)} of the window.`;
  return `After ${l.turns} turns the window holds <b>${k(l.total)}</b> tokens, and every turn sends all of it again.`;
}

export const ALT =
  'A tall bar, the context window, filled from the bottom: a band for the harness, thin bands for tool definitions, the instruction file and skill descriptions, then files read, conversation and tool results. A dashed line near the top marks where it compacts. Beside it, a second bar shows what a compaction would throw away.';
