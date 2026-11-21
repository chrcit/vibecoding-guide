// The home board's miniatures: one small model per explainer, each showing that page's central
// idea with one control. They are deliberately simpler than the full boards, so they cannot
// contradict them. Every number below is an assumption made for the picture; the long read lists
// them under "How the model works". Sourced values arrive as arguments from src/data/.

// ---------- Context: every turn takes room ----------

/** Share of the window taken before you type (instructions, tool list, skill descriptions). */
export const CTX_STARTUP = 0.12;
/** Share of the window one turn of conversation takes, with the files and output it brings. */
export const CTX_TURN = 0.035;
/** Share a compacted summary keeps. */
export const CTX_SUMMARY = 0.14;
export const CTX_MAX_TURNS = 60;

/** How full the window is after `turns` turns, and how many times it was compacted. */
export function contextAfter(turns: number) {
  let used = CTX_STARTUP, compactions = 0, since = 0;
  for (let t = 0; t < turns; t++) {
    if (used + CTX_TURN > 1) {
      compactions += 1;
      used = CTX_STARTUP + CTX_SUMMARY;
      since = 0;
    }
    used += CTX_TURN;
    since += 1;
  }
  return { used, compactions, since };
}

// ---------- Plans and the API: a plan runs dry, a meter runs on ----------

/** Hours of steady work one usage window covers on an entry plan, for the picture. */
export const PLAN_HOURS_PER_WINDOW = 3;
/** Length of a usage window in hours; the label beside it reads the sourced fact. */
export const WINDOW_HOURS = 5;
export const PLAN_MAX_HOURS = 12;

/** After `hours` of trying to work: hours worked, hours spent waiting, what is left in the tank. */
export function planAfter(hours: number) {
  let worked = 0, waited = 0, left = 1;
  for (let h = 0; h < hours; h += 0.25) {
    if (h > 0 && Math.abs(h % WINDOW_HOURS) < 1e-9) left = 1; // the window resets
    if (left > 1e-9) {
      worked += 0.25;
      left = Math.max(0, left - 0.25 / PLAN_HOURS_PER_WINDOW);
    } else waited += 0.25;
  }
  return { worked, waited, left };
}

// ---------- Orchestration: more agents, a longer queue at your desk ----------

/** Minutes an agent takes to finish one piece of work. */
export const AGENT_MINUTES = 20;
/** Minutes you take to review one. */
export const REVIEW_MINUTES = 10;
/** The session the picture covers, in hours. */
export const SESSION_HOURS = 2;
export const MAX_AGENTS = 16;

export function queueAfter(agents: number) {
  const arrived = Math.floor((agents * SESSION_HOURS * 60) / AGENT_MINUTES);
  const reviewed = Math.min(arrived, Math.floor((SESSION_HOURS * 60) / REVIEW_MINUTES));
  return { arrived, reviewed, waiting: arrived - reviewed };
}

// ---------- Checking the work: each judge catches different mistakes ----------

export type Judge = 'none' | 'test' | 'browser' | 'you';
export const JUDGES: { id: Judge; name: string }[] = [
  { id: 'none', name: 'Nobody' },
  { id: 'test', name: 'A test' },
  { id: 'browser', name: 'A browser' },
  { id: 'you', name: 'You' },
];
/** Three mistakes in the holiday hours fix, and who can see each. */
export const MISTAKES: { name: string; caughtBy: Judge[] }[] = [
  { name: 'Open on 25 December', caughtBy: ['test', 'browser', 'you'] },
  { name: 'Hours cut off on a phone', caughtBy: ['browser', 'you'] },
  { name: 'You meant 24 December too', caughtBy: ['you'] },
];

// ---------- Skills: a skill loads when the task matches ----------

export type Task = 'club' | 'bakery' | 'contacts';
export const TASKS: { id: Task; name: string }[] = [
  { id: 'club', name: 'Club list' },
  { id: 'bakery', name: 'Holiday hours' },
  { id: 'contacts', name: 'Contact tidy' },
];
/** Four fictional skills on the shelf, and the task each one matches. */
export const SKILLS: { name: string; for?: Task }[] = [
  { name: 'design', for: 'club' },
  { name: 'tests', for: 'bakery' },
  { name: 'csv', for: 'contacts' },
  { name: 'deploy' },
];

// ---------- Connectors: each one adds tools ----------

export const CONNECTORS: { id: string; name: string; tools: number }[] = [
  { id: 'issues', name: 'Issues', tools: 3 },
  { id: 'database', name: 'Database', tools: 2 },
  { id: 'browser', name: 'Browser', tools: 4 },
];
/** Tools the harness has before any connector: read, edit, run. */
export const BUILT_IN_TOOLS = 3;

// ---------- Voice: speaking carries more words ----------

/** Words typed in the picture's run; speech gets this times the sourced multiplier. */
export const TYPED_WORDS = 8;
/** Length of the animation, in ms. */
export const VOICE_MS = 3200;
