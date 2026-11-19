// Chapter 14: several jobs. Each job works, then needs you; there is one of you, so jobs queue.
// The hour, the jobs and every rate are made up. What happens is worked out first by desk() in
// sim.ts, then drawn minute by minute, and the readout is counted from the same minutes.
import type { Chapter, Ctx } from '../chapter';
import type { Script } from '../scene';
import { jobs, lab } from '../presets';
import { desk, type Need } from '../sim';
import { attendSpot, jobSpot, BUS_Y, SPOT, type SceneState, type Label, type P3, type XY } from '../picture';

type Stop = 'long' | 'short';
type Board = 'vague' | 'clear';
interface Opts { n: number; stop: Stop; projects: 'one' | 'many'; board?: Board; minutes?: number; frame?: boolean }

/** Made-up minutes you stay at a job. A bare "Done." has to be read to be known; proof and a short question do not. */
const STOP: Record<Stop, number> = { long: 8, short: 2 };
/** A card that does not say what the job needs: you open the thread to find out first. */
const OPEN_THREAD = 3;
/** One made-up minute on screen, in ms. */
const MINUTE = 280;

const NAMES = ['Search box', 'CSV export', 'Phone layout', 'Paid filter', 'Reminders'];
const VAGUE = ['fix', 'fix 2', 'new thread', 'fix', 'untitled'];
const QUESTIONS = ['Hide paused members, or grey them out?', 'Dates as 3 March or 03/03?', 'Stack the table, or scroll it sideways?', 'Count part-payers as paid?', 'Send at 9:00 or at 18:00?'];
const line = (j: number, need: Need, stop: Stop) =>
  need === 'question'
    ? stop === 'short' ? QUESTIONS[j % QUESTIONS.length]! : 'Can you take a look?'
    : stop === 'short' ? 'Done. Tests pass; screenshot on the board.' : 'Done.';
const STATE = { work: 'working', question: 'asks a question', result: 'ready to look at' } as const;

const stopOf = (o: Opts) => STOP[o.stop] + (o.board === 'vague' ? OPEN_THREAD : 0);
const nameOf = (o: Opts, j: number) => (o.board === 'vague' ? VAGUE[j % VAGUE.length]! : NAMES[j % NAMES.length]!);
const boardLabel = (o: Opts, j: number, state: keyof typeof STATE): Label =>
  lab(`j${j}`, o.board === 'vague' ? VAGUE[j % VAGUE.length]! : `${NAMES[j % NAMES.length]}: ${STATE[state]}`, 'right');

/** The whole floor of five jobs, so moving the slider does not move the camera. */
const frameFive = (projects: Opts['projects']): P3[] => {
  const pts: P3[] = [[0, SPOT.you[1] + 10, 0], [SPOT.tray[0] + 24, SPOT.tray[1] + 12, 0]];
  for (let i = 0; i < 5; i++) {
    const [x] = jobSpot(i, 5);
    pts.push([x - 24, -24, 0], [x + 48, 24, 60], [attendSpot(i, 5)[0] - 10, attendSpot(i, 5)[1] + 10, 0]);
    if (projects === 'many') pts.push([x - 24, -118, 0], [x + 24, -80, 8]);
  }
  if (projects === 'one') for (const dx of [-44, 44]) for (const dy of [-36, 36]) pts.push([216 + dx, BUS_Y + dy, 8]);
  return pts;
};

function floor(o: Opts): SceneState {
  const n = o.n;
  const labels: Label[] = [lab('you', 'you', 'left'), lab('tray', 'the board', 'bottom')];
  if (o.board) for (let j = 0; j < n; j++) labels.push(boardLabel(o, j, 'work'));
  else labels.push(lab('j0', 'a job', 'top', 'wiki/thread/'));
  if (o.projects === 'one') {
    labels.push(lab('main', 'main', 'bottom', 'wiki/branch/'));
    if (n > 1 && !o.board) labels.push(lab([jobSpot(n - 1, n)[0] + 30, 12, 2], 'its own copy', 'right', 'wiki/worktree/'));
  } else {
    labels.push(lab(`p:${n - 1}`, 'its own project', 'top'), lab([jobSpot(0, n)[0] - 14, -88, 2], 'instruction file', 'left', 'wiki/instruction-file/'));
  }
  const s = jobs(n, { projects: o.projects, labels });
  for (const a of s.agents) { a.busy = true; a.lamp = 'work'; a.blocks = [{ t: 'you', h: 2 }]; }
  if (o.frame) s.focus = frameFive(o.projects);
  return s;
}

const fmtMin = (m: number) => `${m} min`;

/** One made-up hour at the desk, drawn minute by minute. */
async function hour(ctx: Ctx, h: Script, o: Opts) {
  const n = o.n, T = o.minutes ?? 60;
  const run = desk({ jobs: n, stop: stopOf(o), minutes: T });
  h.set((s) => { Object.assign(s, floor(o)); });
  let finished = 0, waited = 0, idle = 0;
  const stats = (t: number) => ctx.stat([['minute', `${t} of ${T}`], ['jobs finished', finished], ['agents waiting for you', fmtMin(waited)], ['you waiting for them', fmtMin(idle)]]);
  stats(0);
  let merging: Promise<void> = Promise.resolve();
  const okUntil: number[] = Array(n).fill(-1);
  const project = (s: SceneState, j: number) => (o.projects === 'one' ? s.project! : s.projects!.find((p) => p.id === `${j}`)!);
  const mergePath = (s: SceneState, j: number): XY[] => {
    const [x] = jobSpot(j, n);
    return o.projects === 'one' ? [[x, -16], [x, BUS_Y], [s.project!.at[0] - 46, BUS_Y]] : [[x, -16], [x, -78]];
  };

  for (let t = 0; t < T; t++) {
    const evs = run.events.filter((e) => e.t === t);
    const minute = run.minutes[t]!;
    const spoke: { v?: [string, string] } = {};
    h.set((s) => {
      for (const e of evs) {
        const a = s.agents[e.job]!, card = s.tray!.cards[e.job]!;
        if (e.what === 'need') {
          a.busy = false; a.lamp = 'wait'; a.blocks!.push({ t: 'model', h: 1.6 });
          card.mark = 'wait'; card.b = e.need === 'result' ? 'tool' : 'model';
          if (o.board === 'clear') setLabel(s, e.job, boardLabel(o, e.job, e.need));
          spoke.v = [nameOf(o, e.job), line(e.job, e.need, o.stop)];
        } else if (e.what === 'go') {
          s.you = attendSpot(e.job, n);
        } else if (e.what === 'arrive') {
          a.blocks!.push({ t: 'you', h: 1.4 });
        } else if (e.what === 'leave') {
          a.busy = true; a.lamp = 'work';
          card.mark = 'work'; card.b = 'model';
          if (o.board === 'clear') setLabel(s, e.job, boardLabel(o, e.job, 'work'));
          if (e.need === 'result') {
            card.mark = 'ok'; okUntil[e.job] = t + 3;
            a.blocks = [{ t: 'you', h: 2 }];
          }
        }
      }
      minute.jobs.forEach((st, j) => {
        const a = s.agents[j]!;
        if (okUntil[j] === t) s.tray!.cards[j]!.mark = st === 'work' ? 'work' : s.tray!.cards[j]!.mark;
        if (st === 'work' && (t + j) % 2 === 0) a.blocks!.push(t % 4 < 2 ? { t: 'tool', h: 2.6 } : { t: 'model', h: 1.2 });
      });
    });
    for (const e of evs) {
      if (e.what !== 'leave' || e.need !== 'result') continue;
      finished++;
      const j = e.job;
      merging = merging
        .then(() => h.send(mergePath(ctx.scene.state, j), 'model', { ms: 520 }))
        .then(() => h.set((s) => { (project(s, j).commits ??= []).push('ok'); }))
        .catch(() => {});
    }
    if (spoke.v) ctx.say(spoke.v[0], spoke.v[1]);
    waited += minute.jobs.filter((st) => st !== 'work').length;
    if (minute.you === 'idle') idle++;
    stats(t + 1);
    await h.wait(MINUTE);
  }
  await merging;
  h.check();
  h.set((s) => { for (const a of s.agents) a.busy = false; });
  ctx.say(null, `In the made-up hour ${finished === 1 ? 'one job' : `${finished} jobs`} finished, ${n === 1 ? 'one' : n} at a time. Agents waited ${fmtMin(waited)} for you; you waited ${fmtMin(idle)} for them.`);
}

function setLabel(s: SceneState, j: number, l: Label) {
  const i = (s.labels ??= []).findIndex((x) => x.at === `j${j}`);
  if (i >= 0) s.labels[i] = l; else s.labels.push(l);
}

const play = (ctx: Ctx) => void ctx.scene.run((h) => hour(ctx, h, ctx.mem.o));
const start = (ctx: Ctx, o: Opts, note?: string) => { ctx.mem.o = o; if (note) ctx.say(null, note); play(ctx); };
const change = (ctx: Ctx, part: Partial<Opts>, note: string) => start(ctx, { ...ctx.mem.o, ...part }, note);

const O = {
  one: { n: 1, stop: 'short', projects: 'one' } as Opts,
  three: { n: 3, stop: 'short', projects: 'one' } as Opts,
  many: { n: 5, stop: 'long', projects: 'one', frame: true } as Opts,
  projects: { n: 3, stop: 'short', projects: 'one' } as Opts,
  board: { n: 3, stop: 'short', projects: 'one', board: 'vague' } as Opts,
};

/** One short loop of this chapter, for the part-two overview. */
export async function demo(ctx: Ctx, h: Script) {
  await hour(ctx, h, { n: 3, stop: 'short', projects: 'one', minutes: 28 });
}

export const jobsCh: Chapter = {
  steps: {
    one: { scene: () => floor(O.one), enter: (ctx) => start(ctx, O.one, 'One made-up job. It works, then needs you.') },
    three: { scene: () => floor(O.three), enter: (ctx) => start(ctx, O.three, 'Three jobs, each in its own copy of the project.') },
    many: { scene: () => floor(O.many), enter: (ctx) => start(ctx, O.many, `Five jobs, and each says only “Done.”: ${STOP.long} made-up minutes at each stop.`) },
    projects: { scene: () => floor(O.projects), enter: (ctx) => start(ctx, O.projects, 'One project: every job merges into main, one at a time.') },
    board: { scene: () => floor(O.board), enter: (ctx) => start(ctx, O.board, `The board says “fix”. At every stop you open the thread first: ${OPEN_THREAD} made-up minutes more.`) },
  },
  inputs: {
    n: (ctx, val) => { const n = Number(val); change(ctx, { n }, `${n === 1 ? 'One job' : `${n} jobs`}, one of you.`); },
  },
  actions: {
    stop: (ctx, val) => change(ctx, { stop: val as Stop }, val === 'long'
      ? `Each job says only “Done.”: you read the work to know. ${STOP.long} made-up minutes at each stop.`
      : `Each job sends proof or a short question: ${STOP.short} made-up minutes at each stop.`),
    projects: (ctx, val) => change(ctx, { projects: val as Opts['projects'] }, val === 'one'
      ? 'One project: every job merges into main, one at a time.'
      : 'Several projects: each job has its own, with its own instruction file.'),
    board: (ctx, val) => change(ctx, { board: val as Board }, val === 'vague'
      ? `The board says “fix”. At every stop you open the thread first: ${OPEN_THREAD} made-up minutes more.`
      : 'Each card says what the job is and what it needs from you.'),
  },
};
