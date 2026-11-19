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
}
export interface Tally { landed: number; sentBack: number; wrong: number; clashes: number; compactions: number }

const toLead = (at: XY): XY[] => [[at[0], BUS_Y], [0, BUS_Y], [0, -20]];
/** Which tasks come back wrong: about one in four, fixed. */
const goesWrong = (worker: number, task: number) => (worker * 7 + task * 3) % 4 === 1;

export async function fleet(ctx: Ctx, h: Script, o: FleetOpts = {}): Promise<Tally> {
  const { scene } = ctx;
  const tally: Tally = { landed: 0, sentBack: 0, wrong: 0, clashes: 0, compactions: 0 };
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
  ]);
  const w = (id: string) => (s: typeof scene.state) => s.agents.find((a) => a.id === id)!;
  let writing = 0;

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
        writing++;
        const clash = !!o.shared && writing > 1;
        await h.send(route.workerToMain(at, project), wrong ? 'bad' : 'model');
        writing--;
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
