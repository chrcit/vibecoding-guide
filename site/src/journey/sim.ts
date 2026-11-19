// The fleet, as a small deterministic simulation: a lead hands out tasks, workers fill their own
// windows doing them, results go to the main branch (through a gate if there is one), and a short
// report goes back to the lead. Chapters 7 to 9 and the overview all run this with different
// switches. The tasks are made up; which ones go wrong is fixed, not random.
import type { Ctx } from './chapter';
import type { Script } from './scene';
import { route, reverse, BUS_Y, type XY } from './picture';

export interface FleetOpts {
  /** Workers share one copy of the project instead of each having its own. */
  shared?: boolean;
  /** Results are checked at the gate before they land. */
  gate?: boolean;
  /** The lead keeps only a short report from each task. Off: it keeps everything. */
  shortReports?: boolean;
  /** How many tasks there are. Every run hands out exactly this many and then ends. */
  until?: number;
  /** What the agent you talk to is called in the readout: 'the agent' before it is a lead. */
  name?: string;
  /** Side by side, before there is a check: count clashes instead of what the check sent back. */
  clashes?: boolean;
  /** Some tasks come back wrong on their own, about one in four. Off: only a clash makes one wrong. */
  flaws?: boolean;
  /** Add a row to the readout counting the builders' turns (each one reads its whole window). */
  showTurns?: boolean;
}
export interface Tally { landed: number; sentBack: number; wrong: number; clashes: number; compactions: number; turns?: number }

const toLead = (at: XY): XY[] => [[at[0], BUS_Y], [0, BUS_Y], [0, -20]];
/** Which tasks come back wrong: about one in four, fixed. */
const goesWrong = (worker: number, task: number) => (worker * 7 + task * 3) % 4 === 1;

export async function fleet(ctx: Ctx, h: Script, o: FleetOpts = {}): Promise<Tally> {
  const { scene } = ctx;
  const tally: Tally = { landed: 0, sentBack: 0, wrong: 0, clashes: 0, compactions: 0, turns: 0 };
  const short = o.shortReports ?? true;
  const workers = scene.state.agents.filter((a) => a.id !== 'a0');
  const total = o.until ?? workers.length * 2;
  const flaws = o.flaws ?? true;
  let handed = 0;
  // One readout for chapters 7 to 9: the same names in the same order, counted towards a total.
  const stats = () => ctx.stat([
    ['tasks on main', `${tally.landed} of ${total}`],
    o.clashes ? ['clashes', tally.clashes] : ['sent back before main', o.gate ? tally.sentBack : 'no check'],
    ['wrong on main', tally.wrong],
    [`${o.name ?? 'the lead'}’s window`, `${Math.round(scene.fill('a0') * 100)}% full`],
    ...(o.showTurns ? [['builder turns so far', tally.turns ?? 0] as [string, number]] : []),
  ]);
  const w = (id: string) => (s: typeof scene.state) => s.agents.find((a) => a.id === id)!;

  const life = async (i: number) => {
    const me = workers[i]!;
    const id = me.id, at = me.at;
    await h.wait(140 + i * 210);
    for (let task = 0; handed < total; task++) {
      handed++;
      h.set((s) => { s.agents[0]!.busy = true; });
      await h.send(route.agentToWorker(at), 'model');
      h.set((s) => { s.agents[0]!.busy = false; const a = w(id)(s); a.blocks = [{ t: 'model', h: 5 }]; a.lamp = 'work'; a.busy = true; if (a.tree) a.tree = 'own'; });
      const steps = 4 + ((i + task) % 4);
      for (let k = 0; k < steps; k++) {
        await h.wait(420 + ((i * 37 + k * 53) % 260));
        h.set((s) => { w(id)(s).blocks!.push({ t: k % 2 ? 'model' : 'tool', h: 3 + ((i + k) % 4) * 2 }); });
        tally.turns = (tally.turns ?? 0) + 1;
        if (o.showTurns && k % 2) stats();
      }
      let wrong = flaws && goesWrong(i, task);
      h.set((s) => { w(id)(s).busy = false; w(id)(s).lamp = 'wait'; });
      const project = scene.state.project!;
      const gateAt: XY = [124 - 18, BUS_Y];
      if (o.gate) {
        await h.send([[at[0], at[1] + 14], [at[0], BUS_Y], gateAt], wrong ? 'bad' : 'model');
        if (wrong) {
          tally.sentBack++;
          h.set((s) => { const g = s.gates!.find((x) => x.id === 'mgate'); if (g) g.lamp = 'bad'; });
          stats();
          await h.send(reverse([[at[0], at[1] + 14], [at[0], BUS_Y], gateAt]), 'bad');
          h.set((s) => { const a = w(id)(s); a.lamp = 'work'; a.busy = true; a.blocks!.push({ t: 'bad', h: 4 }); });
          await h.wait(900);
          h.set((s) => { const a = w(id)(s); a.blocks!.push({ t: 'tool', h: 4 }); a.busy = false; });
          await h.send([[at[0], at[1] + 14], [at[0], BUS_Y], gateAt], 'model');
          wrong = false;
        }
        h.set((s) => { const g = s.gates!.find((x) => x.id === 'mgate'); if (g) g.lamp = 'ok'; });
        await h.send([gateAt, [project.at[0] - 46, BUS_Y]], 'model', { ms: 300 });
      } else {
        // Which writes land on top of another is fixed, not timed: about one in three when the
        // folder is shared, so the run reads the same at any speed and with motion reduced.
        const clash = !!o.shared && workers.length > 1 && (i * 5 + task * 2) % 3 === 0;
        await h.send(route.workerToMain(at, project), wrong || clash ? 'bad' : 'model');
        if (clash) { tally.clashes++; wrong = true; h.set((s) => { const f = (s.project!.files ??= ['', '', '', '', '', '']); f[(i + task) % 6] = 'bad'; }); }
      }
      if (wrong) tally.wrong++;
      tally.landed++;
      h.set((s) => { (s.project!.commits ??= []).push(wrong ? 'bad' : 'ok'); const a = w(id)(s); a.lamp = wrong ? 'bad' : 'ok'; });
      await h.send(toLead(at), 'tool', { ms: 420 });
      h.set((s) => {
        const lead = s.agents[0]!;
        (lead.blocks ??= []).push({ t: 'tool', h: short ? 1.6 : 9 });
        if (lead.blocks.reduce((n, b) => n + b.h, 0) > (lead.cap ?? 60) * 0.92) { lead.blocks = [{ t: 'sum', h: 7 }]; tally.compactions++; }
        w(id)(s).blocks = [];
      });
      stats();
      await h.wait(380);
    }
  };
  stats();
  await Promise.all(workers.map((_, i) => life(i)));
  h.set((s) => { for (const a of s.agents) { a.busy = false; } });
  stats();
  return tally;
}

// ---------- several jobs, one of you (chapter 14) ----------
// A made-up hour at a desk. Each job works for a while, then needs you: a question half-way
// through its task, a result to look at the end. It waits until you have walked over and stayed
// for the length of a stop. There is one of you, so jobs queue: you go to whichever has waited
// longest. Pure and deterministic; the chapter draws what this returns and counts the readout
// from the same minutes.

export type Need = 'question' | 'result';
export type JobState = 'work' | 'wait' | 'with';
export interface DeskOpts {
  jobs: number;
  /** Minutes you stay at a job each time it needs you. */
  stop: number;
  /** Length of the run. Default 60. */
  minutes?: number;
  /** Minutes to walk from one job to another. Default 1. */
  walk?: number;
}
export interface DeskEvent {
  t: number;
  job: number;
  /** need: its lamp turns blue. go: you set off towards it. arrive, leave: your stop. */
  what: 'need' | 'go' | 'arrive' | 'leave';
  need: Need;
  /** Which task of this job, counting from 0. */
  task: number;
}
export interface DeskMinute { jobs: JobState[]; you: 'idle' | 'walk' | 'with' }
export interface Desk {
  events: DeskEvent[];
  /** What each job and you were doing in each minute. */
  minutes: DeskMinute[];
  /** Tasks whose result you had looked at before the hour ran out. */
  finished: number;
  /** Agent-minutes spent waiting for you, your stops included. */
  waited: number;
  /** Your minutes with nothing to attend to. */
  idle: number;
}

/** How long job j works before it next needs you: 5 to 13 made-up minutes, fixed. */
export const workFor = (job: number, part: number) => 5 + ((job * 5 + part * 7 + 3) % 9);

export function desk(o: DeskOpts): Desk {
  const T = o.minutes ?? 60, walk = o.walk ?? 1, n = Math.max(1, o.jobs);
  const jobs = Array.from({ length: n }, (_, j) => ({ part: 0, state: 'work' as JobState, until: workFor(j, 0), since: 0 }));
  const need = (j: number): Need => (jobs[j]!.part % 2 ? 'result' : 'question');
  const task = (j: number) => Math.floor(jobs[j]!.part / 2);
  const you = { state: 'idle' as DeskMinute['you'], job: -1, at: -1, until: 0 };
  const events: DeskEvent[] = [];
  const minutes: DeskMinute[] = [];
  const log = (t: number, job: number, what: DeskEvent['what']) => events.push({ t, job, what, need: need(job), task: task(job) });
  let finished = 0;

  for (let t = 0; t < T; t++) {
    if (you.state === 'with' && you.until === t) {
      const j = jobs[you.job]!;
      log(t, you.job, 'leave');
      if (need(you.job) === 'result') finished++;
      j.part++;
      j.state = 'work';
      j.until = t + workFor(you.job, j.part);
      you.state = 'idle';
    }
    if (you.state === 'walk' && you.until === t) {
      you.state = 'with'; you.at = you.job; you.until = t + o.stop;
      jobs[you.job]!.state = 'with';
      log(t, you.job, 'arrive');
    }
    jobs.forEach((j, i) => { if (j.state === 'work' && j.until === t) { j.state = 'wait'; j.since = t; log(t, i, 'need'); } });
    if (you.state === 'idle') {
      let pick = -1;
      jobs.forEach((j, i) => { if (j.state === 'wait' && (pick < 0 || j.since < jobs[pick]!.since)) pick = i; });
      if (pick >= 0) {
        you.job = pick;
        log(t, pick, 'go');
        if (you.at === pick) { you.state = 'with'; you.until = t + o.stop; jobs[pick]!.state = 'with'; log(t, pick, 'arrive'); }
        else { you.state = 'walk'; you.until = t + walk; }
      }
    }
    minutes.push({ jobs: jobs.map((j) => j.state), you: you.state });
  }
  const waited = minutes.reduce((a, m) => a + m.jobs.filter((s) => s !== 'work').length, 0);
  const idle = minutes.filter((m) => m.you === 'idle').length;
  return { events, minutes, finished, waited, idle };
}
