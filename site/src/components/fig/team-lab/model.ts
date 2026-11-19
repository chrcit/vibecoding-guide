// Fig. 30, the orchestration lab. One job, split into pieces, done by a team of agents and one
// person, simulated minute by minute under six ways of organising the team. The timeline, the
// numbers and the sentence under the drawing all read from `simulate()`.
//
// This is an illustrative model, not a measurement. Every number below that is not a control is
// an assumption, named here with a comment, and listed in the long read under "How the model
// works" (explain/orchestration/read/#model). No prices, limits or product facts live in this file.
// Randomness is replaced by fixed low-discrepancy sequences, so the same settings always give the
// same run and a rate of 0.2 gives one piece in five.

export type PatternId = 'solo' | 'review' | 'plan' | 'parallel' | 'lead' | 'best';
export type ModelClass = 'large' | 'middle' | 'small';
export type Role = 'planner' | 'lead' | 'builder' | 'reviewer';

export interface Settings {
  pattern: PatternId;
  /** Builders, 1 to 16. One agent ignores it; two models needs at least 2. */
  agents: number;
  /** How separable the work is: 0 tangled (one chain), 1 independent pieces. */
  separable: number;
  /** Size of the job in pieces of PIECE_MIN minutes each, 1 to 64. */
  pieces: number;
  /** Minutes the person takes to review one result. */
  review: number;
  planner: ModelClass;
  builder: ModelClass;
  reviewer: ModelClass;
}

// ---------- assumptions ----------

/** Minutes a middle-class agent takes to build one piece. Sets the time scale. */
export const PIECE_MIN = 30;
/** Time multiplier per class. Larger models are slower per piece, smaller ones faster. */
export const SPEED: Record<ModelClass, number> = { large: 1.4, middle: 1, small: 0.5 };
/** Chance that one build of a piece has a mistake in it, per class. */
export const MISTAKE: Record<ModelClass, number> = { large: 0.1, middle: 0.18, small: 0.35 };
/** Chance that a plan gets one piece's brief wrong, per class of planner or lead. */
export const PLAN_MISS: Record<ModelClass, number> = { large: 0.04, middle: 0.1, small: 0.4 };
/** Chance that an agent reviewer catches a mistake, per class. */
export const CATCH: Record<ModelClass, number> = { large: 0.75, middle: 0.6, small: 0.35 };
/** Multiplier on an agent reviewer's catch rate when it is the same class as the builder:
 *  the same model shares the builder's blind spots. */
export const SAME_MODEL = 0.5;
/** Multiplier on an agent reviewer's catch rate for a wrong brief: it checks against the plan. */
export const PLAN_CATCH = 0.4;
/** Multiplier on the lead's catch rate: it reads the subagent's summary, not the change. */
export const SUMMARY_CATCH = 0.5;
/** The most the person catches, however long they look at one result. */
export const PERSON_MAX = 0.9;
/** Minutes of review at which the person catches about two thirds of PERSON_MAX. The longer
 *  you look at a result, the more you catch: catch = PERSON_MAX × (1 − e^(−minutes / PERSON_PACE)). */
export const PERSON_PACE = 6;
/** Multiplier on the person's catch rate inside one large combined result. */
export const BIG_DIFF = 0.6;
/** Multiplier on the person's catch rate for a wrong brief when reading the plan, before it is built. */
export const PLAN_READ = 0.5;
/** A redo is this share of a build, in time and tokens, and makes mistakes at this share of the rate. */
export const REDO = 0.5;
/** Minutes an agent reviewer spends on one piece, before its class multiplier. */
export const AGENT_REVIEW_MIN = 6;
/** Minutes a planner or lead spends per piece on the plan, before its class multiplier. */
export const PLAN_MIN = 3;
/** Minutes the lead spends reading one subagent's report, before its class multiplier. */
export const LEAD_CHECK_MIN = 2;
/** Minutes a subagent spends getting started: reading the brief and the code it needs. */
export const SPAWN_MIN = 2;
/** Minutes the person spends writing one brief. */
export const PROMPT_MIN = 2;
/** Extra minutes the person spends sorting out one conflict when nobody else coordinates. */
export const MERGE_MIN = 8;
/** Comparing two results takes this many times one review. */
export const COMPARE = 1.6;
/** Chance that a piece's change collides with another piece in flight, on fully tangled work
 *  with three or more other pieces in flight. Scales with tangle and with the pieces in flight. */
export const OVERLAP = 0.5;
/** How tangle limits the pieces that can run at once: K pieces allow K^(CHAIN_FLOOR + (1 − CHAIN_FLOOR) × separable)
 *  at a time, so even tangled work has a few parts that can move together. */
export const CHAIN_FLOOR = 0.3;
/** A plan or a lead that divides the work halves the collisions. */
export const COORDINATED = 0.5;
// Tokens, in units of one piece built once.
/** A redo, in build units. */
export const T_REDO = REDO;
/** An agent review of one piece. */
export const T_REVIEW = 0.25;
/** Planning one piece. */
export const T_PLAN = 0.1;
/** The lead reading one report. */
export const T_CHECK = 0.05;
/** Every fresh context: system prompt, tools and reading enough code to start. A thread pays it
 *  once; a subagent pays it at every spawn. */
export const T_START = 0.6;
/** Tokens in one build unit, for turning units into money on the cost tile. */
export const UNIT_TOKENS = 150_000;
/** Share of those tokens that are output, for the same purpose. */
export const OUTPUT_SHARE = 0.1;
/** The run stops here, in minutes, whatever happens. */
const LIMIT = 60 * 200;

// ---------- the patterns ----------

export interface Pattern {
  id: PatternId;
  name: string;
  /** Which model-class controls apply. */
  uses: { planner: boolean; reviewer: boolean; agents: boolean };
}

export const PATTERNS: Pattern[] = [
  { id: 'solo', name: 'One agent', uses: { planner: false, reviewer: false, agents: false } },
  { id: 'review', name: 'Build, then review', uses: { planner: false, reviewer: true, agents: true } },
  { id: 'plan', name: 'Plan, build, review', uses: { planner: true, reviewer: true, agents: true } },
  { id: 'parallel', name: 'Parallel worktrees', uses: { planner: false, reviewer: false, agents: true } },
  { id: 'lead', name: 'Lead and subagents', uses: { planner: true, reviewer: false, agents: true } },
  { id: 'best', name: 'Two models, keep one', uses: { planner: false, reviewer: false, agents: true } },
];
export const pattern = (id: PatternId) => PATTERNS.find((p) => p.id === id)!;

export const CLASSES: { id: ModelClass; name: string }[] = [
  { id: 'large', name: 'Large' },
  { id: 'middle', name: 'Middle' },
  { id: 'small', name: 'Small' },
];

// ---------- the run ----------

export type Kind = 'work' | 'redo' | 'check' | 'plan' | 'wait' | 'blocked';
export type YouKind = 'brief' | 'review' | 'merge';
export interface Seg<K> { s: number; e: number; k: K }
export interface Lane { group: 'planner' | 'lead' | 'builders' | 'reviewer'; segs: Seg<Kind>[] }

export interface Stats {
  /** Minutes until the last piece is accepted. */
  finish: number;
  /** Minutes the person was busy. */
  you: number;
  /** Agent-minutes spent waiting for the person. */
  waiting: number;
  /** Agent-minutes spent blocked on another agent. */
  blocked: number;
  /** Agent-minutes spent redoing. */
  redoing: number;
  /** Token units, and the same relative to one agent alone. */
  tokens: number;
  tokensVsSolo: number;
  conflicts: number;
  /** Expected pieces that reach the end with a mistake nobody caught, and the share of that from the plan. */
  through: number;
  throughPlan: number;
  pieces: number;
  /** Pieces that can run at once. */
  chains: number;
  /** Finish time of one agent alone on the same job. */
  soloFinish: number;
}

export interface Run {
  settings: Settings;
  lanes: Lane[];
  you: Seg<YouKind>[];
  stats: Stats;
  /** Token units by role. */
  byRole: Record<Role, number>;
}

interface Piece {
  i: number;
  pred: number;
  state: 'todo' | 'queued' | 'active' | 'built' | 'checked' | 'done';
  defect: boolean;
  planMiss: boolean;
  conflict: boolean;
  builds: number;
  owner: number;
  /** Already shown to the person in the lead's combined hand-over. */
  shown: boolean;
  /** Expected chance that a build mistake / a wrong brief is still in the piece. The timeline
   *  follows one run; the count of mistakes that get through is this expectation, so it moves
   *  smoothly with the controls. */
  rd: number;
  rm: number;
}
interface Task { kind: 'work' | 'redo' | 'check' | 'plan'; left: number; done: () => void }
interface Agent {
  id: number;
  role: Role;
  cls: ModelClass;
  group: Lane['group'];
  task: Task | null;
  inbox: Task[];
  hold: 'wait' | 'blocked' | null;
  /** Something of this agent's is with the person. */
  awaiting: boolean;
  fresh: boolean;
  trace: (Kind | null)[];
}
interface Job { kind: YouKind; left: number; done: () => void }

const frac = (v: number) => v - Math.floor(v);
const G1 = 0.6180339887, G2 = 0.7548776662;
/** The n-th draw of a stream, in [0, 1). Streams differ by salt. */
const draw = (n: number, salt: number) => frac(0.5 + n * G1 + salt * G2);
const dur = (m: number) => Math.max(1, Math.round(m));

export const chainsFor = (pieces: number, separable: number) =>
  Math.max(1, Math.min(pieces, Math.round(Math.pow(pieces, CHAIN_FLOOR + (1 - CHAIN_FLOOR) * Math.max(0, Math.min(1, separable))))));

/** The person's chance of catching a mistake in a result they look at for `minutes`. */
export const personCatch = (minutes: number) => PERSON_MAX * (1 - Math.exp(-Math.max(0, minutes) / PERSON_PACE));

export function simulate(input: Settings, withSolo = true): Run {
  const s: Settings = { ...input, agents: Math.round(input.agents), pieces: Math.round(input.pieces) };
  const P = s.pattern;
  const nBuilders = P === 'solo' ? 1 : P === 'best' ? Math.max(2, s.agents - (s.agents % 2)) : Math.max(1, s.agents);
  const K = Math.max(1, s.pieces);
  const chains = chainsFor(K, s.separable);
  const tangle = 1 - Math.max(0, Math.min(1, s.separable));
  const coordinated = P === 'plan' || P === 'lead';
  const threadLike = P === 'solo' || P === 'parallel' || P === 'best';
  const catchYou = personCatch(s.review);
  /** Comparing two results, the person spends COMPARE reviews on both together. */
  const catchPair = personCatch((s.review * COMPARE) / 2);

  const pieces: Piece[] = Array.from({ length: K }, (_, i) => ({
    i, pred: i - chains, state: 'todo', defect: false, planMiss: false, conflict: false, builds: 0, owner: -1, shown: false, rd: 0, rm: 0,
  }));

  const byRole: Record<Role, number> = { planner: 0, lead: 0, builder: 0, reviewer: 0 };
  const agents: Agent[] = [];
  const add = (role: Role, cls: ModelClass, group: Lane['group']) => {
    const a: Agent = { id: agents.length, role, cls, group, task: null, inbox: [], hold: null, awaiting: false, fresh: true, trace: [] };
    agents.push(a);
    return a;
  };
  const head = P === 'plan' ? add('planner', s.planner, 'planner') : P === 'lead' ? add('lead', s.planner, 'lead') : null;
  const builders = Array.from({ length: nBuilders }, () => add('builder', s.builder, 'builders'));
  const reviewer = P === 'review' || P === 'plan' ? add('reviewer', s.reviewer, 'reviewer') : null;

  const queue: Job[] = [];
  let job: Job | null = null;
  const youTrace: (YouKind | null)[] = [];
  const you = (kind: YouKind, minutes: number, done: () => void) => queue.push({ kind, left: dur(minutes), done });

  let nBuild = 0, nCheck = 0, nConflict = 0, conflicts = 0;
  /** Charge tokens to a role, plus a fresh context's start-up cost the first time. */
  const spend = (a: Agent, units: number) => {
    byRole[a.role] += units + (a.fresh ? T_START : 0);
    a.fresh = false;
  };

  const ready = (p: Piece) => p.pred < 0 || (threadLike ? pieces[p.pred]!.state === 'done' : pieces[p.pred]!.state === 'checked' || pieces[p.pred]!.state === 'done');
  const nextPiece = () => pieces.find((p) => p.state === 'todo' && ready(p));
  const anyTodo = () => pieces.some((p) => p.state === 'todo');
  const inFlight = () => pieces.filter((p) => p.state === 'active').length;

  /** Did this check catch something? Clears what it caught; returns true if a redo is needed. */
  const check = (p: Piece, rate: number, planRate: number) => {
    p.rd *= 1 - rate;
    p.rm *= 1 - planRate;
    let caught = false;
    if (p.defect && draw(nCheck++, 2) < rate) { p.defect = false; caught = true; }
    if (p.planMiss && draw(nCheck++, 3) < planRate) { p.planMiss = false; caught = true; }
    if (p.conflict) { p.conflict = false; caught = true; }
    return caught;
  };
  const agentRate = (cls: ModelClass) => CATCH[cls] * (cls === s.builder ? SAME_MODEL : 1);

  // A build of piece p by agent a. When it finishes, `after` routes the result.
  const build = (a: Agent, p: Piece, redo: boolean, after: () => void): Task => {
    const minutes = PIECE_MIN * SPEED[a.cls] * (redo ? REDO : 1) + (P === 'lead' ? SPAWN_MIN : 0);
    return {
      kind: redo ? 'redo' : 'work',
      left: dur(minutes),
      done: () => {
        spend(a, redo ? T_REDO : 1);
        p.builds++;
        p.owner = a.id;
        const rate = MISTAKE[a.cls] * (redo ? REDO : 1);
        if (draw(nBuild++, 1) < rate) p.defect = true;
        p.rd = redo ? 1 - (1 - p.rd) * (1 - rate) : rate;
        const others = inFlight() - (p.state === 'active' ? 1 : 0);
        const chance = tangle * OVERLAP * Math.min(1, others / 3) * (coordinated ? COORDINATED : 1);
        if (others > 0 && draw(nConflict++, 4) < chance) { p.conflict = true; conflicts++; }
        after();
      },
    };
  };

  // ----- thread patterns: one agent, parallel worktrees -----
  const threadReview = (a: Agent, p: Piece) => {
    p.state = 'built';
    a.awaiting = true;
    you('review', s.review + (p.conflict ? MERGE_MIN : 0), () => {
      a.awaiting = false;
      if (check(p, catchYou, catchYou)) {
        p.state = 'active';
        a.inbox.push(build(a, p, true, () => threadReview(a, p)));
      } else p.state = 'done';
    });
  };
  const pullThread = (a: Agent): Task | null => {
    if (a.awaiting) { a.hold = 'wait'; return null; }
    const p = nextPiece();
    if (!p) { a.hold = anyTodo() ? 'blocked' : null; return null; }
    p.state = 'active';
    a.awaiting = true;
    a.hold = 'wait';
    you('brief', PROMPT_MIN, () => {
      a.awaiting = false;
      a.inbox.push(build(a, p, false, () => (P === 'review' ? toReviewer(a, p) : threadReview(a, p))));
    });
    return null;
  };

  // ----- build, then review; plan, build, review -----
  const reviewQueue: Piece[] = [];
  const toReviewer = (_a: Agent, p: Piece) => { p.state = 'built'; reviewQueue.push(p); };
  const toPerson = (p: Piece) => {
    you('review', s.review + (P === 'review' && p.conflict ? MERGE_MIN : 0), () => {
      if (check(p, catchYou, catchYou)) {
        p.state = 'active';
        const b = agents[p.owner]!;
        b.inbox.push(build(b, p, true, () => toReviewer(b, p)));
      } else p.state = 'done';
    });
  };
  const pullReviewer = (a: Agent): Task | null => {
    const p = reviewQueue.shift();
    if (!p) { a.hold = null; return null; }
    return {
      kind: 'check',
      left: dur(AGENT_REVIEW_MIN * SPEED[a.cls]),
      done: () => {
        spend(a, T_REVIEW);
        const rate = agentRate(a.cls);
        if (check(p, rate, rate * PLAN_CATCH)) {
          p.state = 'active';
          const b = agents[p.owner]!;
          b.inbox.push(build(b, p, true, () => toReviewer(b, p)));
        } else {
          p.state = 'checked';
          toPerson(p);
        }
      },
    };
  };

  // ----- plans: the planner or the lead writes one, which sets plan misses -----
  let planned = false;
  let briefed = false;
  const planTask = (a: Agent, then: () => void): Task => ({
    kind: 'plan',
    left: dur(PLAN_MIN * K * SPEED[a.cls]),
    done: () => {
      spend(a, T_PLAN * K);
      pieces.forEach((p) => { p.planMiss = draw(p.i, 5) < PLAN_MISS[a.cls]; p.rm = PLAN_MISS[a.cls]; });
      then();
    },
  });
  const pullPlanner = (a: Agent): Task | null => {
    if (a.awaiting) { a.hold = 'wait'; return null; }
    if (!briefed) {
      briefed = true;
      a.awaiting = true;
      a.hold = 'wait';
      you('brief', PROMPT_MIN, () => {
        a.awaiting = false;
        a.inbox.push(planTask(a, () => {
          if (P === 'plan') {
            a.awaiting = true;
            you('review', s.review, () => {
              a.awaiting = false;
              planned = true;
              for (const p of pieces) {
                p.rm *= 1 - catchYou * PLAN_READ;
                if (p.planMiss && draw(nCheck++, 7) < catchYou * PLAN_READ) p.planMiss = false;
              }
            });
          } else planned = true;
        }));
      });
      return null;
    }
    a.hold = null;
    return null;
  };
  const pullPlanBuilder = (a: Agent): Task | null => {
    if (!planned) { a.hold = 'blocked'; return null; }
    const p = nextPiece();
    if (!p) { a.hold = anyTodo() ? 'blocked' : null; return null; }
    p.state = 'active';
    return build(a, p, false, () => toReviewer(a, p));
  };

  // ----- lead and subagents -----
  const leadQueue: Piece[] = [];
  const redoQueue: Piece[] = [];
  let handedOver = false;
  const pullLead = (a: Agent): Task | null => {
    if (!planned) return pullPlanner(a);
    const p = leadQueue.shift();
    if (p) {
      return {
        kind: 'check',
        left: dur(LEAD_CHECK_MIN * SPEED[a.cls]),
        done: () => {
          spend(a, T_CHECK);
          const rate = agentRate(a.cls) * SUMMARY_CATCH;
          if (check(p, rate, rate * PLAN_CATCH)) { p.state = 'queued'; redoQueue.push(p); }
          else p.state = 'checked';
        },
      };
    }
    if (handedOver) { a.hold = 'wait'; return null; }
    const open = pieces.filter((q) => q.state !== 'done');
    if (open.length && open.every((q) => q.state === 'checked')) {
      handedOver = true;
      a.hold = 'wait';
      const first = open.every((q) => !q.shown);
      you('review', s.review * open.length, () => {
        handedOver = false;
        for (const q of open) {
          const rate = catchYou * (first && open.length > 1 ? BIG_DIFF : 1);
          q.shown = true;
          if (check(q, rate, rate)) { q.state = 'queued'; redoQueue.push(q); }
          else q.state = 'done';
        }
      });
      return null;
    }
    a.hold = null;
    return null;
  };
  const pullSub = (a: Agent): Task | null => {
    if (!planned) { a.hold = null; return null; }
    const redo = redoQueue.shift();
    if (redo) {
      redo.state = 'active';
      a.fresh = true;
      return build(a, redo, true, () => { redo.state = 'built'; leadQueue.push(redo); });
    }
    const p = nextPiece();
    if (!p) { a.hold = anyTodo() ? 'blocked' : null; return null; }
    p.state = 'active';
    a.fresh = true;
    return build(a, p, false, () => { p.state = 'built'; leadQueue.push(p); });
  };

  // ----- two models, keep one -----
  interface Pair { a: Agent; b: Agent; awaiting: boolean; piece: Piece | null; got: number; defA: boolean; defB: boolean; single: boolean }
  const pairs: Pair[] = [];
  if (P === 'best') for (let i = 0; i + 1 < builders.length; i += 2) pairs.push({ a: builders[i]!, b: builders[i + 1]!, awaiting: false, piece: null, got: 0, defA: false, defB: false, single: false });
  const pairOf = (x: Agent) => pairs.find((q) => q.a === x || q.b === x)!;
  const compare = (q: Pair) => {
    const p = q.piece!;
    q.awaiting = true;
    you('review', s.review * (q.single ? 1 : COMPARE) + (p.conflict ? MERGE_MIN : 0), () => {
      q.awaiting = false;
      const conflict = p.conflict;
      p.conflict = false;
      if (q.single) p.rd *= 1 - catchYou;
      else {
        const r = MISTAKE[s.builder], pick = catchPair + (1 - catchPair) / 2;
        p.rd = r * r * (1 - catchPair) + 2 * r * (1 - r) * (1 - pick);
      }
      // Both flawed: the person may catch it and ask for a redo. One flawed: the person keeps the
      // clean one if they spot the difference, otherwise picks at random.
      let defect = q.single ? q.defA : q.defA && q.defB;
      if (!q.single && q.defA !== q.defB) defect = draw(nCheck++, 6) >= catchPair + (1 - catchPair) / 2;
      if ((defect && draw(nCheck++, 2) < (q.single ? catchYou : catchPair)) || conflict) {
        p.defect = false;
        p.state = 'active';
        q.got = 1;
        q.single = true;
        q.a.inbox.push(pairBuild(q, q.a, true));
      } else {
        p.defect = defect;
        p.state = 'done';
        q.piece = null;
      }
    });
  };
  const pairBuild = (q: Pair, x: Agent, redo: boolean): Task =>
    build(x, q.piece!, redo, () => {
      const p = q.piece!;
      if (x === q.a) q.defA = p.defect; else q.defB = p.defect;
      p.defect = false;
      q.got++;
      if (q.got >= 2) compare(q);
    });
  const pullPair = (x: Agent): Task | null => {
    const q = pairOf(x);
    if (q.awaiting) { x.hold = 'wait'; return null; }
    if (q.piece) { x.hold = 'blocked'; return null; }
    if (x !== q.a) { x.hold = anyTodo() ? 'blocked' : null; return null; }
    const p = nextPiece();
    if (!p) { x.hold = anyTodo() ? 'blocked' : null; return null; }
    p.state = 'active';
    q.piece = p;
    q.got = 0;
    q.single = false;
    q.awaiting = true;
    x.hold = 'wait';
    you('brief', PROMPT_MIN, () => {
      q.awaiting = false;
      q.a.inbox.push(pairBuild(q, q.a, false));
      q.b.inbox.push(pairBuild(q, q.b, false));
    });
    return null;
  };

  const pull = (a: Agent): Task | null => {
    a.hold = null;
    if (a.role === 'reviewer') return pullReviewer(a);
    if (a.role === 'planner') return pullPlanner(a);
    if (a.role === 'lead') return pullLead(a);
    if (P === 'best') return pullPair(a);
    if (P === 'plan') return pullPlanBuilder(a);
    if (P === 'lead') return pullSub(a);
    return pullThread(a);
  };

  // ----- the clock -----
  let t = 0;
  for (; t < LIMIT; t++) {
    if (!job && queue.length) job = queue.shift()!;
    for (const a of agents) {
      if (!a.task) a.task = a.inbox.shift() ?? pull(a);
      if (a.task) a.hold = null;
      // A pair partner whose own half is done waits with its partner for the person.
      if (!a.task && P === 'best' && pairOf(a).awaiting) a.hold = 'wait';
    }
    if (pieces.every((p) => p.state === 'done') && !job && !queue.length && agents.every((a) => !a.task && !a.inbox.length)) break;
    youTrace.push(job ? job.kind : null);
    for (const a of agents) a.trace.push(a.task ? a.task.kind : a.hold);
    if (job && --job.left <= 0) { const j = job; job = null; j.done(); }
    for (const a of agents) {
      if (a.task && --a.task.left <= 0) { const k = a.task; a.task = null; k.done(); }
    }
  }
  const finish = t;

  const runs = <K extends string>(trace: (K | null)[]): Seg<K>[] => {
    const out: Seg<K>[] = [];
    for (let i = 0; i < trace.length; i++) {
      const k = trace[i];
      if (!k) continue;
      const last = out[out.length - 1];
      if (last && last.k === k && last.e === i) last.e = i + 1;
      else out.push({ s: i, e: i + 1, k });
    }
    return out;
  };

  const lanes: Lane[] = agents.map((a) => ({ group: a.group, segs: runs(a.trace) }));
  const youSegs = runs(youTrace);
  const sum = (k: Kind) => agents.reduce((n, a) => n + a.trace.filter((x) => x === k).length, 0);
  const tokens = byRole.planner + byRole.lead + byRole.builder + byRole.reviewer;
  const solo = withSolo ? (P === 'solo' ? null : simulate({ ...s, pattern: 'solo' }, false)) : null;
  const soloTokens = solo ? solo.stats.tokens : tokens;
  const through = pieces.reduce((n, p) => n + 1 - (1 - p.rd) * (1 - p.rm), 0);
  const throughPlan = pieces.reduce((n, p) => n + p.rm, 0);

  return {
    settings: s,
    lanes,
    you: youSegs,
    byRole,
    stats: {
      finish,
      you: youTrace.filter(Boolean).length,
      waiting: sum('wait'),
      blocked: sum('blocked'),
      redoing: sum('redo'),
      tokens,
      tokensVsSolo: soloTokens ? tokens / soloTokens : 1,
      conflicts,
      through,
      throughPlan,
      pieces: K,
      chains,
      soloFinish: solo ? solo.stats.finish : finish,
    },
  };
}

// ---------- words ----------

export const hours = (min: number) => {
  if (min < 60) return `${Math.round(min)} min`;
  const h = min / 60;
  return `${h < 10 ? (Math.round(h * 10) / 10).toString() : Math.round(h)} h`;
};
/** 2.04 → 2, 2.46 → 2.5, 13.2 → 13. */
export const fold = (x: number) => String(x < 10 ? Math.round(x * 10) / 10 : Math.round(x));
export const times = (x: number) => `×${fold(x)}`;

const NUM = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
const num = (n: number) => (n < NUM.length ? NUM[n]! : String(n));
const cap = (t: string) => t[0]!.toUpperCase() + t.slice(1);

/** The sentence under the lab: the most telling thing about this run. */
export function describe(r: Run): string {
  const st = r.stats, s = r.settings;
  const agentTime = r.lanes.length * st.finish || 1;
  const speedup = st.soloFinish / Math.max(1, st.finish);
  const waitShare = st.waiting / agentTime;
  const blockedShare = st.blocked / agentTime;
  const out: string[] = [];

  if (s.pattern === 'solo') {
    out.push(`One agent takes ${hours(st.finish)}, and ${hours(st.you)} of that is you briefing and reviewing.`);
  } else if (speedup >= 1.3) {
    out.push(`Done ${fold(speedup)} times sooner than one agent, for ${fold(st.tokensVsSolo)} times the tokens.`);
  } else if (speedup >= 0.9) {
    out.push(`No faster than one agent, for ${fold(st.tokensVsSolo)} times the tokens.`);
  } else {
    out.push(`Slower than one agent alone, and ${fold(st.tokensVsSolo)} times the tokens.`);
  }

  // The worst problem in this run, if any is bad enough to name.
  const through = Math.round(st.through);
  const busy = st.you / Math.max(1, st.finish);
  const issues: [number, string][] = [
    [through >= 2 ? (st.through / st.pieces) * 3 : 0, `${cap(num(through))} of ${st.pieces} pieces reach the end with a mistake nobody caught${st.throughPlan >= st.through / 2 ? ', most of them wrong in the plan before anyone built them' : ''}.`],
    [s.pattern === 'solo' ? 0 : (busy - 0.55) * 2, `You are busy ${Math.round(busy * 100)}% of the run, so the team goes as fast as you review.`],
    [st.chains < r.lanes.length ? blockedShare : 0, `Tangled work lets only ${num(st.chains)} piece${st.chains === 1 ? '' : 's'} run at once, so most agents sit blocked on each other.`],
    [waitShare, `${r.lanes.length === 1 ? 'The agent spends' : 'The agents spend'} ${Math.round(waitShare * 100)}% of their time waiting for you.`],
    [(st.conflicts / st.pieces) * 1.5, `${cap(num(st.conflicts))} changes collide and have to be redone.`],
  ];
  const [score, says] = issues.reduce((a, b) => (b[0] > a[0] ? b : a));
  if (score >= 0.25) out.push(says);
  else if (s.pattern !== 'solo' && through === 0 && st.pieces >= 4) out.push('Nearly every mistake is caught before the end.');
  return out.join(' ');
}

// ---------- presets ----------

export interface Preset { id: string; name: string; settings: Settings }
const base: Settings = { pattern: 'solo', agents: 4, separable: 0.6, pieces: 16, review: 8, planner: 'middle', builder: 'middle', reviewer: 'middle' };
export const DEFAULT: Settings = { ...base, pattern: 'plan', agents: 4 };
export const PRESETS: Preset[] = [
  { id: 'one', name: 'One agent', settings: { ...base, pattern: 'solo', agents: 1 } },
  { id: 'sixteen', name: 'Sixteen, tangled', settings: { ...base, pattern: 'parallel', agents: 16, separable: 0.1, pieces: 24 } },
  { id: 'slow', name: 'Slow reviewer', settings: { ...base, pattern: 'review', agents: 8, builder: 'small', reviewer: 'middle', review: 25, separable: 0.9, pieces: 24 } },
  { id: 'cheap', name: 'Cheap planner', settings: { ...base, pattern: 'plan', agents: 6, planner: 'small', builder: 'large', reviewer: 'middle', separable: 0.8, pieces: 24, review: 4 } },
];
