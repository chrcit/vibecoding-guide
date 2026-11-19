// Chapter 9 (Part 2): Make it prove it. Verification gates catch mistakes before "done" reaches you.
import type { Chapter, Ctx } from '../chapter';
import { byLevel } from '../chapter';
import type { Script } from '../scene';
import { solo, lab } from '../presets';
import { route, reverse, SPOT, type XY } from '../picture';

type CheckId = 'tests' | 'look' | 'review';
interface Job { name: string; flaw?: CheckId; says?: Record<'plain' | 'technical' | 'engineer', string> }
const JOBS: Job[] = [
  { name: 'Sort members by rating' },
  {
    name: 'Fix the date bug',
    flaw: 'tests',
    says: {
      plain: 'automated check: 1 of 12 checks failed on empty dates',
      technical: 'vitest + tsc: 1 of 12 unit tests failed (parseDate throws on null)',
      engineer: 'unit suite + strict null check: regression on ISO boundary input',
    },
  },
  { name: 'Add a search box' },
  {
    name: 'Make the list fit a phone',
    flaw: 'look',
    says: {
      plain: 'phone screenshot: the table spills off the right edge',
      technical: 'headless browser at 390 px: horizontal overflow (+68 px)',
      engineer: 'viewport E2E assertion at 390 px: scrollWidth > clientWidth',
    },
  },
  { name: 'Export to CSV' },
  {
    name: 'Let members hide their rating',
    flaw: 'review',
    says: {
      plain: 'second model: hidden ratings still leak into the CSV download',
      technical: 'second-model diff review: csvExport.ts ignores hideRating flag',
      engineer: 'cross-model security review: authorization invariant bypassed in export serializer',
    },
  },
];
const NAMES = (ctx: Ctx): Record<CheckId, string> => ({
  tests: byLevel(ctx.level, { plain: 'automated checks', technical: 'typecheck & unit tests', engineer: 'type & unit test gate' }),
  look: byLevel(ctx.level, { plain: 'a screenshot', technical: 'browser screenshot check', engineer: 'visual E2E check' }),
  review: byLevel(ctx.level, { plain: 'a second model', technical: 'second-model diff review', engineer: 'adversarial model review' }),
});
const toGate: XY[] = [[0, 22], [0, SPOT.gate[1] - 10]];
const gateToYou: XY[] = [[0, SPOT.gate[1] + 10], [0, 94]];

const base = (gate: boolean) => solo({
  tools: true,
  project: true,
  gate,
  labels: [lab('you', 'you', 'left'), lab('a0', 'the model', 'top', 'wiki/model/'), ...(gate ? [lab('gate', 'check', 'top', 'wiki/verification/')] : [])],
});

export async function jobs(ctx: Ctx, h: Script, checks: CheckId[], count = JOBS.length) {
  let said = 0, wrong = 0, caught = 0;
  const gate = checks.length > 0;
  const names = NAMES(ctx);
  const stats = () => ctx.stat([
    ['checks on', checks.length ? checks.map((c) => names[c]).join(', ') : 'none'],
    ['said “done”', said],
    ['caught before reaching you', caught],
    ['slipped through broken', wrong],
  ]);
  h.set((s) => { Object.assign(s, base(gate)); });
  stats();
  for (const job of JOBS.slice(0, count)) {
    ctx.say('you', job.name + '.');
    await h.send(route.youToAgent(), 'you', { ms: 400 });
    h.set((s) => { const a = s.agents[0]!; a.blocks!.push({ t: 'you', h: 1.6 }); a.busy = true; a.lamp = 'work'; });
    await h.wait(480);
    h.set((s) => { const a = s.agents[0]!; a.blocks!.push({ t: 'tool', h: 3 }, { t: 'model', h: 1.4 }); a.busy = false; });
    let flawed = !!job.flaw;
    if (gate) {
      await h.send(toGate, flawed ? 'bad' : 'model', { ms: 300 });
      if (flawed && checks.includes(job.flaw!)) {
        h.set((s) => { s.gates![0]!.lamp = 'bad'; });
        ctx.say('check', job.says![ctx.level]);
        caught++;
        stats();
        await h.send(reverse(toGate), 'bad', { ms: 300 });
        h.set((s) => { const a = s.agents[0]!; a.blocks!.push({ t: 'bad', h: 2.4 }); a.busy = true; });
        await h.wait(560);
        h.set((s) => { const a = s.agents[0]!; a.blocks!.push({ t: 'tool', h: 2.4 }); a.busy = false; });
        await h.send(toGate, 'model', { ms: 300 });
        flawed = false;
      }
      h.set((s) => { s.gates![0]!.lamp = flawed ? 'off' : 'ok'; });
      await h.send(gateToYou, flawed ? 'bad' : 'model', { ms: 300 });
    } else {
      await h.send(reverse(route.youToAgent()), flawed ? 'bad' : 'model', { ms: 440 });
    }
    said++;
    if (flawed) wrong++;
    h.set((s) => { s.agents[0]!.lamp = 'off'; if (s.gates![0]) s.gates![0]!.lamp = 'off'; });
    ctx.say('model', 'Done.');
    stats();
    await h.wait(380);
  }
  ctx.say(null, wrong
    ? `${wrong} of ${said} were broken, yet all ${said} arrived marked “done”.`
    : `All ${said} that reached you were right. ${caught} were caught and fixed automatically by ${checks.map((c) => names[c]).join(', ')}.`);
}

const play = (ctx: Ctx) => void ctx.scene.run((h) => jobs(ctx, h, ctx.mem.checks ?? []));

export const check: Chapter = {
  steps: {
    done: {
      scene: () => base(false),
      enter: (ctx) => {
        ctx.model(
          'No check gate.',
          byLevel(ctx.level, {
            plain: 'An agent sounds equally confident when something works and when it is quietly broken. Never take “done” at face value without a check.',
            technical: 'Without a deterministic gate (typecheck + unit tests), broken edge cases and regressions reach your review queue disguised as finished work.',
            engineer: 'Unverified agent outputs shift error detection onto expensive human review—insert automated oracles before any change crosses the boundary to you.',
          }),
        );
        ctx.mem.checks = [];
        ctx.scene.speed = 1.4;
        play(ctx);
      },
    },
    tests: {
      scene: () => base(true),
      enter: (ctx) => {
        ctx.model(
          'Typecheck & automated test gate.',
          byLevel(ctx.level, {
            plain: 'Put an automatic check in the middle: when a calculation or rule breaks, the agent sees the failure and fixes it before telling you it is done.',
            technical: 'Require `tsc --noEmit` and unit tests (`vitest` / `pytest`) to pass before completion—logic bugs bounce straight back into the agent loop automatically.',
            engineer: 'Fast deterministic type + unit gates turn silent logic regressions into self-healing inner loops at near-zero human cost.',
          }),
        );
        ctx.mem.checks = ['tests'];
        ctx.scene.speed = 1.4;
        play(ctx);
      },
    },
    more: {
      scene: () => base(true),
      enter: (ctx) => {
        ctx.model(
          'Layered checks catch different classes of bugs.',
          byLevel(ctx.level, {
            plain: 'Tests catch broken logic, screenshots catch broken layout on phones, and a second model catches subtle privacy or requirement misses.',
            technical: 'Unit tests miss CSS overflow; visual screenshots miss silent data leaks; cross-model diff review catches spec/auth gaps. Stack all three for real confidence.',
            engineer: 'Defense in depth across orthogonal failure classes: static types + unit/integration suites (logic), headless visual assertions (UI), adversarial diff review (invariants & security).',
          }),
        );
        ctx.mem.checks = ['tests', 'look', 'review'];
        ctx.scene.speed = 1.6;
        play(ctx);
      },
    },
  },
  actions: {
    toggle: (ctx, val, el) => {
      const set = new Set<CheckId>(ctx.mem.checks ?? []);
      if (set.has(val as CheckId)) set.delete(val as CheckId); else set.add(val as CheckId);
      ctx.mem.checks = [...set];
      el.setAttribute('aria-pressed', String(set.has(val as CheckId)));
      ctx.scene.speed = 1.8;
      play(ctx);
    },
    play: (ctx) => play(ctx),
  },
};
