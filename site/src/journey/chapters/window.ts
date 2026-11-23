// Lesson 7: the window fills, and a full window answers worse.
// The same request is played against windows holding different things, so the reader sees context
// rot as a consequence (the wrong file edited, an early rule ignored), not as a claim. The pile,
// what goes wrong and when are made up and fixed; the window sizes and what Claude Code does at
// the limit come from src/data through the page.
import type { Chapter, Ctx } from '../chapter';
import { byLevel } from '../chapter';
import type { Script } from '../scene';
import { solo, lab } from '../presets';
import { termLabel } from '../terms';
import { route, reverse, fileSpot, CAP, type Block, type Label, type SceneState } from '../picture';

/** Token counts are in thousands. A slab of 25 is 25k tokens. */
const fmt = (k: number) => (k >= 1000 ? `${+(k / 1000).toFixed(2)}M` : `${Math.round(k)}k`);
const sum = (b: Block[]) => b.reduce((n, x) => n + x.h, 0);

// What the window holds, as named runs of slabs. All made up.
const RULE: Block[] = [{ t: 'you', h: 2 }];                       // "Always show dates as day.month.year."
const FIX: Block[] = [{ t: 'you', h: 2 }, { t: 'tool', h: 3 }, { t: 'tool', h: 6 }, { t: 'model', h: 2 }, { t: 'tool', h: 4 }, { t: 'model', h: 2 }];
const CSV: Block[] = [{ t: 'you', h: 2 }, { t: 'tool', h: 40 }, { t: 'model', h: 8 }, { t: 'tool', h: 30 }, { t: 'model', h: 5 }];
const FORM: Block[] = [{ t: 'you', h: 2 }, { t: 'tool', h: 60 }, { t: 'model', h: 10 }, { t: 'tool', h: 40 }];
const LOG: Block[] = [{ t: 'you', h: 90 }];
const ASK: Block = { t: 'you', h: 1 };
const morning = (): Block[] => [...RULE, ...FIX, ...CSV, ...FORM];

const MEMBERS = 1, EXPORT = 4; // file tiles on the project plate

/**
 * One readout for the whole lesson: how much is in the window, how full it is, what became of the
 * rule from your first message, and what the next ten turns read again (all of it, every turn).
 * The chip on the picture is the fill: "window 22% full".
 */
const pct = (k: number, cap = 1000) => Math.max(1, Math.round((k / cap) * 100));
function readout(ctx: Ctx, inWindow: number, cap: number, rule: string, extra = '') {
  ctx.stat([
    ['in the window', `${fmt(inWindow)} of ${fmt(cap)} tokens${extra}`],
    ['full', `${pct(inWindow, cap)}%`],
    ['your rule from message 1', rule],
    ['read again, next 10 turns', inWindow > cap ? 'nothing: the next turn cannot start' : `${fmt(inWindow * 10)} tokens`],
  ]);
}

/** Height of slab i in the drawn stack, as the picture draws it (see stackMarkup in picture.ts). */
function slabZ(blocks: Block[], cap: number, i: number) {
  const total = sum(blocks);
  const f = (CAP / cap) * (total > cap ? cap / total : 1);
  let z = 4.4;
  for (let j = 0; j < i; j++) z += Math.max(1.3, blocks[j]!.h * f);
  return z + Math.max(1.3, blocks[i]!.h * f) / 2;
}
/** A label on the left face of the window, beside slab i. */
const at = (blocks: Block[], cap: number, i: number, text: string): Label => ({ at: [14, -14, slabZ(blocks, cap, i)], text, place: 'right' });

// Close on the window. The project plate is drawn only where the step edits a file (rot): framed
// out, it showed as a plate cut off at the edge, which read as a rendering error on a phone.
const view = (blocks: Block[], cap: number, labels: Label[] = [], wide = false): SceneState => {
  const s = solo({
    tools: true, project: wide, blocks,
    focus: wide ? ['you', 'a0', 'tools', 'project'] : ['you', 'a0', 'tools'],
    zoomMax: 6.5,
    labels: [termLabel('a0', 'model', 'top', 'the model'), ...(labels.length ? labels : [termLabel('tank:a0', 'window', 'left', 'its window')])],
  });
  s.agents[0]!.cap = cap;
  return s;
};

// ---------- pile: a morning of work ----------
async function pileUp(ctx: Ctx, h: Script) {
  const cap = 1000;
  const runs: [string, Block[]][] = [['the date fix', FIX], ['a CSV export', CSV], ['a new member form', FORM]];
  let blocks: Block[] = [...RULE];
  const show = () => readout(ctx, sum(blocks), cap, 'at the bottom, still there');
  h.set((s) => { s.agents[0]!.blocks = [...blocks]; s.agents[0]!.cap = cap; });
  ctx.say('you', 'Always show dates as day.month.year.');
  show();
  await h.wait(1600);
  for (const [name, run] of runs) {
    for (const b of run) {
      blocks = [...blocks, b];
      h.set((s) => { s.agents[0]!.blocks = [...blocks]; s.agents[0]!.busy = true; });
      await h.wait(260);
    }
    h.set((s) => { s.agents[0]!.busy = false; s.agents[0]!.scan = true; });
    ctx.say('model', `Done: ${name}.`);
    ctx.say(null, `Then ${name}. The model reads the whole pile again before every turn.`);
    show();
    await h.wait(1500);
    h.set((s) => { s.agents[0]!.scan = false; });
  }
  h.set((s) => { s.labels = [...(s.labels ?? []), { ...at(blocks, cap, 0, 'your rule'), at: [-14, 14, slabZ(blocks, cap, 0) + 2], place: 'left' }]; });
  ctx.say(null, `A morning of work, all still in the window: ${fmt(sum(blocks))} tokens, and your rule at the bottom. Nothing has left it.`);
}

// ---------- rot: the same request, different windows ----------
type Mix = 'job' | 'morning' | 'log';
const MIX: Record<Mix, () => Block[]> = {
  job: () => [...RULE, { t: 'tool', h: 6 }],
  morning,
  log: () => [...morning(), ...LOG],
};
const OUTCOME: Record<Mix, { file: number; date: string; says: string }> = {
  job: { file: MEMBERS, date: '03.03.2026', says: 'Fixed in members.ts: 03.03.2026.' },
  morning: { file: MEMBERS, date: '3/3/2026', says: 'Fixed in members.ts: 3/3/2026.' },
  log: { file: EXPORT, date: 'still wrong', says: 'Fixed the date in export.ts.' },
};
function rotLabels(mix: Mix, blocks: Block[], cap: number): Label[] {
  const out = [{ ...at(blocks, cap, 0, 'your rule: day.month.year'), at: [-14, 14, slabZ(blocks, cap, 0) + 4] as [number, number, number], place: 'left' as const }];
  if (mix !== 'job') out.push(at(blocks, cap, RULE.length + FIX.length + 1, 'the CSV job'));
  if (mix === 'log') out.push(at(blocks, cap, blocks.length - 1, 'a pasted log'));
  return out;
}
export async function ask(ctx: Ctx, h: Script, mix: Mix) {
  const cap = 1000;
  const before = MIX[mix]();
  const blocks = [...before, ASK];
  const o = OUTCOME[mix];
  const ok = mix === 'job';
  const stat = (rule = '…') => readout(ctx, sum(blocks), cap, rule);
  h.set((s) => { Object.assign(s, view(before, cap, rotLabels(mix, blocks, cap), true)); });
  stat();
  ctx.say(null, '');
  ctx.say('you', 'The date on the member card is wrong.');
  await h.send(route.youToAgent(), 'you');
  h.set((s) => { s.agents[0]!.blocks = [...blocks]; s.agents[0]!.scan = true; s.agents[0]!.busy = true; });
  await h.wait(1400);
  h.set((s) => { s.agents[0]!.scan = false; });
  const tools = ctx.scene.state.tools!, project = ctx.scene.state.project!;
  await h.send(route.agentToTool(tools, 'edit'), 'model');
  h.set((s) => { s.tools!.on = 'edit'; s.agents[0]!.busy = false; });
  await h.send(route.toolToFile(tools, 'edit', project, o.file).slice(1), mix === 'log' ? 'bad' : 'model', { ms: 420 });
  h.set((s) => {
    s.tools!.on = null;
    const f = (s.project!.files = ['', '', '', '', '', '']);
    f[o.file] = mix === 'log' ? 'bad' : 'edit';
    const [x, y] = fileSpot(s.project!, o.file);
    s.labels = [...(s.labels ?? []), { at: [x, y, 2], text: o.file === MEMBERS ? 'members.ts' : 'export.ts', place: 'bottom' }];
    s.agents[0]!.lamp = ok ? 'ok' : 'bad';
  });
  ctx.say('model', o.says);
  await h.send(reverse(route.youToAgent()), ok ? 'model' : 'bad');
  stat(ok ? `kept: the card shows ${o.date}` : mix === 'morning' ? `lost: the card shows ${o.date}` : 'not reached: wrong file edited');
  // The work the rule is buried under, counted from the window: everything after it but the ask.
  const buried = fmt(sum(before) - sum(RULE));
  ctx.say(null, byLevel(ctx.level, {
    plain: ok ? 'Little in the window, and all of it about this job. Right file, rule kept.' : mix === 'morning' ? `Right file, but the rule from your first message was buried under ${buried} tokens of other work.` : 'Wrong file: the pasted log and the CSV job pulled it towards export.ts. The card is still wrong.',
    technical: ok ? 'Right file, rule kept. Nothing else in the window competes for attention.' : mix === 'morning' ? 'Right file, rule lost. A type check and the tests would still pass: nothing asserts the date format.' : 'It edited export.ts. The member card is untouched, yet the agent reports “fixed”.',
    engineer: ok ? 'Short context, all on task: the instruction at position 1 is recalled.' : mix === 'morning' ? `The instruction is still in the window, ${buried} tokens back. In the window is not the same as followed.` : 'Distractors win: the most recent, largest blocks (the log, the CSV job) steer the edit.',
  }));
}

// ---------- long: past full ----------
function fill(ctx: Ctx) {
  const cap: number = ctx.keep.cap ?? 1000;
  const used: number = ctx.mem.used ?? 600;
  const unit = 25;
  const kinds: Block['t'][] = ['you', 'model', 'tool', 'tool', 'model', 'tool', 'tool', 'model'];
  const blocks: Block[] = [...RULE];
  for (let n = sum(blocks), i = 0; n < used; i++) { const h = Math.min(unit, used - n); blocks.push({ t: kinds[i % kinds.length]!, h }); n += h; }
  const over = Math.max(0, sum(blocks) - cap);
  const full = Math.round((sum(blocks) / cap) * 100);
  ctx.scene.change((s) => {
    const a = s.agents[0]!;
    a.cap = cap; a.blocks = blocks; a.spill = true;
    a.lamp = over ? 'bad' : full >= 80 ? 'wait' : 'off';
    s.labels = [termLabel('a0', 'model', 'left', 'the model'), termLabel('tank:a0', 'window', 'left', 'its window'), ...(over ? [{ at: [14, -14, 86] as [number, number, number], text: `does not fit: ${fmt(over)}`, place: 'right' as const }] : [])];
  });
  readout(ctx, sum(blocks), cap, 'at the bottom, still there', over ? `, ${fmt(over)} do not fit` : '');
  const compactAt: number | undefined = ctx.data.autoCompactAt;
  ctx.say(null, over
    ? byLevel(ctx.level, {
        plain: `${full}% full: ${fmt(over)} tokens do not fit, shown on top. The model cannot read past its window, so before the next turn something has to go.`,
        technical: `${full}% full, ${fmt(over)} over. The request no longer fits the model. Something must be dropped or summarised first${compactAt && cap === 1000 ? `: Claude Code compacts at about ${Math.round(compactAt / 1000)}K` : ''}.`,
        engineer: `${full}% full, ${fmt(over)} over the limit: the harness has to cut before it can call the model${compactAt && cap === 1000 ? ` (Claude Code compacts at about ${Math.round(compactAt / 1000)}K)` : ''}. Every cut is lossy.`,
      })
    : full >= 80 ? 'Close to full. Every turn still reads all of it, and the next long file read will not fit.'
    : 'Every turn, the model reads all of this again.');
}

// ---------- compact: what survives ----------
type Way = 'compact' | 'fresh';
async function clear(ctx: Ctx, h: Script, way: Way) {
  const cap = 1000;
  const full: Block[] = [...morning(), ...LOG, ...CSV, ...FORM, ...FORM, ...CSV, ...FORM];
  h.set((s) => { Object.assign(s, view(full, cap)); s.agents[0]!.lamp = 'bad'; });
  readout(ctx, sum(full), cap, 'at the bottom, still there');
  ctx.say(null, way === 'compact' ? 'The window is full. The tool compacts it.' : 'The window is full. You start a new thread.');
  if (way === 'compact') ctx.say('tool', 'Window full: compacting.'); else ctx.say('you', 'New thread.');
  await h.wait(900);
  const after: Block[] = way === 'compact'
    ? [{ t: 'sum', h: 20 }, { t: 'tool', h: 8 }, { t: 'tool', h: 6 }, { t: 'tool', h: 6 }, { t: 'tool', h: 5 }, { t: 'tool', h: 4 }]
    : [{ t: 'you', h: 1 }];
  h.set((s) => { s.agents[0]!.blocks = after; s.agents[0]!.lamp = 'off'; s.labels = [termLabel('a0', 'model', 'top', 'the model'), at(after, cap, 0, way === 'compact' ? 'a summary' : 'your brief')]; });
  readout(ctx, sum(after), cap, '…');
  ctx.say(null, way === 'compact' ? 'Compacted: a summary and the 5 files read last are kept.' : 'A new thread: only your brief is in it.');
  await h.wait(900);
  ctx.say('you', way === 'compact' ? 'Now add the date to the export, too.' : 'Brief: date in export.ts, day.month.year.');
  await h.send(route.youToAgent(), 'you');
  h.set((s) => { s.agents[0]!.blocks!.push({ t: 'you', h: 1 }); s.agents[0]!.busy = true; s.agents[0]!.scan = true; });
  await h.wait(1100);
  h.set((s) => { s.agents[0]!.busy = false; s.agents[0]!.scan = false; s.agents[0]!.lamp = way === 'compact' ? 'bad' : 'ok'; });
  ctx.say('model', way === 'compact' ? 'Added. The export shows 2026-03-03.' : 'Added. The export shows 03.03.2026.');
  await h.send(reverse(route.youToAgent()), way === 'compact' ? 'bad' : 'model');
  readout(ctx, sum(after) + 1, cap, way === 'compact' ? 'lost in the summary' : 'in the brief, so kept');
  ctx.say(null, way === 'compact'
    ? 'The summary kept what was done, not the rule you said in passing. A rule you want every time belongs in a file: the next lesson.'
    : 'A new thread holds only what you put in it. Short, and on one job.');
}

// ---------- paste ----------
function paste(ctx: Ctx, what: 'log' | 'lines') {
  const cap = 1000;
  const base: Block[] = [...RULE, ...FIX];
  const p: Block = what === 'log' ? { t: 'you', h: 200 } : { t: 'you', h: 2 };
  const blocks = [...base, p];
  ctx.scene.change((s) => {
    Object.assign(s, view(blocks, cap, [at(blocks, cap, blocks.length - 1, what === 'log' ? 'the whole log: 200k' : '30 failing lines: 2k')]));
  });
  ctx.say('you', what === 'log' ? 'Here’s the whole test log.' : 'Here are the 30 failing lines.');
  readout(ctx, sum(blocks), cap, 'at the bottom, still there');
  ctx.say(null, what === 'log'
    ? 'The whole log: 200k tokens of passing tests around 30 lines that matter, read again on every turn from now on.'
    : 'Only the failing lines: the same information, a hundredth of the size.');
}

/** The rot run's opening picture, for the part 2 overview. */
export const windowView = () => view(MIX.log(), 1000, [], true);

export const windowCh: Chapter = {
  counter: (pairs) => (pairs[1] ? `window ${pairs[1][1]} full` : null),
  steps: {
    pile: { scene: () => view([...RULE], 1000), enter: (ctx) => void ctx.scene.run((h) => pileUp(ctx, h)) },
    rot: { scene: () => view(MIX.job(), 1000, [], true), enter: (ctx) => { ctx.mem.mix = 'job'; void ctx.scene.run((h) => ask(ctx, h, 'job')); } },
    long: { scene: (ctx) => view([...RULE], ctx.keep.cap ?? 1000), enter: (ctx) => { ctx.mem.used = 1020; fill(ctx); } },
    compact: { scene: () => view([...morning(), ...LOG, ...CSV, ...FORM, ...FORM, ...CSV, ...FORM], 1000), enter: (ctx) => void ctx.scene.run((h) => clear(ctx, h, 'compact')) },
    paste: { scene: () => view([...RULE, ...FIX], 1000), enter: (ctx) => paste(ctx, 'log') },
  },
  inputs: {
    used: (ctx, val) => { ctx.mem.used = Number(val); fill(ctx); },
    cap: (ctx, val) => { ctx.keep.cap = Number(val); fill(ctx); },
  },
  actions: {
    mix: (ctx, val) => void ctx.scene.run((h) => ask(ctx, h, val as Mix)),
    clear: (ctx, val) => void ctx.scene.run((h) => clear(ctx, h, val as Way)),
    paste: (ctx, val) => paste(ctx, val as 'log' | 'lines'),
  },
};
