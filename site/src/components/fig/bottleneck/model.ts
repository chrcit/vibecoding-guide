// Fig. 6, you are the bottleneck. A small discrete-event simulation of one person supervising
// several agent threads for three hours: each thread needs you for a prompt, runs on its own,
// then waits for you to review the result. You serve them in the order they finish.
// The timings are a worked example, stated in the caption, not measurements.

export const SESSION = 180; // minutes
export const RUN = 20; // one agent run, minutes
export const REVIEW = 4; // reading one result, minutes
export const PROMPT = 2; // writing the next prompt, minutes
export const MAX_AGENTS = 8;

export interface State {
  agents: number;
  /** Results you reviewed in the session. */
  reviewed: number;
  /** Share of the session you were busy, 0 to 1. */
  busy: number;
  /** Share of all agent time spent finished and waiting for you, 0 to 1. */
  waiting: number;
  /** On average, how many finished results are waiting for you at any moment. */
  queue: number;
}

export function simulate(agents: number): State {
  const lanes = Array.from({ length: agents }, () => ({ ready: 0, first: true }));
  let free = 0, reviewed = 0, busy = 0, waited = 0;
  for (;;) {
    let t = lanes[0]!;
    for (const l of lanes) if (l.ready < t.ready) t = l;
    const start = Math.max(free, t.ready);
    if (start >= SESSION) break;
    const service = t.first ? PROMPT : REVIEW + PROMPT;
    if (!t.first) waited += start - t.ready;
    const end = Math.min(start + service, SESSION);
    busy += end - start;
    if (!t.first && start + REVIEW <= SESSION) reviewed++;
    t.first = false;
    free = start + service;
    t.ready = free + RUN;
  }
  for (const l of lanes) if (!l.first && l.ready < SESSION) waited += SESSION - l.ready;
  const waiting = waited / (agents * SESSION);
  return { agents, reviewed, busy: busy / SESSION, waiting, queue: waited / SESSION };
}

/** How many agents one person can keep busy before results start to queue. */
export const SATURATION = (RUN + REVIEW + PROMPT) / (REVIEW + PROMPT);

const pct = (v: number) => `${Math.round(v * 100)}%`;
const agentsWord = (n: number) => `${n} agent${n === 1 ? '' : 's'}`;

export function describe(s: State) {
  const head = `${agentsWord(s.agents)}: you review ${s.reviewed} results in three hours and are busy ${pct(s.busy)} of the time.`;
  if (s.agents === 1) return `${head} The rest of the time you watch one agent work.`;
  if (s.agents < SATURATION - 0.5) return `${head} Finished work rarely waits, so another agent still adds output.`;
  if (s.agents <= SATURATION + 0.5) return `${head} This is about the limit: past it, finished work starts to queue in front of you.`;
  const q = Math.max(1, Math.round(s.queue));
  return `${head} On average ${q} finished result${q === 1 ? ' waits' : 's wait'} for you, and the agents sit idle ${pct(s.waiting)} of their time. More agents now lengthen the queue; the number you review stays put.`;
}

/** Agents whose finished work is waiting for you, as the drawing shows it. */
export const waitingAgents = (s: State) => Math.min(s.agents, Math.round(s.waiting * s.agents));

/** For each agent, its place in the queue on the counter, or -1. The front-most running belts wait first. */
export const queueSlots = (agents: number, waiting: number) =>
  Array.from({ length: MAX_AGENTS }, (_, i) => (i < agents && i >= agents - waiting ? agents - 1 - i : -1));
