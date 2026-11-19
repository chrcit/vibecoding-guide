// The overview: the picture growing through all nine steps, one short loop each.
import type { Chapter, Ctx } from '../chapter';
import { solo, team, lab, worked } from '../presets';
import { fleet, type FleetOpts } from '../sim';
import { closing } from './team';
import { route, reverse, BUS_Y } from '../picture';
import { LINES } from './chat';
import { job } from './loop';
import { session } from './memory';
import { jobs } from './check';
import { handed } from './handoff';

const you = lab('you', 'you', 'left');
/** One run of the team, ending with what came of it. */
const team9 = (ctx: Ctx, o: FleetOpts, opening: string) => void ctx.scene.run(async (h) => { ctx.say(null, opening); ctx.say(null, closing(await fleet(ctx, h, o), o)); });
const again = (ctx: Ctx, fn: Parameters<Ctx['scene']['run']>[0], pause = 1400) => void ctx.scene.run(async (h) => { for (;;) { await fn(h); await h.wait(pause); } });

export const whole: Chapter = {
  steps: {
    chat: {
      scene: () => solo({ labels: [you, lab('a0', 'the model', 'top', 'wiki/model/'), lab('tank:a0', 'its window', 'left', 'wiki/context-window/')] }),
      enter: (ctx) => { let i = 0; again(ctx, async (h) => {
        const [you, model] = LINES[i++ % LINES.length]!;
        h.set((s) => { if (s.agents[0]!.blocks!.length >= 12) s.agents[0]!.blocks = []; });
        ctx.say('you', you);
        await h.send(route.youToAgent(), 'you');
        h.set((s) => { s.agents[0]!.blocks!.push({ t: 'you', h: 3 }); s.agents[0]!.busy = true; });
        await h.wait(700);
        h.set((s) => { s.agents[0]!.blocks!.push({ t: 'model', h: 3 }); s.agents[0]!.busy = false; });
        ctx.say('model', model);
        await h.send(reverse(route.youToAgent()), 'model');
        ctx.stat([['in the window', `${ctx.scene.agent('a0').blocks!.length} messages`]]);
      }, 1100); },
    },
    loop: {
      scene: () => solo({ tools: true, project: true, labels: [you, lab('tools', 'tools', 'top', 'wiki/tool-call/'), lab('project', 'your project')] }),
      enter: (ctx) => { ctx.scene.speed = 1.8; again(ctx, (h) => job(ctx, h, { run: true, ask: 'never' })); },
    },
    window: {
      scene: () => solo({ tools: true, project: true, blocks: worked(20), focus: ['a0', 'tools'], labels: [lab('tank:a0', 'its window', 'left', 'wiki/context-window/')] }),
      enter: (ctx) => again(ctx, async (h) => {
        h.set((s) => { s.agents[0]!.blocks = worked(20); s.agents[0]!.lamp = 'off'; });
        for (let i = 0; i < 6; i++) { await h.wait(420); h.set((s) => { s.agents[0]!.blocks!.push({ t: i % 2 ? 'model' : 'tool', h: 3 + (i % 3) }); }); }
        h.set((s) => { s.agents[0]!.lamp = 'bad'; });
        await h.wait(1100);
        h.set((s) => { s.agents[0]!.blocks = [{ t: 'sum', h: 6 }, { t: 'tool', h: 4 }, { t: 'model', h: 2 }]; s.agents[0]!.lamp = 'off'; });
        ctx.say(null, 'Full. The pile is swapped for a summary.');
      }, 2200),
    },
    memory: {
      scene: () => solo({ tools: true, project: { rules: 'plain' }, labels: [you, lab('rules', 'AGENTS.md', 'bottom', 'wiki/instruction-file/')] }),
      enter: (ctx) => again(ctx, (h) => session(ctx, h, { rules: true }), 1800),
    },
    check: {
      scene: () => solo({ tools: true, project: true, gate: true, labels: [you, lab('gate', 'check', 'top', 'wiki/verification/')] }),
      enter: (ctx) => { ctx.scene.speed = 1.6; again(ctx, (h) => jobs(ctx, h, ['tests', 'look', 'review'], 4)); },
    },
    handoff: {
      scene: () => team(1, { lead: [{ t: 'rules', h: 4 }] }),
      enter: (ctx) => again(ctx, (h) => handed(ctx, h), 1800),
    },
    parallel: {
      scene: () => team(3, { trees: true, lead: [{ t: 'rules', h: 4 }], labels: [you, lab('project', 'main', 'top', 'wiki/branch/')] }),
      enter: (ctx) => team9(ctx, { until: 6, name: 'the agent', clashes: true, flaws: false }, 'Three helpers at once, each in its own copy of the project.'),
    },
    lead: {
      scene: () => team(5, { trees: true, mgate: true, mixed: true, lead: [{ t: 'rules', h: 4 }], labels: [you, lab('a0', 'the lead', 'top', 'wiki/orchestration/'), lab('mgate', 'check', 'top', 'wiki/verification/'), lab('project', 'main', 'top', 'wiki/branch/')] }),
      enter: (ctx) => team9(ctx, { gate: true, until: 10 }, 'The lead hands out the tasks and reads a short report from each.'),
    },
    fleet: {
      scene: () => {
        const s = team(20, { trees: true, mgate: true, gate: true, mixed: true, lead: [{ t: 'rules', h: 4 }], labels: [you, lab('a0', 'the lead', 'top', 'wiki/orchestration/'), lab('mgate', 'check', 'top', 'wiki/verification/'), lab('project', 'main', 'top', 'wiki/branch/')] });
        s.focus = ['you', 'a0', 'project', [-88, -254, 30], [88, -254, 30], [-110, BUS_Y, 0]];
        return s;
      },
      enter: (ctx) => { ctx.scene.speed = 1.5; team9(ctx, { gate: true, until: 40 }, 'Twenty builders. You read what gets through the check.'); },
    },
  },
};
