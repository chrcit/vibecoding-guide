// Overview of Part 2 (The agents): the picture growing through steps 5–13, with level-aware mental-model notes.
import type { Chapter, Ctx } from '../chapter';
import { solo, team, lab } from '../presets';
import { fleet, type FleetOpts } from '../sim';
import { closing, landedLine, watched, fleetChip, FLEET_SPEAKERS } from './team';
import { route, reverse, BUS_Y } from '../picture';
import { rung } from '../rungs';
import { termLabel } from '../terms';
import { LINES } from './chat';
import { job } from './loop';
import { session } from './memory';
import { jobs, LEVEL_CHECKS } from './check';
import { ask, windowView } from './window';
import { handed, SPEAKERS as HANDOFF_SPEAKERS } from './handoff';

const you = lab('you', 'you', 'left');
// Labels that name a glossary term follow the reader's level: the check in the lead step reads
// "check", "typecheck · tests" or "tsc --noEmit · npm test" (terms.ts).
const team9 = (ctx: Ctx, o: FleetOpts, opening: string) => void ctx.scene.run(async (h) => { ctx.say(null, opening); const t = await fleet(watched(ctx, o), h, o); ctx.say('main', landedLine(t)); ctx.say(null, closing(t, o)); });
const again = (ctx: Ctx, fn: Parameters<Ctx['scene']['run']>[0], pause = 1400) => void ctx.scene.run(async (h) => { for (;;) { await fn(h); await h.wait(pause); } });
const note = (ctx: Ctx, id: string) => { const r = rung(id); ctx.model(`${r.n}. ${r.title}.`, r.adds[ctx.level]); };

export const whole: Chapter = {
  steps: {
    chat: {
      scene: () => solo({ labels: [you, termLabel('a0', 'model', 'top', 'the model'), termLabel('tank:a0', 'window', 'left', 'its window')] }),
      enter: (ctx) => {
        note(ctx, 'chat');
        let i = 0;
        again(ctx, async (h) => {
          const [u, m] = LINES[i++ % LINES.length]!;
          h.set((s) => { if (s.agents[0]!.blocks!.length >= 12) s.agents[0]!.blocks = []; });
          ctx.say('you', u);
          await h.send(route.youToAgent(), 'you');
          h.set((s) => { s.agents[0]!.blocks!.push({ t: 'you', h: 3 }); s.agents[0]!.busy = true; });
          await h.wait(700);
          h.set((s) => { s.agents[0]!.blocks!.push({ t: 'model', h: 3 }); s.agents[0]!.busy = false; });
          ctx.say('model', m);
          await h.send(reverse(route.youToAgent()), 'model');
          ctx.stat([['in the window', `${ctx.scene.agent('a0').blocks!.length} messages`]]);
        }, 1100);
      },
    },
    loop: {
      scene: () => solo({ tools: true, project: true, labels: [you, termLabel('tools', 'tools'), termLabel('project', 'project')] }),
      enter: (ctx) => { note(ctx, 'loop'); ctx.scene.speed = 1.8; again(ctx, (h) => job(ctx, h, { run: true, ask: 'never' })); },
    },
    window: {
      scene: () => windowView(),
      enter: (ctx) => {
        note(ctx, 'window');
        const mixes = ['job', 'log'] as const;
        let i = 0;
        again(ctx, (h) => ask(ctx, h, mixes[i++ % 2]!), 2200);
      },
    },
    memory: {
      counter: (pairs) => { const v = String(pairs[0]?.[1] ?? ''); return v ? `AGENTS.md ${v.replace(/, read in every thread$/, '')}` : null; },
      speakers: { window: 'tank:a0' },
      scene: () => solo({ tools: true, project: { rules: 'plain' }, labels: [you, termLabel('rules', 'instructions', 'bottom')] }),
      enter: (ctx) => { note(ctx, 'memory'); again(ctx, (h) => session(ctx, h, { rules: true }), 1800); },
    },
    check: {
      counter: 'reached you broken',
      scene: () => solo({ tools: true, project: true, gate: true, labels: [you, termLabel('gate', 'check')] }),
      enter: (ctx) => { note(ctx, 'check'); ctx.scene.speed = 1.6; again(ctx, (h) => jobs(ctx, h, LEVEL_CHECKS[ctx.level])); },
    },
    handoff: {
      speakers: HANDOFF_SPEAKERS,
      scene: () => team(1, { lead: [{ t: 'rules', h: 4 }] }),
      enter: (ctx) => { note(ctx, 'handoff'); again(ctx, (h) => handed(ctx, h), 1800); },
    },
    parallel: {
      counter: fleetChip,
      speakers: FLEET_SPEAKERS,
      scene: () => team(3, { trees: true, lead: [{ t: 'rules', h: 4 }], labels: [you, termLabel('project', 'main')] }),
      enter: (ctx) => { note(ctx, 'parallel'); team9(ctx, { until: 6, name: 'the agent', clashes: true, flaws: false }, 'Three helpers, each in its own copy of the project.'); },
    },
    lead: {
      counter: fleetChip,
      speakers: FLEET_SPEAKERS,
      scene: () => team(5, { trees: true, mgate: true, mixed: true, lead: [{ t: 'rules', h: 4 }], labels: [you, termLabel('a0', 'lead', 'top', 'the lead'), termLabel('mgate', 'check'), termLabel('project', 'main')] }),
      enter: (ctx) => { note(ctx, 'lead'); team9(ctx, { gate: true, until: 12 }, 'The lead hands out tasks and merges what passes the check.'); },
    },
    fleet: {
      counter: fleetChip,
      speakers: FLEET_SPEAKERS,
      scene: () => {
        const s = team(20, { trees: true, mgate: true, gate: true, mixed: true, lead: [{ t: 'rules', h: 4 }], labels: [you, termLabel('a0', 'lead', 'top', 'the lead'), termLabel('mgate', 'check'), termLabel('project', 'main')] });
        s.focus = ['you', 'a0', 'project', [-88, -254, 30], [88, -254, 30], [-110, BUS_Y, 0]];
        return s;
      },
      enter: (ctx) => { note(ctx, 'fleet'); ctx.scene.speed = 1.5; team9(ctx, { gate: true, until: 40 }, 'Twenty helpers, forty tasks, one check in front of main.'); },
    },
  },
};
