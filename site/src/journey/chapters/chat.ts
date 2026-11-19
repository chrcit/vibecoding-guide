// Chapter 1: one chat. A model, a window, and nothing else.
import type { Chapter, Ctx } from '../chapter';
import { solo, lab } from '../presets';
import { route, reverse } from '../picture';

const LINES: [string, string][] = [
  ['My name is Sam. I run a chess club.', 'Hello Sam. What does the club need?'],
  ['A list of members with their ratings.', 'I can make that. Who is on it?'],
  ['What is my name?', 'Sam.'],
];
const labels = [lab('you', 'you', 'left'), lab('a0', 'the model', 'top', 'wiki/model/'), lab('tank:a0', 'its window', 'left', 'wiki/context-window/')];
const base = (blocks = [] as { t: 'you' | 'model'; h: number }[]) => solo({ blocks, labels });
const said = (n: number) => LINES.slice(0, n).flatMap(() => [{ t: 'you' as const, h: 3 }, { t: 'model' as const, h: 3 }]);

/** One exchange: your words go in, the model reads everything, its answer goes in too. */
async function exchange(ctx: Ctx, you: string, model: string) {
  const { scene } = ctx;
  await scene.run(async (h) => {
    ctx.say('you', you);
    await h.send(route.youToAgent(), 'you');
    h.set((s) => { s.agents[0]!.blocks!.push({ t: 'you', h: 3 }); s.agents[0]!.busy = true; s.agents[0]!.scan = true; });
    await h.wait(900);
    h.set((s) => { s.agents[0]!.blocks!.push({ t: 'model', h: 3 }); s.agents[0]!.busy = false; s.agents[0]!.scan = false; });
    ctx.say('model', model);
    await h.send(reverse(route.youToAgent()), 'model');
    ctx.stat([['in the window', `${scene.agent('a0').blocks!.length} messages`]]);
  });
}

export const chat: Chapter = {
  steps: {
    two: { scene: () => base() },
    send: {
      scene: () => base(),
      enter: (ctx) => { ctx.mem.i = 1; void exchange(ctx, ...LINES[0]!); },
    },
    reread: {
      scene: () => base(said(2)),
      enter: (ctx) => { void exchange(ctx, ...LINES[2]!); },
    },
    fresh: {
      scene: () => base(said(3)),
      enter: (ctx) => { ctx.say(null, 'Three exchanges are in the window.'); ctx.stat([['in the window', '6 messages']]); },
    },
  },
  actions: {
    send: (ctx) => {
      const i = ctx.mem.i ?? 0;
      ctx.mem.i = i + 1;
      void exchange(ctx, ...LINES[i % LINES.length]!);
    },
    newchat: (ctx) => {
      ctx.scene.stop();
      ctx.scene.change((s) => { s.agents[0]!.blocks = []; s.agents[0]!.busy = false; s.agents[0]!.scan = false; });
      ctx.say(null, 'A new chat. The window is empty.');
      ctx.stat([['in the window', '0 messages']]);
    },
    ask: (ctx) => {
      const knows = (ctx.scene.agent('a0').blocks ?? []).length > 0;
      void exchange(ctx, 'What is my name?', knows ? 'Sam.' : 'I can’t tell. Nothing in this chat says.');
    },
  },
};
