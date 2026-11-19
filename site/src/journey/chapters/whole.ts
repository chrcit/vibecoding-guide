// Overview of Part 2 (The agents): the picture growing through steps 5–13, with level-aware mental-model notes.
import type { Chapter, Ctx } from '../chapter';
import { solo, team, lab, worked } from '../presets';
import { fleet, type FleetOpts } from '../sim';
import { closing } from './team';
import { route, reverse, BUS_Y } from '../picture';
import { rung } from '../rungs';
import { termLabel } from '../terms';
import { LINES } from './chat';
import { job } from './loop';
import { session } from './memory';
import { jobs } from './check';
import { handed } from './handoff';

const you = lab('you', 'you', 'left');
// Labels that name a glossary term follow the reader's level: the check in the lead step reads
// "check", "typecheck · tests" or "tsc --noEmit · npm test" (terms.ts).
const team9 = (ctx: Ctx, o: FleetOpts, opening: string) => void ctx.scene.run(async (h) => { ctx.say(null, opening); ctx.say(null, closing(await fleet(ctx, h, o), o)); });
const again = (ctx: Ctx, fn: Parameters<Ctx['scene']['run']>[0], pause = 1400) => void ctx.scene.run(async (h) => { for (;;) { await fn(h); await h.wait(pause); } });
const note = (ctx: Ctx, id: string) => { const r = rung(id); ctx.model(`${r.n}. ${r.title}.`, r.adds[ctx.level]); };

export const whole: Chapter = {
  steps: {
    chat: {
      scene: () => solo({ labels: [you, lab('a0', 'the model', 'top', 'wiki/model/'), lab('tank:a0', 'its window', 'left', 'wiki/context-window/')] }),
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
      scene: () => solo({ tools: true, project: true, labels: [you, lab('tools', 'tools', 'top', 'wiki/tool-call/'), lab('project', 'your project')] }),
      enter: (ctx) => { note(ctx, 'loop'); ctx.scene.speed = 1.8; again(ctx, (h) => job(ctx, h, { run: true, ask: 'never' })); },
    },
    window: {
      scene: () => solo({ tools: true, project: true, blocks: worked(20), focus: ['a0', 'tools'], labels: [lab('tank:a0', 'its window', 'left', 'wiki/context-window/')] }),
      enter: (ctx) => {
        note(ctx, 'window');
        again(ctx, async (h) => {
          h.set((s) => { s.agents[0]!.blocks = worked(20); s.agents[0]!.lamp = 'off'; });
          for (let i = 0; i < 6; i++) { await h.wait(420); h.set((s) => { s.agents[0]!.blocks!.push({ t: i % 2 ? 'bad' : 'tool', h: 3 + (i % 3) }); }); }
          h.set((s) => { s.agents[0]!.lamp = 'bad'; });
          ctx.say(null, 'Cluttered with old logs—attention rots long before 100%.');
          await h.wait(1100);
          h.set((s) => { s.agents[0]!.blocks = [{ t: 'rules', h: 4 }, { t: 'you', h: 3 }]; s.agents[0]!.lamp = 'ok'; });
          ctx.say(null, 'Fresh thread: clean window, sharp output.');
        }, 2000);
      },
    },
    memory: {
      scene: () => solo({ tools: true, project: { rules: 'plain' }, labels: [you, lab('rules', 'AGENTS.md', 'bottom', 'wiki/instruction-file/')] }),
      enter: (ctx) => { note(ctx, 'memory'); again(ctx, (h) => session(ctx, h, { rules: true }), 1800); },
    },
    check: {
      scene: () => solo({ tools: true, project: true, gate: true, labels: [you, termLabel('gate', 'check')] }),
      enter: (ctx) => { note(ctx, 'check'); ctx.scene.speed = 1.6; again(ctx, (h) => jobs(ctx, h, ['tests', 'look', 'review'], 4)); },
    },
    handoff: {
      scene: () => team(1, { lead: [{ t: 'rules', h: 4 }] }),
      enter: (ctx) => { note(ctx, 'handoff'); again(ctx, (h) => handed(ctx, h), 1800); },
    },
    parallel: {
      scene: () => team(3, { trees: true, lead: [{ t: 'rules', h: 4 }], labels: [you, lab('project', 'main', 'top', 'wiki/branch/')] }),
      enter: (ctx) => { note(ctx, 'parallel'); team9(ctx, { until: 6, name: 'the agent', clashes: true, flaws: false }, 'Three helpers at once, each in its own worktree.'); },
    },
    lead: {
      scene: () => team(5, { trees: true, mgate: true, mixed: true, lead: [{ t: 'rules', h: 4 }], labels: [you, lab('a0', 'the lead', 'top', 'wiki/orchestration/'), termLabel('mgate', 'check'), termLabel('project', 'main')] }),
      enter: (ctx) => { note(ctx, 'lead'); team9(ctx, { gate: true, until: 10 }, 'The lead hands out tasks, checks results, and reports back cleanly.'); },
    },
    fleet: {
      scene: () => {
        const s = team(20, { trees: true, mgate: true, gate: true, mixed: true, lead: [{ t: 'rules', h: 4 }], labels: [you, lab('a0', 'the lead', 'top', 'wiki/orchestration/'), lab('mgate', 'check', 'top', 'wiki/verification/'), lab('project', 'main', 'top', 'wiki/branch/')] });
        s.focus = ['you', 'a0', 'project', [-88, -254, 30], [88, -254, 30], [-110, BUS_Y, 0]];
        return s;
      },
      enter: (ctx) => { note(ctx, 'fleet'); ctx.scene.speed = 1.5; team9(ctx, { gate: true, until: 40 }, 'Twenty builders. Automated checks filter the work; you review what passes.'); },
    },
  },
};
